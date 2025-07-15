// kilocode_change - new file
import { useAppTranslation } from "@src/i18n/TranslationContext"
import { useExtensionState } from "@src/context/ExtensionStateContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@src/components/ui"
import { vscode } from "@src/utils/vscode"

const AutocompletePromptSettings = () => {
	const { t } = useAppTranslation()
	const { listApiConfigMeta, autocompleteApiConfigId, setAutocompleteApiConfigId } = useExtensionState()

	return (
		<div className="mb-4 flex flex-col gap-3 pl-3">
			<div>
				<label className="block font-medium mb-1">{t("prompts:supportPrompts.enhance.apiConfiguration")}</label>
				<Select
					value={autocompleteApiConfigId || "-"}
					onValueChange={(value) => {
						setAutocompleteApiConfigId(value === "-" ? "" : value)
						vscode.postMessage({ type: "autocompleteApiConfigId", text: value })
					}}>
					<SelectTrigger data-testid="autocomplete-api-config-select" className="w-full">
						<SelectValue placeholder={t("prompts:supportPrompts.enhance.useCurrentConfig")} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="-">{t("prompts:supportPrompts.enhance.useCurrentConfig")}</SelectItem>
						{(listApiConfigMeta || []).map((config) => (
							<SelectItem
								key={config.id}
								value={config.id}
								data-testid={`autocomplete-${config.id}-option`}>
								{config.name} ({config.apiProvider})
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className="text-sm text-vscode-descriptionForeground mt-1">
					{t("prompts:supportPrompts.enhance.apiConfigDescription")}
				</div>
			</div>
		</div>
	)
}

export default AutocompletePromptSettings
