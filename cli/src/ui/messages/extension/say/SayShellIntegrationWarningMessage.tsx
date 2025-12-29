import React from "react"
import { Box, Text } from "ink"
import type { MessageComponentProps } from "../types.js"
import { MarkdownText } from "../../../components/MarkdownText.js"
import { useTheme } from "../../../../state/hooks/useTheme.js"
import { getBoxWidth } from "../../../utils/width.js"

/**
 * Display shell integration warnings
 */
export const SayShellIntegrationWarningMessage: React.FC<MessageComponentProps> = ({ message }) => {
	const theme = useTheme()
	return (
		<Box
			width={getBoxWidth(1)}
			flexDirection="column"
			borderStyle="single"
			borderColor={theme.semantic.warning}
			paddingX={1}
			marginY={1}>
			<Box>
				<Text color={theme.semantic.warning} bold>
					⚠ Shell 集成警告
				</Text>
			</Box>
			{message.text && (
				<Box marginTop={1}>
					<MarkdownText>{message.text}</MarkdownText>
				</Box>
			)}
			<Box marginTop={1}>
				<Text color={theme.ui.text.dimmed} dimColor>
					要正确执行命令，可能需要进行 Shell 集成。
				</Text>
			</Box>
		</Box>
	)
}
