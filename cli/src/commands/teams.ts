/**
 * /teams command - Manage team/organization selection
 */

import type { Command, ArgumentProviderContext, ArgumentSuggestion, CommandContext } from "./core/types.js"
import type { UserOrganization } from "../state/atoms/profile.js"

/**
 * Normalize team name to lowercase with dashes
 * Example: "Kilo Code" -> "kilo-code"
 */
function normalizeTeamName(name: string): string {
	return name
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-") // Replace spaces with dashes
		.replace(/[^a-z0-9-]/g, "") // Remove special characters except dashes
		.replace(/-+/g, "-") // Replace multiple dashes with single dash
		.replace(/^-|-$/g, "") // Remove leading/trailing dashes
}

/**
 * List all available teams
 */
async function listTeams(context: CommandContext): Promise<void> {
	const { currentProvider, addMessage, profileData, profileLoading } = context
	// Check if user is authenticated with Kilocode
	if (!currentProvider || currentProvider.provider !== "shengsuanyun") {
		addMessage({
			id: Date.now().toString(),
			type: "error",
			content: "Teams 命令需要 胜算云 提供程序。请将 胜算云 配置为您的提供程序。",
			ts: Date.now(),
		})
		return
	}

	if (!currentProvider.shengSuanYunToken) {
		addMessage({
			id: Date.now().toString(),
			type: "error",
			content: "未通过身份验证。请先配置您的 胜算云 Token。",
			ts: Date.now(),
		})
		return
	}

	// Check if still loading
	if (profileLoading) {
		addMessage({
			id: Date.now().toString(),
			type: "system",
			content: "加载 Teams...",
			ts: Date.now(),
		})
		return
	}

	const organizations = profileData?.organizations || []
	const currentOrgId = currentProvider.kilocodeOrganizationId

	if (organizations.length < 1) {
		addMessage({
			id: Date.now().toString(),
			type: "system",
			content: `您目前不属于任何 Kilo Code 团队. Go to https://app.kilocode.ai/get-started/teams to get started with Kilo Code for Teams!`,
			ts: Date.now(),
		})
		return
	}

	let content = "**可用 Teams:**\n\n"

	// Add Personal option
	const isPersonal = !currentOrgId
	content += `${isPersonal ? "→ " : "  "} 个人 ${isPersonal ? " (当前)" : ""}\n`

	// Add organizations
	for (const org of organizations) {
		const isCurrent = org.id === currentOrgId
		content += `${isCurrent ? "→ " : "  "}${normalizeTeamName(org.name)}${isCurrent ? " (当前)" : ""}\n`
	}
	if (organizations.length > 0) {
		content += `\n使用 \`/teams select ${normalizeTeamName(organizations[0]!.name)}\` 来选择团队配置\n`
	}
	content += `使用 \`/teams select personal\` 切换到个人账户\n`

	addMessage({
		id: Date.now().toString(),
		type: "system",
		content,
		ts: Date.now(),
	})
}

/**
 * Select a team
 */
async function selectTeam(context: CommandContext, teamId: string): Promise<void> {
	const { currentProvider, addMessage, updateProvider, profileData } = context

	// Check if user is authenticated with Kilocode
	if (!currentProvider || currentProvider.provider !== "shengsuanyun") {
		addMessage({
			id: Date.now().toString(),
			type: "error",
			content: "Teams 命令需要 胜算云 提供程序。请将 胜算云 配置为您的提供程序。",
			ts: Date.now(),
		})
		return
	}

	if (!currentProvider.kilocodeToken) {
		addMessage({
			id: Date.now().toString(),
			type: "error",
			content: "未通过身份验证。请先配置您的 胜算云 令牌。",
			ts: Date.now(),
		})
		return
	}

	try {
		// Handle "personal" as special case
		if (teamId.toLowerCase() === "personal") {
			addMessage({
				id: Date.now().toString(),
				type: "system",
				content: "✓ 已切换到 **个人** 账户",
				ts: Date.now(),
			})

			// Update provider configuration to remove organization ID
			await updateProvider(currentProvider.id, {
				kilocodeOrganizationId: undefined,
			})

			return
		}

		// Validate team ID if we have profile data
		if (profileData?.organizations) {
			// Try to find by ID first
			let targetOrg = profileData.organizations.find((org: UserOrganization) => org.id === teamId)

			// If not found by ID, try normalized name match
			if (!targetOrg) {
				const normalizedInput = normalizeTeamName(teamId)
				targetOrg = profileData.organizations.find(
					(org: UserOrganization) => normalizeTeamName(org.name) === normalizedInput,
				)
			}

			if (!targetOrg) {
				addMessage({
					id: Date.now().toString(),
					type: "error",
					content: `未找到团队 "${teamId}"。使用 \`/teams list\` 查看可用团队。`,
					ts: Date.now(),
				})
				return
			}

			addMessage({
				id: Date.now().toString(),
				type: "system",
				content: `✓ 已切换到团队：**${targetOrg.name}** (${targetOrg.role})`,
				ts: Date.now(),
			})

			// Update provider configuration with new organization ID (use the actual org.id)
			await updateProvider(currentProvider.id, {
				kilocodeOrganizationId: targetOrg.id,
			})
		} else {
			// No profile data loaded
			addMessage({
				id: Date.now().toString(),
				type: "error",
				content: `切换团队失败`,
				ts: Date.now(),
			})
		}
	} catch (error) {
		addMessage({
			id: Date.now().toString(),
			type: "error",
			content: `切换团队失败：${error instanceof Error ? error.message : String(error)}`,
			ts: Date.now(),
		})
	}
}
/**
 * Autocomplete provider for team names
 */
async function teamAutocompleteProvider(context: ArgumentProviderContext): Promise<ArgumentSuggestion[]> {
	// Check if commandContext is available
	if (!context.commandContext) {
		return []
	}

	const { currentProvider, profileData, profileLoading } = context.commandContext

	// Check if user is authenticated with Kilocode
	if (!currentProvider || currentProvider.provider !== "kilocode") {
		return []
	}

	if (!currentProvider.kilocodeToken) {
		return []
	}

	// If still loading, return loading state
	if (profileLoading) {
		return [
			{
				value: "loading",
				title: "加载账户信息...",
				description: "Please wait",
				matchScore: 1.0,
				highlightedValue: "loading",
				loading: true,
			},
		]
	}

	const organizations = profileData?.organizations || []
	const suggestions: ArgumentSuggestion[] = []

	// Add Personal option
	suggestions.push({
		value: "personal",
		title: "个人",
		description: "个人账户",
		matchScore: 1.0,
		highlightedValue: "personal",
	})

	// Add organizations
	for (const org of organizations) {
		const normalizedName = normalizeTeamName(org.name)
		suggestions.push({
			value: normalizedName,
			title: org.name,
			description: `${org.name} (${org.role})`,
			matchScore: 1.0,
			highlightedValue: normalizedName,
		})
	}

	return suggestions
}

export const teamsCommand: Command = {
	name: "teams",
	aliases: ["team", "org", "orgs"],
	description: "管理团队或组织",
	usage: "/teams [subcommand] [args]",
	examples: ["/teams", "/teams list", "/teams select personal", "/teams select kilo-code", "/teams select my-team"],
	category: "settings",
	priority: 10,
	arguments: [
		{
			name: "subcommand",
			description: "Subcommand: list, select",
			required: false,
			values: [
				{ value: "list", description: "列出所有可用的团队" },
				{ value: "select", description: "换到其他队伍" },
			],
		},
		{
			name: "team-name",
			description:
				"团队名称用小写字母和短横线表示（例如，“kilo-code”代表“Kilo Code”），或者用“personal”（用于选择子命令）。",
			required: false,
			conditionalProviders: [
				{
					condition: (context) => {
						const subcommand = context.getArgument("subcommand")
						return subcommand === "select"
					},
					provider: teamAutocompleteProvider,
				},
			],
		},
	],
	handler: async (context) => {
		const { args } = context

		// No arguments - show current team
		if (args.length === 0) {
			await listTeams(context)
			return
		}

		const subcommand = args[0]?.toLowerCase()
		if (!subcommand) {
			await listTeams(context)
			return
		}

		// Handle subcommands
		switch (subcommand) {
			case "list":
				await listTeams(context)
				break

			case "select":
				if (args.length < 2 || !args[1]) {
					context.addMessage({
						id: Date.now().toString(),
						type: "error",
						content: "用法: /teams select <team-id-or-name>\n使用 'personal' 切换到个人账户。",
						ts: Date.now(),
					})
					return
				}
				await selectTeam(context, args[1])
				break

			default:
				context.addMessage({
					id: Date.now().toString(),
					type: "error",
					content: `未知子命令 "${subcommand}"。可用命令：list, select`,
					ts: Date.now(),
				})
		}
	},
}
