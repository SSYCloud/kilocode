import type { ModelInfo } from "../model.js"

// shengSuanYun
// https://www.shengsuanyun.com/
export const shengSuanYunDefaultModelId = "aanthropic/claude-sonnet-4.5"

export const shengSuanYunDefaultModelInfo: ModelInfo = {
	maxTokens: 64_000,
	contextWindow: 200_000,
	supportsImages: true,
	supportsPromptCache: true,
	inputPrice: 3.0,
	outputPrice: 15.0,
	cacheWritesPrice: 3.75,
	cacheReadsPrice: 0.3,
	description:
		"Claude Sonnet 4.5 是 Anthropic 迄今为止最先进的 Sonnet 模型，针对真实代理和编码工作流程进行了优化。它在 SWE-bench Verified 等编码基准测试中展现出顶尖性能，并在系统设计、代码安全性和规范遵循性方面均有所改进。该模型旨在实现扩展自主操作，保持跨会话的任务连续性，并提供基于事实的进度跟踪。\n\nSonnet 4.5 还引入了更强大的代理功能，包括改进的工具编排、推测并行执行以及更高效的上下文和内存管理。凭借增强的上下文跟踪和跨工具调用的令牌使用感知功能，它尤其适用于多上下文和长时间运行的工作流。用例涵盖软件工程、网络安全、财务分析、研究代理以及其他需要持续推理和工具使用的领域。",
}
