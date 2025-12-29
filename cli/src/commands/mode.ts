/**
 * /mode command - Switch between different modes
 */

import type { Command, ArgumentValue } from "./core/types.js"
import { DEFAULT_MODES } from "../constants/modes/defaults.js"

// Convert modes to ArgumentValue format
const MODE_VALUES: ArgumentValue[] = DEFAULT_MODES.map((mode) => ({
	value: mode.slug,
	...(mode.description && { description: mode.description }),
}))

// Extract mode slugs for validation
const AVAILABLE_MODE_SLUGS = DEFAULT_MODES.map((mode) => mode.slug)

export const modeCommand: Command = {
	name: "mode",
	aliases: ["m"],
	description: "切换模式",
	usage: "/mode <mode-name>",
	examples: ["/mode code", "/mode architect", "/mode debug"],
	category: "settings",
	priority: 9,
	arguments: [
		{
			name: "mode-name",
			description: "切换模式到",
			required: true,
			values: MODE_VALUES,
			placeholder: "Select a mode",
			validate: (value) => {
				const isValid = AVAILABLE_MODE_SLUGS.includes(value.toLowerCase())
				return {
					valid: isValid,
					...(isValid ? {} : { error: `无效的模式. 可用: ${AVAILABLE_MODE_SLUGS.join(", ")}` }),
				}
			},
		},
	],
	handler: async (context) => {
		const { args, addMessage, setMode } = context

		if (args.length === 0 || !args[0]) {
			// Show current mode and available modes
			addMessage({
				id: Date.now().toString(),
				type: "system",
				content: [
					"**可用的模式:**",
					"",
					...DEFAULT_MODES.map((mode) => `  - **${mode.name}** (${mode.slug}): ${mode.description}`),
					"",
					"Usage: /mode <mode-name>",
				].join("\n"),
				ts: Date.now(),
			})
			return
		}

		const requestedMode = args[0].toLowerCase()

		if (!AVAILABLE_MODE_SLUGS.includes(requestedMode)) {
			addMessage({
				id: Date.now().toString(),
				type: "error",
				content: `无效模式 "${requestedMode}". 可用模式: ${AVAILABLE_MODE_SLUGS.join(", ")}`,
				ts: Date.now(),
			})
			return
		}

		// Find the mode to get its display name
		const mode = DEFAULT_MODES.find((m) => m.slug === requestedMode)
		const modeName = mode?.name || requestedMode

		setMode(requestedMode)

		addMessage({
			id: Date.now().toString(),
			type: "system",
			content: `切换到 **${modeName}** 模式.`,
			ts: Date.now(),
		})
	},
}
