import type { ModelInfo } from "../model.js"

// shengSuanYun
// https://router.shengsuanyun.com
export const shengSuanYunDefaultModelId = "coding/claude-4-sonnet"

export const shengSuanYunDefaultModelInfo: ModelInfo = {
	maxTokens: 8192,
	contextWindow: 200_000,
	supportsImages: true,
	supportsComputerUse: true,
	supportsPromptCache: true,
	inputPrice: 3.0,
	outputPrice: 15.0,
	cacheWritesPrice: 3.75,
	cacheReadsPrice: 0.3,
	description:
		"The best coding model, optimized by shengSuanYun, and automatically routed to the fastest provider. Claude 4 Sonnet is an advanced large language model with improved reasoning, coding, and problem-solving capabilities.",
}
