/**
 * /checkpoint command - Manage and revert to checkpoints
 */

import type { Command, CommandContext, ArgumentProviderContext, ArgumentSuggestion } from "./core/types.js"
import { logs } from "../services/logs.js"
import { ExtensionMessage } from "../types/messages.js"

/**
 * Interface for checkpoint message from chatMessages
 */
interface CheckpointMessage extends ExtensionMessage {
	ts: number
	type: "say"
	say: "checkpoint_saved"
	text: string
	metadata?: {
		type?: string
		fromHash?: string
		toHash?: string
		suppressMessage?: boolean
	}
}

/**
 * Extract checkpoint messages from chatMessages
 */
function getCheckpointMessages(chatMessages: ExtensionMessage[]): CheckpointMessage[] {
	return chatMessages
		.filter(
			(msg): msg is CheckpointMessage =>
				msg.type === "say" &&
				msg.say === "checkpoint_saved" &&
				typeof msg.text === "string" &&
				msg.text.length > 0,
		)
		.reverse() // Most recent first
}

/**
 * Find checkpoint by hash
 */
function findCheckpointByHash(
	checkpoints: CheckpointMessage[],
	hash: string,
): { message: CheckpointMessage; hash: string } | null {
	const lowerHash = hash.toLowerCase()

	const exactMatch = checkpoints.find((cp) => cp.text?.toLowerCase() === lowerHash)
	if (exactMatch && exactMatch.text) {
		return { message: exactMatch, hash: exactMatch.text }
	}

	return null
}

/**
 * Format timestamp to human-readable format
 */
function formatTimestamp(ts: number): string {
	const date = new Date(ts)
	const now = new Date()
	const diffMs = now.getTime() - date.getTime()
	const diffMins = Math.floor(diffMs / (1000 * 60))
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

	// Relative time for recent checkpoints
	if (diffMins < 1) {
		return "just now"
	}
	if (diffMins < 60) {
		return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`
	}
	if (diffHours < 24) {
		return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
	}

	// Absolute time for older checkpoints
	const timeStr = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })
	const dateStr = date.toLocaleDateString([], { month: "short", day: "numeric" })

	return `${timeStr}, ${dateStr}`
}

/**
 * Handle /checkpoint list
 */
async function handleList(context: CommandContext): Promise<void> {
	const { chatMessages, addMessage } = context
	const checkpoints = getCheckpointMessages(chatMessages)

	logs.debug("Listing checkpoints", "checkpoint", { count: checkpoints.length })

	if (checkpoints.length === 0) {
		logs.info("No checkpoints found", "checkpoint")
		addMessage({
			id: Date.now().toString(),
			type: "system",
			content: "No checkpoints available.",
			ts: Date.now(),
		})
		return
	}

	const lines = ["**Available checkpoints:**", ""]

	checkpoints.forEach((cp) => {
		const hash = cp.text || "unknown"
		const timestamp = formatTimestamp(cp.ts)
		const isSuppressed = cp.metadata?.suppressMessage === true
		const suppressedLabel = isSuppressed ? " [auto-saved]" : ""

		lines.push(`  ${hash} - ${timestamp}${suppressedLabel}`)
	})

	lines.push("")
	lines.push("Use `/checkpoint restore <hash>` to revert.")

	addMessage({
		id: Date.now().toString(),
		type: "system",
		content: lines.join("\n"),
		ts: Date.now(),
	})
}

/**
 * Handle /checkpoint restore
 */
async function handleRestore(context: CommandContext, hash: string): Promise<void> {
	const { chatMessages, addMessage, sendWebviewMessage } = context
	const checkpoints = getCheckpointMessages(chatMessages)

	logs.debug("Finding checkpoint for restore", "checkpoint", { hash, checkpointCount: checkpoints.length })

	const result = findCheckpointByHash(checkpoints, hash)

	if (!result) {
		logs.warn("Checkpoint not found for restore", "checkpoint", { hash })
		addMessage({
			id: Date.now().toString(),
			type: "error",
			content: `Checkpoint "${hash}" not found. Use /checkpoint list to see available checkpoints.`,
			ts: Date.now(),
		})
		return
	}

	const { message, hash: fullHash } = result

	// Count messages that will be removed
	const currentIndex = chatMessages.findIndex((msg) => msg.ts === message.ts)
	const messagesToRemove = chatMessages.length - currentIndex - 1

	logs.info("Preparing to restore checkpoint", "checkpoint", { fullHash, messagesToRemove })

	// Send request to extension to create ask message and handle approval
	const confirmLines = [
		`**警告:** 这将恢复到检查点 ${fullHash}`,
		"",
		"该操作会:",
		`  - 执行 git hard reset 命令(所有未提交的修改会丢失)`,
		`  - 从对话种删除 ${messagesToRemove} 消息 ${messagesToRemove === 1 ? "" : "s"}`,
		`  - 恢复到之前的状态 ${formatTimestamp(message.ts)}`,
		"",
		"**并且不可撤销.**",
	]

	await sendWebviewMessage({
		type: "requestCheckpointRestoreApproval",
		payload: {
			commitHash: fullHash,
			checkpointTs: message.ts,
			messagesToRemove: messagesToRemove,
			confirmationText: confirmLines.join("\n"),
		},
	})

	logs.info("已向扩展发送检查点恢复批准请求", "checkpoint", { fullHash })
}

/**
 * Argument provider for checkpoint hashes
 */
async function provideCheckpointHashes(context: ArgumentProviderContext): Promise<ArgumentSuggestion[]> {
	const chatMessages = context.commandContext?.chatMessages || []
	const checkpoints = getCheckpointMessages(chatMessages)

	logs.debug("Providing checkpoint hash suggestions", "checkpoint", { count: checkpoints.length })

	if (checkpoints.length === 0) {
		logs.info("No checkpoints available for suggestions", "checkpoint")
		return [
			{
				value: "",
				title: "No checkpoints available",
				matchScore: 0,
				highlightedValue: "",
				loading: false,
			},
		]
	}

	return checkpoints.map((cp, index) => {
		const hash = cp.text || ""
		const timestamp = formatTimestamp(cp.ts)
		const isSuppressed = cp.metadata?.suppressMessage === true
		const label = isSuppressed ? " (auto-saved)" : ""

		return {
			value: hash,
			title: `${hash} - ${timestamp}${label}`,
			description: hash,
			matchScore: 100 - index, // Recent first
			highlightedValue: hash,
		}
	})
}

/**
 * Argument provider for subcommands
 */
async function provideSubcommands(context: ArgumentProviderContext): Promise<ArgumentSuggestion[]> {
	const subcommands = [
		{ value: "list", description: "列出所有可用的检查点" },
		{ value: "restore", description: "恢复到检查点" },
	]

	const query = context.partialInput.toLowerCase()

	logs.debug("提供子命令建议", "checkpoint", { query, subcommandCount: subcommands.length })

	return subcommands
		.map((cmd) => {
			let matchScore = 0
			if (!query) {
				matchScore = 100
			} else if (cmd.value === query) {
				matchScore = 100
			} else if (cmd.value.startsWith(query)) {
				matchScore = 90
			} else if (cmd.value.includes(query)) {
				matchScore = 70
			}

			return {
				value: cmd.value,
				title: cmd.value,
				description: cmd.description,
				matchScore,
				highlightedValue: cmd.value,
			}
		})
		.filter((s) => s.matchScore > 0)
		.sort((a, b) => b.matchScore - a.matchScore)
}

export const checkpointCommand: Command = {
	name: "checkpoint",
	aliases: ["cp"],
	description: "管理和恢复到已保存的检查点",
	usage: "/checkpoint <list|restore> [hash]",
	examples: ["/checkpoint list", "/checkpoint restore 41db173a"],
	category: "chat",
	priority: 7,
	arguments: [
		{
			name: "subcommand",
			description: "要执行的操作 (list, restore)",
			required: false,
			provider: provideSubcommands,
		},
		{
			name: "hash",
			description: "Checkpoint hash (full 40-character git hash)",
			required: false,
			provider: provideCheckpointHashes,
		},
	],
	handler: async (context) => {
		const { args, addMessage } = context

		// No subcommand - show help
		if (args.length === 0 || !args[0]) {
			logs.info("Showing checkpoint help", "checkpoint")
			addMessage({
				id: Date.now().toString(),
				type: "system",
				content: [
					"**检查点管理**",
					"",
					"**Usage:** /checkpoint <command> [hash]",
					"",
					"**Commands:**",
					"  list           列出所有可用的检查点",
					"  恢复 <hash> 到检查点 (破坏性的)",
					"",
					"**例如:**",
					"  /checkpoint list",
					"  /checkpoint restore 00d185d5020969752bc9ae40823b9d6a723696e2",
					"",
					"**注意:** 哈希值必须是完整的 40 个字符的 Git 提交哈希值。",
				].join("\n"),
				ts: Date.now(),
			})
			return
		}

		const subcommand = args[0].toLowerCase()
		const hash = args[1]

		logs.info("执行检查点命令", "checkpoint", { subcommand, hash: hash || null })

		switch (subcommand) {
			case "list":
				logs.debug("Handling checkpoint list command", "checkpoint")
				await handleList(context)
				break

			case "restore":
				if (!hash) {
					logs.warn("Hash required for restore command", "checkpoint")
					addMessage({
						id: Date.now().toString(),
						type: "error",
						content: "Hash required. Usage: /checkpoint restore <hash>",
						ts: Date.now(),
					})
					return
				}
				logs.debug("Handling checkpoint restore command", "checkpoint", { hash })
				await handleRestore(context, hash)
				break

			default:
				logs.warn("Unknown checkpoint subcommand", "checkpoint", { subcommand })
				addMessage({
					id: Date.now().toString(),
					type: "error",
					content: `Unknown command "${subcommand}". Available: list, restore`,
					ts: Date.now(),
				})
		}
	},
}
