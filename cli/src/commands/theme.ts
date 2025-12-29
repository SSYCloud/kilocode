/**
 * /theme command - Switch between different themes
 */

import type { Command, ArgumentProviderContext } from "./core/types.js"
import type { CLIConfig } from "../config/types.js"
import { getThemeById, getAvailableThemes } from "../constants/themes/index.js"
import { generateMessage } from "../ui/utils/messages.js"

/**
 * Autocomplete provider for theme names
 */
async function themeAutocompleteProvider(context: ArgumentProviderContext) {
	if (!context.commandContext) {
		return []
	}
	const config = context.commandContext.config
	const availableThemeIds = getAvailableThemes(config)

	// Create theme display info array to apply same sorting logic
	const sortedThemes = availableThemeIds
		.map((themeId) => {
			const theme = getThemeById(themeId, config)
			return {
				id: themeId,
				name: theme.name,
				description: theme.type,
				type: theme.type,
			}
		})
		.sort((a, b) => {
			// Sort by type (dark first, then light, then custom), then by ID alphabetically
			const typeOrder = { dark: 0, light: 1, custom: 2 }
			const typeAOrder = typeOrder[a.type as keyof typeof typeOrder] ?? 3
			const typeBOrder = typeOrder[b.type as keyof typeof typeOrder] ?? 3

			if (typeAOrder !== typeBOrder) {
				return typeAOrder - typeBOrder
			}
			return a.id.localeCompare(b.id)
		})

	return sortedThemes
		.map((theme) => {
			return {
				value: theme.id,
				title: theme.name,
				description: theme.description,
				matchScore: 1.0,
				highlightedValue: theme.id,
			}
		})
		.filter((item): item is NonNullable<typeof item> => item !== null)
}

/**
 * Get theme information for display with themes already sorted by getAvailableThemes
 */
function getThemeDisplayInfo(config: CLIConfig) {
	// getAvailableThemes already returns themes in the correct order
	const availableThemeIds = getAvailableThemes(config)

	return availableThemeIds
		.map((themeId) => {
			const theme = getThemeById(themeId, config)
			if (!theme) {
				return null
			}
			return {
				id: themeId,
				name: theme.name,
				description: theme.type,
				type: theme.type,
			}
		})
		.filter((item): item is NonNullable<typeof item> => item !== null)
}

export const themeCommand: Command = {
	name: "theme",
	aliases: ["th"],
	description: "切换主题",
	usage: "/theme [theme-name]",
	examples: ["/theme dark", "/theme light", "/theme alpha"],
	category: "settings",
	priority: 8,
	arguments: [
		{
			name: "theme-name",
			description: "切换主题到 (optional for interactive selection)",
			required: false,
			placeholder: "选择主题",
			provider: themeAutocompleteProvider,
			/**
			 * Validate theme argument against available themes
			 */
			validate: async (value, _context) => {
				const config = _context.commandContext?.config
				const availableThemeIds = getAvailableThemes(config)
				const isValid = availableThemeIds.includes(value.trim().toLowerCase())

				return {
					valid: isValid,
					...(isValid ? {} : { error: `无效主题. 可用: ${availableThemeIds.join(", ")}` }),
				}
			},
		},
	],
	handler: async (context) => {
		const { args, addMessage, setTheme, config, refreshTerminal } = context
		const availableThemeIds = getAvailableThemes(config)

		try {
			// If no theme provided, show available themes
			if (args.length === 0 || !args[0]) {
				// Get theme display info with custom themes
				const allThemes = getThemeDisplayInfo(config)

				// Group themes by type using a map
				const themesByType = allThemes.reduce(
					(acc, theme) => {
						if (!acc[theme.type]) {
							acc[theme.type] = [] as Array<{
								id: string
								name: string
								description: string
								type: string
							}>
						}
						acc[theme.type]!.push(theme)
						return acc
					},
					{} as Record<string, Array<{ id: string; name: string; description: string; type: string }>>,
				)

				// Define the order for displaying theme types
				const typeOrder = ["dark", "light", "custom"]

				// Show interactive theme selection menu
				const helpText: string[] = ["**可用主题:**", ""]

				// Loop through theme types in the specified order
				typeOrder.forEach((type) => {
					const themes = themesByType[type] || []
					if (themes.length > 0) {
						helpText.push(`**${type}:**`)
						themes.forEach((theme) => {
							helpText.push(`  ${theme.name} (${theme.id})`)
						})
						helpText.push("")
					}
				})

				helpText.push("Usage: /theme <theme-name>")

				addMessage({
					...generateMessage(),
					type: "system",
					content: helpText.join("\n"),
				})
				return
			}

			const requestedTheme = args[0].toLowerCase()

			if (!availableThemeIds.includes(requestedTheme)) {
				addMessage({
					...generateMessage(),
					type: "error",
					content: `无效主题 "${requestedTheme}". 可用: ${availableThemeIds.join(", ")}`,
				})
				return
			}

			// Find the theme to get its display name
			const theme = getThemeById(requestedTheme, config)
			const themeName = theme.name || requestedTheme

			try {
				addMessage({
					...generateMessage(),
					type: "system",
					content: `Switched to **${themeName}** theme.`,
				})
				await setTheme(requestedTheme)
				await refreshTerminal()
			} catch (error) {
				addMessage({
					...generateMessage(),
					type: "error",
					content: `Failed to switch to **${themeName}** theme: ${error instanceof Error ? error.message : String(error)}`,
				})
			}
		} catch (error) {
			// Handler-level error for unexpected issues (e.g., config corruption)
			addMessage({
				...generateMessage(),
				type: "error",
				content: `Theme command failed: ${error instanceof Error ? error.message : String(error)}`,
			})
		}
	},
}
