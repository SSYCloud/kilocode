import { z } from "zod"

import { toolGroupsSchema } from "./tool.js"

/**
 * GroupOptions
 */

export const groupOptionsSchema = z.object({
	fileRegex: z
		.string()
		.optional()
		.refine(
			(pattern) => {
				if (!pattern) {
					return true // Optional, so empty is valid.
				}

				try {
					new RegExp(pattern)
					return true
				} catch {
					return false
				}
			},
			{ message: "Invalid regular expression pattern" },
		),
	description: z.string().optional(),
})

export type GroupOptions = z.infer<typeof groupOptionsSchema>

/**
 * GroupEntry
 */

export const groupEntrySchema = z.union([toolGroupsSchema, z.tuple([toolGroupsSchema, groupOptionsSchema])])

export type GroupEntry = z.infer<typeof groupEntrySchema>

/**
 * ModeConfig
 */

const groupEntryArraySchema = z.array(groupEntrySchema).refine(
	(groups) => {
		const seen = new Set()

		return groups.every((group) => {
			// For tuples, check the group name (first element).
			const groupName = Array.isArray(group) ? group[0] : group

			if (seen.has(groupName)) {
				return false
			}

			seen.add(groupName)
			return true
		})
	},
	{ message: "Duplicate groups are not allowed" },
)

export const modeConfigSchema = z.object({
	slug: z.string().regex(/^[a-zA-Z0-9-]+$/, "Slug must contain only letters numbers and dashes"),
	name: z.string().min(1, "Name is required"),
	roleDefinition: z.string().min(1, "Role definition is required"),
	whenToUse: z.string().optional(),
	description: z.string().optional(),
	customInstructions: z.string().optional(),
	groups: groupEntryArraySchema,
	source: z.enum(["global", "project", "organization"]).optional(), // kilocode_change: Added "organization" source
	iconName: z.string().optional(), // kilocode_change
})

export type ModeConfig = z.infer<typeof modeConfigSchema>

/**
 * CustomModesSettings
 */

export const customModesSettingsSchema = z.object({
	customModes: z.array(modeConfigSchema).refine(
		(modes) => {
			const slugs = new Set()

			return modes.every((mode) => {
				if (slugs.has(mode.slug)) {
					return false
				}

				slugs.add(mode.slug)
				return true
			})
		},
		{
			message: "Duplicate mode slugs are not allowed",
		},
	),
})

export type CustomModesSettings = z.infer<typeof customModesSettingsSchema>

/**
 * PromptComponent
 */

export const promptComponentSchema = z.object({
	roleDefinition: z.string().optional(),
	whenToUse: z.string().optional(),
	description: z.string().optional(),
	customInstructions: z.string().optional(),
})

export type PromptComponent = z.infer<typeof promptComponentSchema>

/**
 * CustomModePrompts
 */

export const customModePromptsSchema = z.record(z.string(), promptComponentSchema.optional())

export type CustomModePrompts = z.infer<typeof customModePromptsSchema>

/**
 * CustomSupportPrompts
 */

export const customSupportPromptsSchema = z.record(z.string(), z.string().optional())

export type CustomSupportPrompts = z.infer<typeof customSupportPromptsSchema>

/**
 * DEFAULT_MODES
 */

export const DEFAULT_MODES: readonly ModeConfig[] = [
	{
		slug: "architect",
		// kilocode_change start
		name: "架构",
		iconName: "codicon-type-hierarchy-sub",
		// kilocode_change end
		roleDefinition:
			"您是 Kilo Code，一位经验丰富的技术领导者，您求知欲强，规划能力出色。您的目标是收集信息并了解背景，从而制定一份详细的用户任务完成计划。用户将在切换到下一个模式实施解决方案之前审核并批准该计划。",
		whenToUse:
			"当您需要在实施前进行规划、设计或制定策略时，请使用此模式。它非常适合分解复杂问题、创建技术规范、设计系统架构或在编码前集思广益地提出解决方案。",
		description: "实施前需进行规划和设计",
		groups: ["read", ["edit", { fileRegex: "\\.md$", description: "Markdown files only" }], "browser", "mcp"],
		customInstructions:
			'1. 使用提供的工具收集信息，以了解更多关于任务的背景信息。\n\n2. 您还应该向用户提出澄清问题，以便更好地理解任务。\n\n3. 了解用户请求的更多背景信息后，将任务分解为清晰、可操作的步骤，并使用 `update_todo_list` 工具创建待办事项列表。每个待办事项应满足以下条件：\n - 具体且可操作\n - 按逻辑执行顺序排列\n - 专注于单一、明确的结果\n - 足够清晰，以便其他模式可以独立执行\n\n **注意：** 如果 `update_todo_list` 工具不可用，请将计划写入 Markdown 文件（例如，`plan.md` 或 `todo.md`）。\n\n4. 随着您收集更多信息或发现新的需求，请更新待办事项列表，以反映当前对需要完成的工作的理解。\n\n5.询问用户是否对方案满意，或者是否需要进行任何修改。您可以将其视为一次头脑风暴会议，讨论任务并完善待办事项清单。\n\n6. 如果 Mermaid 图有助于阐明复杂的工作流程或系统架构，请将其包含在内。请避免在 Mermaid 图中在方括号 ([]) 内使用双引号 ("") 和圆括号 ()，因为这可能会导致解析错误。\n\n7. 使用 switch_mode 工具请求用户切换到另一种模式来实施解决方案。\n\n**重要提示：请专注于创建清晰、可操作的待办事项清单，而不是冗长的 Markdown 文档。将待办事项清单作为您的主要规划工具，用于跟踪和组织需要完成的工作。**',
	},
	{
		slug: "code",
		// kilocode_change start
		name: "编程",
		iconName: "codicon-code",
		// kilocode_change end
		roleDefinition: "你是 Kilo Code，一位技术精湛的软件工程师，精通多种编程语言、框架、设计模式和最佳实践。",
		whenToUse:
			"当您需要编写、修改或重构代码时，请使用此模式。它非常适合实现新功能、修复错误、创建新文件或改进任何编程语言或框架中的代码。",
		description: "编写、修改和重构代码",
		groups: ["read", "edit", "browser", "command", "mcp"],
	},
	{
		slug: "ask",
		// kilocode_change start
		name: "问答",
		iconName: "codicon-question",
		// kilocode_change end
		roleDefinition:
			"You are Kilo Code, a knowledgeable technical assistant focused on answering questions and providing information about software development, technology, and related topics.",
		whenToUse:
			"Use this mode when you need explanations, documentation, or answers to technical questions. Best for understanding concepts, analyzing existing code, getting recommendations, or learning about technologies without making changes.",
		description: "获取答案和解释",
		groups: ["read", "browser", "mcp"],
		customInstructions:
			"You can analyze code, explain concepts, and access external resources. Always answer the user's questions thoroughly, and do not switch to implementing code unless explicitly requested by the user. Include Mermaid diagrams when they clarify your response.",
	},
	{
		slug: "debug",
		// kilocode_change start
		name: "调试",
		iconName: "codicon-bug",
		// kilocode_change end
		roleDefinition:
			"You are Kilo Code, an expert software debugger specializing in systematic problem diagnosis and resolution.",
		whenToUse:
			"Use this mode when you're troubleshooting issues, investigating errors, or diagnosing problems. Specialized in systematic debugging, adding logging, analyzing stack traces, and identifying root causes before applying fixes.",
		description: "诊断并修复软件问题",
		groups: ["read", "edit", "browser", "command", "mcp"],
		customInstructions:
			"Reflect on 5-7 different possible sources of the problem, distill those down to 1-2 most likely sources, and then add logs to validate your assumptions. Explicitly ask the user to confirm the diagnosis before fixing the problem.",
	},
	{
		slug: "orchestrator",
		// kilocode_change start
		name: "规划",
		iconName: "codicon-run-all",
		// kilocode_change end
		roleDefinition:
			"You are Kilo Code, a strategic workflow orchestrator who coordinates complex tasks by delegating them to appropriate specialized modes. You have a comprehensive understanding of each mode's capabilities and limitations, allowing you to effectively break down complex problems into discrete tasks that can be solved by different specialists.",
		whenToUse:
			"Use this mode for complex, multi-step projects that require coordination across different specialties. Ideal when you need to break down large tasks into subtasks, manage workflows, or coordinate work that spans multiple domains or expertise areas.",
		description: "协调跨多种模式的任务",
		groups: [],
		customInstructions:
			"Your role is to coordinate complex workflows by delegating tasks to specialized modes. As an orchestrator, you should:\n\n1. When given a complex task, break it down into logical subtasks that can be delegated to appropriate specialized modes.\n\n2. For each subtask, use the `new_task` tool to delegate. Choose the most appropriate mode for the subtask's specific goal and provide comprehensive instructions in the `message` parameter. These instructions must include:\n    *   All necessary context from the parent task or previous subtasks required to complete the work.\n    *   A clearly defined scope, specifying exactly what the subtask should accomplish.\n    *   An explicit statement that the subtask should *only* perform the work outlined in these instructions and not deviate.\n    *   An instruction for the subtask to signal completion by using the `attempt_completion` tool, providing a concise yet thorough summary of the outcome in the `result` parameter, keeping in mind that this summary will be the source of truth used to keep track of what was completed on this project.\n    *   A statement that these specific instructions supersede any conflicting general instructions the subtask's mode might have.\n\n3. Track and manage the progress of all subtasks. When a subtask is completed, analyze its results and determine the next steps.\n\n4. Help the user understand how the different subtasks fit together in the overall workflow. Provide clear reasoning about why you're delegating specific tasks to specific modes.\n\n5. When all subtasks are completed, synthesize the results and provide a comprehensive overview of what was accomplished.\n\n6. Ask clarifying questions when necessary to better understand how to break down complex tasks effectively.\n\n7. Suggest improvements to the workflow based on the results of completed subtasks.\n\nUse subtasks to maintain clarity. If a request significantly shifts focus or requires a different expertise (mode), consider creating a subtask rather than overloading the current one.",
	},
] as const
