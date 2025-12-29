/**
 * Hook for managing hotkey state and handlers
 */

import { useAtomValue } from "jotai"
import { useMemo } from "react"
import { isStreamingAtom, showFollowupSuggestionsAtom } from "../atoms/ui.js"
import { useApprovalHandler } from "./useApprovalHandler.js"
import { hasResumeTaskAtom } from "../atoms/extension.js"
import { shellModeActiveAtom } from "../atoms/keyboard.js"

export interface Hotkey {
	/** The key combination (e.g., "Ctrl+C", "Cmd+X") */
	keys: string
	/** Description of what the hotkey does */
	description: string
	/** Whether this is the primary/recommended action */
	primary?: boolean
}

export interface UseHotkeysReturn {
	/** List of currently available hotkeys */
	hotkeys: Hotkey[]
	/** Whether any hotkeys should be displayed */
	shouldShow: boolean
	/** The platform-specific modifier key (Cmd or Ctrl) */
	modifierKey: string
}

/**
 * Detects the platform and returns the appropriate modifier key
 */
function getModifierKey(): string {
	const platform = process.platform
	return platform === "darwin" ? "Cmd" : "Ctrl"
}

/**
 * Hook to manage and display context-aware hotkeys
 *
 * Returns different hotkeys based on the current UI state:
 * - When streaming: Shows cancel hotkey
 * - When approval pending: Shows approval hotkeys
 * - When followup suggestions visible: Shows navigation hotkeys
 * - When idle: Shows general command hotkeys
 */
export function useHotkeys(): UseHotkeysReturn {
	const isStreaming = useAtomValue(isStreamingAtom)
	const isFollowupVisible = useAtomValue(showFollowupSuggestionsAtom)
	const hasResumeTask = useAtomValue(hasResumeTaskAtom)
	const isShellModeActive = useAtomValue(shellModeActiveAtom)
	const { isApprovalPending } = useApprovalHandler()

	const modifierKey = useMemo(() => getModifierKey(), [])

	const hotkeys = useMemo((): Hotkey[] => {
		// Priority 1: Resume task hotkey
		if (hasResumeTask) {
			return [{ keys: `${modifierKey}+R`, description: "重启" }]
		}

		// Priority 2: Approval mode hotkeys
		if (isApprovalPending) {
			return [
				{ keys: "Y", description: "批准" },
				{ keys: "N", description: "拒绝" },
				{ keys: "Esc", description: "取消" },
			]
		}

		// Priority 3: Streaming state - show cancel
		if (isStreaming) {
			return [{ keys: `${modifierKey}+X`, description: "取消" }]
		}

		// Priority 4: Followup suggestions visible
		if (isFollowupVisible) {
			return [
				{ keys: "↑↓", description: "导航" },
				{ keys: "Tab", description: "自动补全" },
				{ keys: "Enter", description: "提交" },
			]
		}

		// Priority 5: Shell mode hotkeys
		if (isShellModeActive) {
			return [
				{ keys: "Up/Down", description: "历史" },
				{ keys: "Enter", description: "执行" },
				{ keys: "Esc", description: "退出" },
				{ keys: "!", description: "退出 shell 模式" },
			]
		}

		// Default: General command hints
		return [
			{ keys: "/help", description: "查询命令" },
			{ keys: "/mode", description: "切换模式" },
			{ keys: "!", description: "shell 模式", primary: true },
		]
	}, [hasResumeTask, isApprovalPending, isStreaming, isFollowupVisible, isShellModeActive, modifierKey])

	const shouldShow = hotkeys.length > 0

	return {
		hotkeys,
		shouldShow,
		modifierKey,
	}
}
