import React from "react"
import { Box, Text } from "ink"
import type { ToolMessageProps } from "../types.js"
import { getToolIcon } from "../utils.js"
import { useTheme } from "../../../../state/hooks/useTheme.js"

/**
 * Display slash command execution
 */
export const ToolRunSlashCommandMessage: React.FC<ToolMessageProps> = ({ toolData }) => {
	const theme = useTheme()
	const icon = getToolIcon("runSlashCommand")

	return (
		<Box flexDirection="column" marginY={1}>
			<Box>
				<Text color={theme.ui.text.highlight} bold>
					{icon} 运行斜杠命令
				</Text>
			</Box>

			<Box marginLeft={2} flexDirection="column">
				<Box>
					<Text color={theme.ui.text.dimmed} dimColor>
						命令:{" "}
					</Text>
					<Text color={theme.semantic.info}>/{toolData.command || ""}</Text>
				</Box>
				{toolData.args && (
					<Box>
						<Text color={theme.ui.text.dimmed} dimColor>
							参数:{" "}
						</Text>
						<Text color={theme.ui.text.primary}>{toolData.args}</Text>
					</Box>
				)}
				{toolData.description && (
					<Box marginTop={1}>
						<Text color={theme.ui.text.dimmed} dimColor>
							描述:{" "}
						</Text>
						<Text color={theme.ui.text.primary}>{toolData.description}</Text>
					</Box>
				)}
				{toolData.source && (
					<Box>
						<Text color={theme.ui.text.dimmed} dimColor>
							源:{" "}
						</Text>
						<Text color={theme.ui.text.dimmed}>{toolData.source}</Text>
					</Box>
				)}
			</Box>
		</Box>
	)
}
