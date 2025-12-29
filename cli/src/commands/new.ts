/**
 * /new command - Start a new task with a clean slate
 */

import { createWelcomeMessage } from "../ui/utils/welcomeMessage.js"
import type { Command } from "./core/types.js"

export const newCommand: Command = {
	name: "new",
	aliases: ["n", "start"],
	description: "从零开始，开启一项新任务",
	usage: "/new",
	examples: ["/new", "/n", "/start"],
	category: "system",
	priority: 9,
	handler: async (context) => {
		const { clearTask, replaceMessages, refreshTerminal } = context

		// Clear the extension task state (this also clears extension messages)
		await clearTask()

		// Replace CLI message history with fresh welcome message
		// This will increment the reset counter, forcing Static component to re-render
		replaceMessages([
			createWelcomeMessage({
				clearScreen: true,
				showInstructions: true,
				instructions: [
					"🎉 全新开始！准备迎接新挑战。",
					"所有先前的消息和任务状态均已清除。",
					"输入您的消息即可开始，或使用 /help 查看可用命令。",
				],
			}),
		])

		// Force terminal refresh to clear screen
		await refreshTerminal()
	},
}
