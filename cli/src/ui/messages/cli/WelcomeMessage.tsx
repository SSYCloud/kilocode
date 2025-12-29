import React from "react"
import { Box, Text } from "ink"
import { Logo } from "../../components/Logo.js"
import type { WelcomeMessageOptions } from "../../../types/cli.js"
import { useTheme } from "../../../state/hooks/useTheme.js"
import { stdout } from "process"

interface WelcomeMessageProps {
	options?: WelcomeMessageOptions | undefined
}

const DEFAULT_INSTRUCTIONS = ["开始对话, or 输入 /help 查询命令", "命令以 / 开头 (e.g., /help, /mode, /model)"]

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ options = {} }) => {
	const theme = useTheme()
	const showInstructions = options.showInstructions !== false
	const instructions =
		options.instructions && options.instructions.length > 0 ? options.instructions : DEFAULT_INSTRUCTIONS
	const showParallelMessage = !!options.worktreeBranch
	const contentHeight = 12 + (showInstructions ? instructions.length : 0) + (showParallelMessage ? 1 : 0)
	const marginTop = options.clearScreen ? Math.max(0, (stdout?.rows || 0) - contentHeight) : 0

	return (
		<Box flexDirection="column" gap={2} marginTop={marginTop}>
			{/* Logo section - always shown */}
			<Logo />

			{/* Instructions section */}
			{showInstructions && (
				<Box flexDirection="column">
					{instructions.map((instruction, index) => (
						<Text key={index} color={theme.ui.text.dimmed}>
							{instruction}
						</Text>
					))}
				</Box>
			)}

			{/* Parallel mode message */}
			{showParallelMessage && (
				<Box flexDirection="column" gap={1}>
					<Text color={theme.ui.text.primary}>
						您正在分支上工作{" "}
						<Text bold color={theme.ui.text.highlight}>
							{options.worktreeBranch}
						</Text>{" "}
						并行运行。当您使用 /exit 命令退出时，更改将被提交。
					</Text>
					<Box flexDirection="column">
						<Text color={theme.ui.text.primary}>
							如果出现错误，您待处理的更改将保存在…… <Text bold>{options.workspace}</Text>
						</Text>
						<Text>该目录中的提交将在您的主仓库目录中可见。</Text>
					</Box>
				</Box>
			)}
		</Box>
	)
}
