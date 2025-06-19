import { Anthropic } from "@anthropic-ai/sdk"
import { BetaThinkingConfigParam } from "@anthropic-ai/sdk/resources/beta"
import OpenAI from "openai"

import {
	ApiHandlerOptions,
	ModelRecord,
	shengSuanYunDefaultModelId,
	shengSuanYunDefaultModelInfo,
} from "../../shared/api"

import { convertToOpenAiMessages } from "../transform/openai-format"
import { ApiStreamChunk } from "../transform/stream"
import { convertToR1Format } from "../transform/r1-format"

import { SingleCompletionHandler } from "../index"
import { DEFAULT_HEADERS } from "./constants"
import { getModelParams } from "../transform/model-params"

import { BaseProvider } from "./base-provider"
import { getModels } from "./fetchers/modelCache"

type ShengSuanYunChatCompletionParams = OpenAI.Chat.ChatCompletionCreateParams & {
	transforms?: string[]
	include_reasoning?: boolean
	thinking?: BetaThinkingConfigParam
	// https://shengSuanYun.ai/docs/use-cases/reasoning-tokens
	reasoning?: {
		effort?: "high" | "medium" | "low"
		max_tokens?: number
		exclude?: boolean
	}
}

interface CompletionUsage {
	completion_tokens?: number
	completion_tokens_details?: {
		reasoning_tokens?: number
	}
	prompt_tokens?: number
	prompt_tokens_details?: {
		cached_tokens?: number
	}
	total_tokens?: number
	cost?: number
}

export class ShengSuanYunHandler extends BaseProvider implements SingleCompletionHandler {
	protected options: ApiHandlerOptions
	private client: OpenAI
	protected models: ModelRecord = {}

	constructor(options: ApiHandlerOptions) {
		super()
		this.options = options
		const baseURL = "https://router.shengsuanyun.com/api/v1"
		const apiKey = this.options.shengSuanYunApiKey ?? "not-provided"
		this.client = new OpenAI({ baseURL, apiKey, defaultHeaders: DEFAULT_HEADERS })
	}

	override async *createMessage(
		systemPrompt: string,
		messages: Anthropic.Messages.MessageParam[],
	): AsyncGenerator<ApiStreamChunk> {
		this.models = await getModels({ provider: "shengsuanyun" })
		let { id: modelId, info } = this.getModel()

		// Convert Anthropic messages to OpenAI format.
		let openAiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
			{ role: "system", content: systemPrompt },
			...convertToOpenAiMessages(messages),
		]

		if (info.supportsPromptCache) {
			openAiMessages[0] = {
				role: "system",
				content: [
					{
						type: "text",
						text: systemPrompt,
						// @ts-ignore-next-line
						cache_control: { type: "ephemeral" },
					},
				],
			}
			// Add cache_control to the last two user messages
			// (note: this works because we only ever add one user message at a time, but if we added multiple we'd need to mark the user message before the last assistant message)
			const lastTwoUserMessages = openAiMessages.filter((msg) => msg.role === "user").slice(-2)
			lastTwoUserMessages.forEach((msg) => {
				if (typeof msg.content === "string") {
					msg.content = [{ type: "text", text: msg.content }]
				}
				if (Array.isArray(msg.content)) {
					// NOTE: this is fine since env details will always be added at the end. but if it weren't there, and the user added a image_url type message, it would pop a text part before it and then move it after to the end.
					let lastTextPart = msg.content.filter((part) => part.type === "text").pop()

					if (!lastTextPart) {
						lastTextPart = { type: "text", text: "..." }
						msg.content.push(lastTextPart)
					}
					// @ts-ignore-next-line
					lastTextPart["cache_control"] = { type: "ephemeral" }
				}
			})
		}

		let maxTokens: number | undefined
		switch (modelId) {
			case "anthropic/claude-3.7-sonnet":
			case "anthropic/claude-3.7-sonnet:beta":
			case "anthropic/claude-3.7-sonnet:thinking":
			case "anthropic/claude-3-7-sonnet":
			case "anthropic/claude-3-7-sonnet:beta":
			case "anthropic/claude-3.5-sonnet":
			case "anthropic/claude-3.5-sonnet:beta":
			case "anthropic/claude-3.5-sonnet-20240620":
			case "anthropic/claude-3.5-sonnet-20240620:beta":
			case "anthropic/claude-3-5-haiku":
			case "anthropic/claude-3-5-haiku:beta":
			case "anthropic/claude-3-5-haiku-20241022":
			case "anthropic/claude-3-5-haiku-20241022:beta":
				maxTokens = 8_192
				break
		}

		let temperature: number | undefined = 0
		let topP: number | undefined = undefined
		if (
			modelId.startsWith("deepseek/deepseek-r1") ||
			modelId.startsWith("deepseek/deepseek-v3") ||
			modelId.startsWith("deepseek/deepseek-chat") ||
			modelId.startsWith("deepseek/deepseek-reason") ||
			modelId === "perplexity/sonar-reasoning" ||
			modelId === "qwen/qwq-32b:free" ||
			modelId === "qwen/qwq-32b"
		) {
			// Recommended values from DeepSeek
			temperature = 0.7
			topP = 0.95
			openAiMessages = convertToR1Format([{ role: "user", content: systemPrompt }, ...messages])
		}

		let reasoning: { max_tokens: number } | undefined = undefined
		switch (modelId) {
			case "anthropic/claude-3.7-sonnet":
			case "anthropic/claude-3.7-sonnet:beta":
			case "anthropic/claude-3.7-sonnet:thinking":
			case "anthropic/claude-3-7-sonnet":
			case "anthropic/claude-3-7-sonnet:beta": {
				let budget_tokens = this.options.modelMaxThinkingTokens || 0
				const reasoningOn = budget_tokens !== 0 ? true : false
				if (reasoningOn) {
					temperature = undefined // extended thinking does not support non-1 temperature
					reasoning = { max_tokens: budget_tokens }
				}
				break
			}
		}
		// DeepSeek highly recommends using user instead of system role.
		if (modelId.startsWith("deepseek/deepseek-r1") || modelId === "perplexity/sonar-reasoning") {
			openAiMessages = convertToR1Format([{ role: "user", content: systemPrompt }, ...messages])
		}

		let shouldApplyMiddleOutTransform = this.options.openRouterUseMiddleOutTransform
		if (modelId === "deepseek/deepseek-chat") {
			shouldApplyMiddleOutTransform = true
		}
		const completionParams: ShengSuanYunChatCompletionParams = {
			model: modelId,
			...(maxTokens && maxTokens > 0 && { max_tokens: maxTokens }),
			temperature,
			top_p: topP,
			messages: openAiMessages,
			stream: true,
			stream_options: { include_usage: true },

			// This way, the transforms field will only be included in the parameters when shengSuanYunUseMiddleOutTransform is true.
			...((shouldApplyMiddleOutTransform ?? true) && { transforms: ["middle-out"] }),
		}
		let stream = await this.client.chat.completions.create(completionParams)
		let lastUsage: CompletionUsage | undefined = undefined

		try {
			for await (const chunk of stream) {
				// shengSuanYun returns an error object instead of the OpenAI SDK throwing an error.
				if ("error" in chunk) {
					const error = chunk.error as { message?: string; code?: number }
					console.error(`shengSuanYun API Error: ${error?.code} - ${error?.message}`)
					throw new Error(`shengSuanYun API Error ${error?.code}: ${error?.message}`)
				}

				const delta = chunk.choices[0]?.delta

				if ("reasoning" in delta && delta.reasoning && typeof delta.reasoning === "string") {
					yield { type: "reasoning", text: delta.reasoning }
				}

				if (delta?.content) {
					yield { type: "text", text: delta.content }
				}

				if (chunk.usage) {
					lastUsage = chunk.usage
				}
			}
		} catch (error) {
			let errorMessage = makeshengSuanYunErrorReadable(error)
			throw new Error(errorMessage)
		}

		if (lastUsage) {
			yield {
				type: "usage",
				inputTokens: lastUsage.prompt_tokens || 0,
				outputTokens: lastUsage.completion_tokens || 0,
				// Waiting on shengSuanYun to figure out what this represents in the Gemini case
				// and how to best support it.
				// cacheReadTokens: lastUsage.prompt_tokens_details?.cached_tokens,
				reasoningTokens: lastUsage.completion_tokens_details?.reasoning_tokens,
				totalCost: lastUsage.cost || 0,
			}
		}
	}

	override getModel() {
		const id = this.options.shengSuanYunModelId ?? shengSuanYunDefaultModelId
		const info = this.models[id] ?? shengSuanYunDefaultModelInfo
		const isDeepSeekR1 = id.startsWith("deepseek/deepseek-r1") || id === "perplexity/sonar-reasoning"

		const params = getModelParams({
			format: "openrouter",
			modelId: id,
			model: info,
			settings: this.options,
		})
		return {
			id,
			info,
			...params,
			topP: isDeepSeekR1 ? 0.95 : undefined,
		}
	}

	async completePrompt(prompt: string) {
		this.models = await getModels({ provider: "shengsuanyun" })
		let { id: modelId, maxTokens, temperature } = this.getModel()

		const completionParams: ShengSuanYunChatCompletionParams = {
			model: modelId,
			max_tokens: maxTokens,
			temperature,
			messages: [{ role: "user", content: prompt }],
			stream: false,
		}

		const response = await this.client.chat.completions.create(completionParams)
		if ("error" in response) {
			const error = response.error as { message?: string; code?: number }
			throw new Error(`shengSuanYun API Error ${error?.code}: ${error?.message}`)
		}
		const completion = response as OpenAI.Chat.ChatCompletion
		return completion.choices[0]?.message?.content || ""
	}
}

// kilocode_change start
function makeshengSuanYunErrorReadable(error: any) {
	if (error?.code === 429) {
		let retryAfter
		try {
			const parsedJson = JSON.parse(error.error.metadata?.raw)
			retryAfter = parsedJson?.error?.details.map((detail: any) => detail.retryDelay).filter((r: any) => r)[0]
		} catch (e) {}
		if (retryAfter) {
			return `Rate limit exceeded, try again in ${retryAfter}.`
		}
		return `Rate limit exceeded, try again later.\n${error?.message || error}`
	}
	return `shengSuanYun API Error: ${error?.message || error}`
}
// kilocode_change end
