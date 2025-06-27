import type { ModelInfo } from "../model.js"

// shengSuanYun
// https://router.shengsuanyun.com
export const shengSuanYunDefaultModelId = "anthropic/claude-sonnet-4"

export const shengSuanYunDefaultModelInfo: ModelInfo = {
	maxTokens: 64_000,
	contextWindow: 200_000,
	supportsImages: true,
	supportsComputerUse: true,
	supportsPromptCache: true,
	inputPrice: 3.0,
	outputPrice: 15.0,
	cacheWritesPrice: 3.75,
	cacheReadsPrice: 0.3,
	description:
		"Claude Sonnet 4 显著增强了其前代产品 Sonnet 3.7 的能力，在编码和推理任务方面均表现出色，并具有更高的精确度和可控性。Sonnet 4 在 SWE-bench 测试中取得了业界领先的 72.7% 的成绩，它平衡了强大的功能与计算效率，使其适用于从日常编码任务到复杂软件开发项目的广泛应用。其关键增强功能包括改进的自主代码库导航能力、降低了代理驱动工作流程中的错误率，以及提高了遵循复杂指令的可靠性。Sonnet 4 针对实际日常使用进行了优化，在保持多样化内部和外部场景中的效率和响应能力的同时，提供了先进的推理能力。可通过reasoning.max_tokens开启思考并控制思维链长度。",
}
