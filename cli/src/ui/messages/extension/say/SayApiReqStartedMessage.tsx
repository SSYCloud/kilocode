import React from "react"
import { Box, Text } from "ink"
import type { MessageComponentProps } from "../types.js"
import { parseApiReqInfo } from "../utils.js"
import { useTheme } from "../../../../state/hooks/useTheme.js"

/**
 * Display API request status (streaming/completed/failed/cancelled)
 */
export const SayApiReqStartedMessage: React.FC<MessageComponentProps> = ({ message }) => {
	const theme = useTheme()
	const apiInfo = parseApiReqInfo(message)

	// Streaming state
	if (message.partial) {
		return (
			<Box marginY={1}>
				<Text color={theme.semantic.info}>⟳ API 请求中...</Text>
			</Box>
		)
	}

	// Failed state
	if (apiInfo?.streamingFailedMessage) {
		return (
			<Box flexDirection="column" marginY={1}>
				<Box>
					<Text color={theme.semantic.error} bold>
						✖ API 请求失败
					</Text>
				</Box>
				<Box marginLeft={2} marginTop={1}>
					<Text color={theme.semantic.error}>{apiInfo.streamingFailedMessage}</Text>
				</Box>
			</Box>
		)
	}

	// Cancelled state
	if (apiInfo?.cancelReason) {
		return (
			<Box flexDirection="column" marginY={1}>
				<Box>
					<Text color={theme.semantic.warning} bold>
						⚠ API 请求取消
					</Text>
				</Box>
				<Box marginLeft={2} marginTop={1}>
					<Text color={theme.ui.text.dimmed} dimColor>
						推理: {apiInfo.cancelReason === "user_cancelled" ? "User cancelled" : apiInfo.cancelReason}
					</Text>
				</Box>
			</Box>
		)
	}

	// Completed state
	return (
		<Box marginY={1}>
			<Text color={theme.semantic.success} bold>
				✓ API Request
			</Text>
			{apiInfo?.cost !== undefined && (
				<>
					<Text color={theme.semantic.info}> - Cost: ${apiInfo.cost.toFixed(4)}</Text>
					{apiInfo.usageMissing && (
						<Text color={theme.ui.text.dimmed} dimColor>
							{" "}
							(estimated)
						</Text>
					)}
				</>
			)}
		</Box>
	)
}
