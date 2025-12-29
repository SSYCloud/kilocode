/**
 * /help command - Display available commands
 */

import type { Command } from "./core/types.js"
import { commandRegistry } from "./core/registry.js"

export const helpCommand: Command = {
	name: "help",
	aliases: ["h", "?"],
	description: "显示可用命令及其用法",
	usage: "/help [command]",
	examples: ["/help", "/help mode", "/help settings"],
	category: "system",
	priority: 10,
	handler: async (context) => {
		const { args, addMessage } = context

		// If a specific command is requested
		if (args.length > 0 && args[0]) {
			const commandName = args[0]
			const command = commandRegistry.get(commandName)

			if (!command) {
				addMessage({
					id: Date.now().toString(),
					type: "error",
					content: `命令 "${commandName}" 未找到. 使用 /help 查看命令帮助.`,
					ts: Date.now(),
				})
				return
			}

			// Show detailed help for specific command
			const helpText = [`**${command.name}** - ${command.description}`, "", `**Usage:** ${command.usage}`, ""]

			if (command.aliases.length > 0) {
				helpText.push(`**别名:** ${command.aliases.join(", ")}`)
				helpText.push("")
			}

			if (command.examples.length > 0) {
				helpText.push("**示例:**")
				command.examples.forEach((example) => {
					helpText.push(`  ${example}`)
				})
				helpText.push("")
			}

			if (command.options && command.options.length > 0) {
				helpText.push("**选项:**")
				command.options.forEach((option) => {
					const optionStr = option.alias ? `--${option.name}, -${option.alias}` : `--${option.name}`
					const required = option.required ? " (required)" : ""
					helpText.push(`  ${optionStr}${required} - ${option.description}`)
				})
			}

			addMessage({
				id: Date.now().toString(),
				type: "system",
				content: helpText.join("\n"),
				ts: Date.now(),
			})
			return
		}

		// Show all commands grouped by category
		const categories: Record<string, Command[]> = {
			chat: [],
			settings: [],
			navigation: [],
			system: [],
		}

		commandRegistry.getAll().forEach((cmd) => {
			const category = categories[cmd.category]
			if (category) {
				category.push(cmd)
			}
		})

		const helpText = ["**可用命令**", ""]

		// Chat commands
		if (categories.chat && categories.chat.length > 0) {
			helpText.push("**对话:**")
			categories.chat.forEach((cmd) => {
				helpText.push(`  /${cmd.name} - ${cmd.description}`)
			})
			helpText.push("")
		}

		// Settings commands
		if (categories.settings && categories.settings.length > 0) {
			helpText.push("**设置:**")
			categories.settings.forEach((cmd) => {
				helpText.push(`  /${cmd.name} - ${cmd.description}`)
			})
			helpText.push("")
		}

		// Navigation commands
		if (categories.navigation && categories.navigation.length > 0) {
			helpText.push("**导航:**")
			categories.navigation.forEach((cmd) => {
				helpText.push(`  /${cmd.name} - ${cmd.description}`)
			})
			helpText.push("")
		}

		// System commands
		if (categories.system && categories.system.length > 0) {
			helpText.push("**系统:**")
			categories.system.forEach((cmd) => {
				helpText.push(`  /${cmd.name} - ${cmd.description}`)
			})
			helpText.push("")
		}

		helpText.push("输入 /help <command> 查看命令的详细帮助.")

		addMessage({
			id: Date.now().toString(),
			type: "system",
			content: helpText.join("\n"),
			ts: Date.now(),
		})
	},
}
