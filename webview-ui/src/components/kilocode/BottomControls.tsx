import React from "react"
import { vscode } from "../../utils/vscode"
import { useAppTranslation } from "@/i18n/TranslationContext"
import KiloRulesToggleModal from "./rules/KiloRulesToggleModal"
import BottomButton from "./BottomButton"

const BottomControls: React.FC = () => {
	const { t } = useAppTranslation()

	const showFeedbackOptions = () => {
		vscode.postMessage({ type: "showFeedbackOptions" })
	}

	return (
		<div className="flex flex-row justify-end w-auto h-[30px] mx-3.5 mb-1">
			<div className="flex items-center gap-1">
				<KiloRulesToggleModal />
				<BottomButton
					iconClass="codicon-feedback"
					title={t("common:feedback.title")}
					onClick={showFeedbackOptions}
				/>
			</div>
		</div>
	)
}

export default BottomControls
