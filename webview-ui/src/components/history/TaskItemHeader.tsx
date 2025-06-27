import React from "react"
import type { HistoryItem } from "@roo-code/types"
import { formatDate } from "@/utils/format"
import { DeleteButton } from "./DeleteButton"
import { cn } from "@/lib/utils"
import { Button } from "@src/components/ui"
import { vscode } from "@/utils/vscode" // kilocode_change: pull slash commands from Cline
import { useAppTranslation } from "@/i18n/TranslationContext"

export interface TaskItemHeaderProps {
	item: HistoryItem
	isSelectionMode: boolean
	onDelete?: (taskId: string) => void
}

const TaskItemHeader: React.FC<TaskItemHeaderProps> = ({ item, isSelectionMode, onDelete }) => {
	const { t } = useAppTranslation()

	// kilocode_change start
	// Standardized icon styles
	const actionIconStyle: React.CSSProperties = {
		fontSize: "16px",
		color: "var(--vscode-descriptionForeground)",
		verticalAlign: "middle",
	}

	const handleFavoriteClick = (e: React.MouseEvent) => {
		e.stopPropagation()
		vscode.postMessage({ type: "toggleTaskFavorite", text: item.id })
	}
	// kilocode_change end

	return (
		<div
			className={cn("flex justify-between items-center", {
				// this is to balance out the margin when we don't have a delete button
				// because the delete button sorta pushes the date up due to its size
				"mb-1": !onDelete,
			})}>
			<div className="flex items-center flex-wrap gap-x-2 text-xs">
				<span className="text-vscode-descriptionForeground font-medium text-sm uppercase">
					{formatDate(item.ts)}
				</span>
			</div>

			{/* Action Buttons */}
			{!isSelectionMode && (
				<div className="flex flex-row gap-0 items-center opacity-20 group-hover:opacity-50 hover:opacity-100">
					{/* kilocode_change start */}
					{/* Favorite Star Button */}
					<Button
						variant="ghost"
						size="icon"
						title={item.isFavorited ? t("history:unfavoriteTask") : t("history:favoriteTask")}
						data-testid="favorite-task-button"
						onClick={handleFavoriteClick}
						className={item.isFavorited ? "text-yellow-500" : ""}>
						<span
							className={`codicon ${item.isFavorited ? "codicon-star-full" : "codicon-star-empty"}`}
							style={actionIconStyle}
						/>
					</Button>
					{/* kilocode_change end */}
					{onDelete && <DeleteButton itemId={item.id} onDelete={onDelete} />}
				</div>
			)}
		</div>
	)
}

export default TaskItemHeader
