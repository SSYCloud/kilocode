/**
 * /tasks command - View and manage task history
 */

import type { HistoryItem } from "@roo-code/types"
import { generateMessage } from "../ui/utils/messages.js"
import type { Command, ArgumentProviderContext, CommandContext } from "./core/types.js"
import type { TaskHistoryData, TaskHistoryFilters } from "../state/atoms/taskHistory.js"

/**
 * Map kebab-case sort options to camelCase
 */
const SORT_OPTION_MAP: Record<string, string> = {
	newest: "newest",
	oldest: "oldest",
	"most-expensive": "mostExpensive",
	"most-tokens": "mostTokens",
	"most-relevant": "mostRelevant",
}

/**
 * Format a timestamp as a relative time string
 */
function formatRelativeTime(ts: number): string {
	const now = Date.now()
	const diff = now - ts
	const seconds = Math.floor(diff / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)
	const days = Math.floor(hours / 24)

	if (days > 0) return `${days}d ago`
	if (hours > 0) return `${hours}h ago`
	if (minutes > 0) return `${minutes}m ago`
	return "just now"
}

/**
 * Format cost as a currency string
 */
function formatCost(cost: number): string {
	if (cost === 0) return "$0.00"
	if (cost < 0.01) return "<$0.01"
	return `$${cost.toFixed(2)}`
}

/**
 * Format tokens as a readable string
 */
function formatTokens(tokens: number): string {
	if (tokens >= 1000000) {
		return `${(tokens / 1000000).toFixed(1)}M`
	}
	if (tokens >= 1000) {
		return `${(tokens / 1000).toFixed(1)}K`
	}
	return tokens.toString()
}

/**
 * Truncate text to a maximum length
 */
function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text
	return text.substring(0, maxLength - 3) + "..."
}

/**
 * Show current task history
 */
async function showTaskHistory(context: CommandContext, dataOverride?: TaskHistoryData): Promise<void> {
	const { taskHistoryData, taskHistoryLoading, taskHistoryError, fetchTaskHistory, addMessage } = context

	// Use override data if provided, otherwise use context data
	const data = dataOverride || taskHistoryData

	// If loading, show loading message
	if (taskHistoryLoading && !dataOverride) {
		addMessage({
			...generateMessage(),
			type: "system",
			content: "加载任务历史...",
		})
		return
	}

	// If error, show error message
	if (taskHistoryError && !dataOverride) {
		addMessage({
			...generateMessage(),
			type: "error",
			content: `加载任务历史失败: ${taskHistoryError}`,
		})
		return
	}

	// If no data, fetch it
	if (!data) {
		await fetchTaskHistory()
		addMessage({
			...generateMessage(),
			type: "system",
			content: "加载任务历史...",
		})
		return
	}

	const { historyItems, pageIndex, pageCount } = data

	if (historyItems.length === 0) {
		addMessage({
			...generateMessage(),
			type: "system",
			content: "没有任务历史.",
		})
		return
	}

	// Build the task list display
	let content = `**任务历史** (页 ${pageIndex + 1}/${pageCount}):\n\n`

	historyItems.forEach((task: HistoryItem, index: number) => {
		const taskNum = pageIndex * 10 + index + 1
		const taskText = truncate(task.task || "未命名", 60)
		const time = formatRelativeTime(task.ts || 0)
		const cost = formatCost(task.totalCost || 0)
		const totalTokens = (task.tokensIn || 0) + (task.tokensOut || 0)
		const tokens = formatTokens(totalTokens)
		const favorite = task.isFavorited ? "⭐ " : ""

		content += `${favorite}**${taskNum}.** ${taskText}\n`
		content += `   ID: ${task.id} | ${time} | ${cost} | ${tokens} tokens\n\n`
	})

	addMessage({
		...generateMessage(),
		type: "system",
		content,
	})
}

/**
 * Search tasks
 */
async function searchTasks(context: CommandContext, query: string): Promise<void> {
	const { updateTaskHistoryFilters, addMessage } = context

	if (!query) {
		addMessage({
			...generateMessage(),
			type: "error",
			content: "Usage: /tasks search <query>",
		})
		return
	}

	addMessage({
		...generateMessage(),
		type: "system",
		content: `查找 "${query}"...`,
	})

	try {
		// Wait for the new data to arrive
		const newData = await updateTaskHistoryFilters({ search: query, sort: "mostRelevant" })
		// Now display the fresh data
		await showTaskHistory(context, newData)
	} catch (error) {
		addMessage({
			...generateMessage(),
			type: "error",
			content: `查询任务失败: ${error instanceof Error ? error.message : String(error)}`,
		})
	}
}

/**
 * Select a task by ID
 */
async function selectTask(context: CommandContext, taskId: string): Promise<void> {
	const { sendWebviewMessage, addMessage, replaceMessages, refreshTerminal } = context

	if (!taskId) {
		addMessage({
			...generateMessage(),
			type: "error",
			content: "Usage: /tasks select <task-id>",
		})
		return
	}

	try {
		const now = Date.now()
		replaceMessages([
			{
				id: `empty-${now}`,
				type: "empty",
				content: "",
				ts: 1,
			},
			{
				id: `system-${now + 1}`,
				type: "system",
				content: `切换到任务 ${taskId}...`,
				ts: 2,
			},
		])

		await refreshTerminal()

		sendWebviewMessage({
			type: "showTaskWithId",
			text: taskId,
		})
	} catch (error) {
		addMessage({
			...generateMessage(),
			type: "error",
			content: `切换任务失败: ${error instanceof Error ? error.message : String(error)}`,
		})
	}
}

/**
 * Change page
 */
async function changePage(context: CommandContext, pageNum: string): Promise<void> {
	const { taskHistoryData, changeTaskHistoryPage, addMessage } = context

	if (!taskHistoryData) {
		addMessage({
			...generateMessage(),
			type: "error",
			content: "未加载任务历史记录。请先使用 /tasks 命令加载历史记录。",
		})
		return
	}

	const pageIndex = parseInt(pageNum, 10) - 1 // Convert to 0-based index

	if (isNaN(pageIndex) || pageIndex < 0 || pageIndex >= taskHistoryData.pageCount) {
		addMessage({
			...generateMessage(),
			type: "error",
			content: `无效的页数. 必须在 1 - ${taskHistoryData.pageCount}.`,
		})
		return
	}

	addMessage({
		...generateMessage(),
		type: "system",
		content: `加载页 ${pageIndex + 1}...`,
	})

	try {
		// Wait for the new data to arrive
		const newData = await changeTaskHistoryPage(pageIndex)
		// Now display the fresh data
		await showTaskHistory(context, newData)
	} catch (error) {
		addMessage({
			...generateMessage(),
			type: "error",
			content: `加载页失败: ${error instanceof Error ? error.message : String(error)}`,
		})
	}
}

/**
 * Go to next page
 */
async function nextPage(context: CommandContext): Promise<void> {
	const { taskHistoryData, nextTaskHistoryPage, addMessage } = context
	if (!taskHistoryData) {
		addMessage({
			...generateMessage(),
			type: "error",
			content: "未加载任务历史记录。请先使用 /tasks 命令加载历史记录。",
		})
		return
	}

	if (taskHistoryData.pageIndex >= taskHistoryData.pageCount - 1) {
		addMessage({
			...generateMessage(),
			type: "system",
			content: "已经翻到最后一页了。",
		})
		return
	}

	addMessage({
		...generateMessage(),
		type: "system",
		content: "加载下一页...",
	})

	try {
		// Wait for the new data to arrive
		const newData = await nextTaskHistoryPage()
		// Now display the fresh data
		await showTaskHistory(context, newData)
	} catch (error) {
		addMessage({
			...generateMessage(),
			type: "error",
			content: `加载下一页失败: ${error instanceof Error ? error.message : String(error)}`,
		})
	}
}

/**
 * Go to previous page
 */
async function previousPage(context: CommandContext): Promise<void> {
	const { taskHistoryData, previousTaskHistoryPage, addMessage } = context

	if (!taskHistoryData) {
		addMessage({
			...generateMessage(),
			type: "error",
			content: "未加载任务历史记录。请先使用 /tasks 命令加载历史记录。",
		})
		return
	}

	if (taskHistoryData.pageIndex <= 0) {
		addMessage({
			...generateMessage(),
			type: "system",
			content: "已经上首页了。",
		})
		return
	}

	addMessage({
		...generateMessage(),
		type: "system",
		content: "加载上一页...",
	})

	try {
		// Wait for the new data to arrive
		const newData = await previousTaskHistoryPage()
		// Now display the fresh data
		await showTaskHistory(context, newData)
	} catch (error) {
		addMessage({
			...generateMessage(),
			type: "error",
			content: `加载上一页失败: ${error instanceof Error ? error.message : String(error)}`,
		})
	}
}

/**
 * Change sort order
 */
async function changeSortOrder(context: CommandContext, sortOption: string): Promise<void> {
	const { updateTaskHistoryFilters, addMessage } = context

	const validSorts = Object.keys(SORT_OPTION_MAP)
	const mappedSort = SORT_OPTION_MAP[sortOption]

	if (!mappedSort) {
		addMessage({
			...generateMessage(),
			type: "error",
			content: `无效的排序选项. 可用: ${validSorts.join(", ")}`,
		})
		return
	}

	addMessage({
		...generateMessage(),
		type: "system",
		content: `排序项 ${sortOption}...`,
	})

	try {
		// Wait for the new data to arrive
		const newData = await updateTaskHistoryFilters({ sort: mappedSort as TaskHistoryFilters["sort"] })
		// Now display the fresh data
		await showTaskHistory(context, newData)
	} catch (error) {
		addMessage({
			...generateMessage(),
			type: "error",
			content: `更改排序顺序失败: ${error instanceof Error ? error.message : String(error)}`,
		})
	}
}

/**
 * Change filter
 */
async function changeFilter(context: CommandContext, filterOption: string): Promise<void> {
	const { updateTaskHistoryFilters, addMessage } = context

	let filterUpdate: Partial<TaskHistoryFilters>
	let loadingMessage: string

	switch (filterOption) {
		case "current":
			filterUpdate = { workspace: "current" }
			loadingMessage = "筛选到当前工作区..."
			break

		case "all":
			filterUpdate = { workspace: "all" }
			loadingMessage = "显示所有工作区..."
			break

		case "favorites":
			filterUpdate = { favoritesOnly: true }
			loadingMessage = "仅显示收藏..."
			break

		case "all-tasks":
			filterUpdate = { favoritesOnly: false }
			loadingMessage = "显示所有任务..."
			break

		default:
			addMessage({
				...generateMessage(),
				type: "error",
				content: "无效的过滤项. 可用: current, all, favorites, all-tasks",
			})
			return
	}

	addMessage({
		...generateMessage(),
		type: "system",
		content: loadingMessage,
	})

	try {
		// Wait for the new data to arrive
		const newData = await updateTaskHistoryFilters(filterUpdate)
		// Now display the fresh data
		await showTaskHistory(context, newData)
	} catch (error) {
		addMessage({
			...generateMessage(),
			type: "error",
			content: `切换过滤失败: ${error instanceof Error ? error.message : String(error)}`,
		})
	}
}

/**
 * Autocomplete provider for task IDs
 */
async function taskIdAutocompleteProvider(context: ArgumentProviderContext) {
	if (!context.commandContext) {
		return []
	}

	const { taskHistoryData } = context.commandContext

	if (!taskHistoryData || !taskHistoryData.historyItems) {
		return []
	}

	return taskHistoryData.historyItems.map((task: HistoryItem) => ({
		value: task.id,
		title: truncate(task.task || "Untitled task", 50),
		description: `${formatRelativeTime(task.ts || 0)} | ${formatCost(task.totalCost || 0)}`,
		matchScore: 1.0,
		highlightedValue: task.id,
	}))
}

/**
 * Autocomplete provider for sort options
 */
async function sortOptionAutocompleteProvider(_context: ArgumentProviderContext) {
	return Object.keys(SORT_OPTION_MAP).map((option) => ({
		value: option,
		description: `Sort by ${option}`,
		matchScore: 1.0,
		highlightedValue: option,
	}))
}

/**
 * Autocomplete provider for filter options
 */
async function filterOptionAutocompleteProvider(_context: ArgumentProviderContext) {
	return [
		{ value: "current", description: "进当前工作区", matchScore: 1.0, highlightedValue: "current" },
		{ value: "all", description: "所有工作区", matchScore: 1.0, highlightedValue: "all" },
		{ value: "favorites", description: "仅收藏", matchScore: 1.0, highlightedValue: "favorites" },
		{ value: "all-tasks", description: "所有任务", matchScore: 1.0, highlightedValue: "all-tasks" },
	]
}

export const tasksCommand: Command = {
	name: "tasks",
	aliases: ["t", "history"],
	description: "查看和管理任务历史",
	usage: "/tasks [subcommand] [args]",
	examples: [
		"/tasks",
		"/tasks search bug fix",
		"/tasks select abc123",
		"/tasks page 2",
		"/tasks next",
		"/tasks prev",
		"/tasks sort most-expensive",
		"/tasks filter favorites",
	],
	category: "navigation",
	priority: 9,
	arguments: [
		{
			name: "subcommand",
			description: "子命令: search, select, page, next, prev, sort, filter",
			required: false,
			values: [
				{ value: "search", description: "查询任务" },
				{ value: "select", description: "切换到任务" },
				{ value: "page", description: "导航到页" },
				{ value: "next", description: "下一页" },
				{ value: "prev", description: "上一页" },
				{ value: "sort", description: "当前排序" },
				{ value: "filter", description: "过滤任务" },
			],
		},
		{
			name: "argument",
			description: "子命令参数",
			required: false,
			conditionalProviders: [
				{
					condition: (context) => context.getArgument("subcommand") === "select",
					provider: taskIdAutocompleteProvider,
				},
				{
					condition: (context) => context.getArgument("subcommand") === "sort",
					provider: sortOptionAutocompleteProvider,
				},
				{
					condition: (context) => context.getArgument("subcommand") === "filter",
					provider: filterOptionAutocompleteProvider,
				},
			],
		},
	],
	handler: async (context) => {
		const { args } = context

		// No arguments - show current task history
		if (args.length === 0) {
			await showTaskHistory(context)
			return
		}

		const subcommand = args[0]?.toLowerCase()
		if (!subcommand) {
			await showTaskHistory(context)
			return
		}

		// Handle subcommands
		switch (subcommand) {
			case "search":
				await searchTasks(context, args.slice(1).join(" "))
				break

			case "select":
				await selectTask(context, args[1] || "")
				break

			case "page":
				await changePage(context, args[1] || "")
				break

			case "next":
				await nextPage(context)
				break

			case "prev":
			case "previous":
				await previousPage(context)
				break

			case "sort":
				await changeSortOrder(context, args[1] || "")
				break

			case "filter":
				await changeFilter(context, args[1] || "")
				break

			default:
				context.addMessage({
					...generateMessage(),
					type: "error",
					content: `未知子命令 "${subcommand}". 可用: search, select, page, next, prev, sort, filter`,
				})
		}
	},
}
