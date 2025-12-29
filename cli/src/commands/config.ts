/**
 * /config command - Open the CLI configuration file
 */

import type { Command } from "./core/types.js"
import openConfigFile from "../config/openConfig.js"

export const configCommand: Command = {
	name: "config",
	aliases: ["c", "settings"],
	description: "编辑配置文件",
	usage: "/config",
	examples: ["/config"],
	category: "settings",
	priority: 8,
	handler: async (context) => {
		const { addMessage } = context

		addMessage({
			id: Date.now().toString(),
			type: "system",
			content: "打开配置文件...",
			ts: Date.now(),
		})

		await openConfigFile()
	},
}
