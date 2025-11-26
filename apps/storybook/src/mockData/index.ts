// kilocode_change - new file
export * from "./clineMessages"

export const mockMarketplaceItems = [
	{
		id: "filesystem-mcp",
		name: "文件系统 MCP",
		description: "提供用于读取、写入和管理本地文件系统上的文件和目录的工具。",
		author: "Anthropic",
		tags: ["files", "filesystem", "core"],
		type: "mcp" as const,
		url: "https://github.com/anthropics/mcp-filesystem",
		content: "npm install @anthropic-ai/mcp-filesystem",
	},
	{
		id: "database-mcp",
		name: "Database MCP",
		description: "Connect to and query various databases including PostgreSQL, MySQL, and SQLite.",
		author: "Community",
		tags: ["database", "sql", "data"],
		type: "mcp" as const,
		url: "https://github.com/community/mcp-database",
		content: "npm install mcp-database",
	},
	{
		id: "architect-mode",
		name: "Architect Mode",
		description: "Plan and design system architecture before implementation. Perfect for complex projects.",
		author: "Kilocode",
		tags: ["planning", "design", "architecture"],
		type: "mode" as const,
		content:
			"slug: architect\nname: Architect\nmodel: anthropic/claude-sonnet-4\nprompt: |\n  You are an experienced software architect.",
	},
	{
		id: "debug-mode",
		name: "Debug Mode",
		description: "Advanced debugging capabilities with step-by-step analysis and error tracking.",
		author: "Kilocode",
		tags: ["debugging", "analysis", "troubleshooting"],
		type: "mode" as const,
		content:
			"slug: debug\nname: Debug\nmodel: anthropic/claude-sonnet-4\nprompt: |\n  You are a debugging specialist.",
	},
]

export const mockModes = [
	{
		slug: "code",
		name: "编程",
		description: "编写、修改或重构代码。非常适合在任何编程语言或框架中实现功能、修复错误、创建新文件或改进代码。",
		roleDefinition:
			"You are Kilo Code, a highly skilled software engineer with extensive knowledge in many programming languages, frameworks, design patterns, and best practices.",
		whenToUse: "Use this mode when you need to write, modify, or refactor code.",
		groups: ["edit", "read", "command"],
		source: "builtin" as const,
	},
	{
		slug: "architect",
		name: "架构",
		description: "在实施之前进行规划、设计或制定策略。非常适合分解复杂问题、创建技术规范和设计系统架构。",
		roleDefinition: "You are an experienced software architect specializing in system design and planning.",
		whenToUse: "Use this mode when you need to plan, design, or strategize before implementation.",
		groups: ["edit", "read"],
		source: "builtin" as const,
	},
]

export const createMockMarketplaceStateManager = (activeTab: "mcp" | "mode" = "mcp") => ({
	getState: () => ({
		allItems: mockMarketplaceItems,
		organizationMcps: [],
		displayItems: mockMarketplaceItems,
		displayOrganizationMcps: [],
		isFetching: false,
		activeTab,
		filters: {
			type: "",
			search: "",
			tags: [],
			installed: "all" as const,
		},
		installedMetadata: { global: {}, project: {} },
	}),
	transition: () => Promise.resolve(),
	onStateChange: () => () => {},
	cleanup: () => {},
	handleMessage: () => Promise.resolve(),
})
