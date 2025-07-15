// kilocode_change - new file
import { ContextProxy } from "../../../core/config/ContextProxy"
import { ProviderSettingsManager } from "../../../core/config/ProviderSettingsManager"
import { ProviderSettings } from "@roo-code/types"

export async function getAutocompleteConfiguration(
	providerSettingsManager: ProviderSettingsManager,
): Promise<ProviderSettings | undefined> {
	await providerSettingsManager.initialize()

	// If we have a specific API config ID for autocomplete, try to get the profile.
	const contextProxy = ContextProxy.instance
	const autocompleteApiConfigId = contextProxy?.getValues().autocompleteApiConfigId
	if (autocompleteApiConfigId) {
		try {
			return await providerSettingsManager.getProfile({ id: autocompleteApiConfigId })
		} catch (error) {
			console.error("Failed to get autocomplete profile:", error)
		}
	}

	return undefined
}
