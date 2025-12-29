/**
 * /profile command - View user profile information
 */

import type { Command, CommandContext } from "./core/types.js"
import type { UserOrganization } from "../state/atoms/profile.js"

/**
 * Show user profile information
 */
async function showProfile(context: CommandContext): Promise<void> {
	const { currentProvider, addMessage, profileData, balanceData, profileLoading, balanceLoading } = context

	// Check if user is authenticated with Kilocode
	if (!currentProvider || currentProvider.provider !== "shengsuanyun") {
		addMessage({
			id: Date.now().toString(),
			type: "error",
			content: "Profile 命令需要 胜算云 提供程序。请将 胜算云 配置为您的提供程序。",
			ts: Date.now(),
		})
		return
	}

	if (!currentProvider.shengSuanYunToken) {
		addMessage({
			id: Date.now().toString(),
			type: "error",
			content: "未通过身份验证。请先配置您的胜算云令牌。",
			ts: Date.now(),
		})
		return
	}

	// Check if still loading
	if (profileLoading || balanceLoading) {
		addMessage({
			id: Date.now().toString(),
			type: "system",
			content: "加载账户信息...",
			ts: Date.now(),
		})
		return
	}

	// Display profile information
	if (!profileData) {
		addMessage({
			id: Date.now().toString(),
			type: "error",
			content: "没有账户信息",
			ts: Date.now(),
		})
		return
	}

	const user = profileData.user

	if (!user) {
		addMessage({
			id: Date.now().toString(),
			type: "error",
			content: "没有账户信息",
			ts: Date.now(),
		})
		return
	}

	// Format profile information
	let content = "**账户信息:**\n\n"

	if (user.name) {
		content += `${user.name}\n`
	}

	if (user.email) {
		content += `Email: ${user.email}\n`
	}

	if (balanceData?.balance !== undefined && balanceData?.balance !== null) {
		content += `余额: $${balanceData.balance.toFixed(2)}\n`
	}

	// Show current organization if set
	const currentOrgId = currentProvider.kilocodeOrganizationId
	if (currentOrgId && profileData?.organizations) {
		const currentOrg = profileData.organizations.find((org: UserOrganization) => org.id === currentOrgId)
		if (currentOrg) {
			content += `Teams: ${currentOrg.name} (${currentOrg.role})\n`
		}
	} else {
		content += `Teams: Personal\n`
	}

	addMessage({
		id: Date.now().toString(),
		type: "system",
		content,
		ts: Date.now(),
	})
}

export const profileCommand: Command = {
	name: "profile",
	aliases: ["me", "whoami"],
	description: "查看账户信息",
	usage: "/profile",
	examples: ["/profile"],
	category: "settings",
	priority: 9,
	arguments: [],
	handler: async (context) => {
		await showProfile(context)
	},
}
