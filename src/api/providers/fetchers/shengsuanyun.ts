import axios from "axios"
import { ModelInfo } from "../../../shared/api"

export async function getShengSuanYunModels(): Promise<Record<string, ModelInfo>> {
	const models: Record<string, ModelInfo> = {}
	const parsePrice = (price: any) => {
		if (price) {
			return parseInt(price) / 10000
		}
		return undefined
	}
	try {
		const url = "https://router.shengsuanyun.com/api/v1/models/"
		const response = await axios.get(url)
		const rawModels = response.data.data
		for (const rawModel of rawModels) {
			const isSPTImg = rawModel.architecture?.input.includes("image") || false
			const modelInfo: ModelInfo = {
				maxTokens: rawModel.max_tokens,
				contextWindow: rawModel.context_window,
				supportsPromptCache: rawModel.supports_prompt_cache,
				supportsImages: isSPTImg,
				supportsComputerUse: isSPTImg,
				inputPrice: parsePrice(rawModel.pricing.prompt),
				outputPrice: parsePrice(rawModel.pricing.completion),
				description: rawModel.description,
				cacheWritesPrice: 0,
				cacheReadsPrice: parsePrice(rawModel.pricing.cache),
			}
			models[rawModel.api_name] = modelInfo
		}
	} catch (error) {
		console.error(
			`Error fetching ShengSuanYun models: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
		)
	}

	return models
}
