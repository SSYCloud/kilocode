/**
 * /clear command - Clear the display without affecting extension state
 */

import type { Command } from "./core/types.js"

export const clearCommand: Command = {
	name: "clear",
	aliases: ["c", "cls"],
	description: "清除显示内容而不影响当前任务",
	usage: "/clear",
	examples: ["/clear", "/c", "/cls"],
	category: "system",
	priority: 8,
	handler: async (context) => {
		const { setMessageCutoffTimestamp, addMessage, refreshTerminal } = context
		const now = Date.now()
		setMessageCutoffTimestamp(now)
		// Add Spacer message
		addMessage({
			id: `empty-${now + 1}`,
			type: "empty",
			content: "",
			ts: now + 1,
		})
		// Refresh terminal to clear screen
		await refreshTerminal()
	},
}
