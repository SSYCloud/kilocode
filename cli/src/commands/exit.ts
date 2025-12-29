/**
 * /exit command - Exit the CLI
 */

import type { Command } from "./core/types.js"

export const exitCommand: Command = {
	name: "exit",
	aliases: ["quit", "q"],
	description: "退出 - 并行模式下, 推出前会提交更改",
	usage: "/exit",
	examples: ["/exit"],
	category: "system",
	handler: async (context) => {
		const { exit, setCommittingParallelMode, isParallelMode } = context

		// In parallel mode, set the committing state before exit
		if (isParallelMode) {
			setCommittingParallelMode(true)
		}

		exit()
	},
}
