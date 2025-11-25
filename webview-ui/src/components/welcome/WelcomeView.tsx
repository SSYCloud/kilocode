import { useCallback, useState } from "react"
import { Trans } from "react-i18next"
import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react"

import type { ProviderSettings } from "@roo-code/types"
import { TelemetryEventName } from "@roo-code/types"

import { useExtensionState } from "@src/context/ExtensionStateContext"
import { validateApiConfiguration } from "@src/utils/validate"
import { vscode } from "@src/utils/vscode"
import { useAppTranslation } from "@src/i18n/TranslationContext"
import { telemetryClient } from "@src/utils/TelemetryClient"

import ApiOptions from "../settings/ApiOptions"
import { Tab, TabContent } from "../common/Tab"

// import RooHero from "./RooHero"
import { getShengSuanYunAuthUrl } from "../kilocode/helpers"
import RooHero from "./RooHero"

const WelcomeView = () => {
	const { apiConfiguration, currentApiConfigName, setApiConfiguration, uriScheme } = useExtensionState()
	const { t } = useAppTranslation()
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
	// const [ setShowRooProvider] = useState(false)

	// Check PostHog feature flag for Roo provider
	// useEffect(() => {
	// 	posthog.onFeatureFlags(function () {
	// 		setShowRooProvider(posthog?.getFeatureFlag("roo-provider-featured") === "test")
	// 	})
	// }, [])

	// Memoize the setApiConfigurationField function to pass to ApiOptions
	const setApiConfigurationFieldForApiOptions = useCallback(
		<K extends keyof ProviderSettings>(field: K, value: ProviderSettings[K]) => {
			setApiConfiguration({ [field]: value })
		},
		[setApiConfiguration], // setApiConfiguration from context is stable
	)

	const handleSubmit = () => {
		const error = apiConfiguration ? validateApiConfiguration(apiConfiguration) : undefined

		if (error) {
			setErrorMessage(error)
			return
		}
		setErrorMessage(undefined)
		vscode.postMessage({ type: "upsertApiConfiguration", text: currentApiConfigName, apiConfiguration })
	}

	// Using a lazy initializer so it reads once at mount
	const [imagesBaseUri] = useState(() => {
		const w = window as any
		return w.IMAGES_BASE_URI || ""
	})

	return (
		<Tab>
			<TabContent className="flex flex-col gap-4 p-6">
				<RooHero />
				<h2 className="mt-0 mb-4 text-xl text-center">{t("welcome:greeting")}</h2>

				<div className="text-base text-vscode-foreground py-2 px-2 mb-4">
					<p className="mb-3 leading-relaxed">
						<Trans i18nKey="welcome:introduction" />
					</p>
					<p className="mb-0 leading-relaxed">
						<Trans i18nKey="welcome:chooseProvider" />
					</p>
				</div>

				<div className="mb-4">
					<p className="text-sm font-medium mt-4 mb-3">{t("welcome:startRouter")}</p>

					<div>
						{/* Define the providers */}
						{(() => {
							// Provider card configuration
							const baseProviders = [
								{
									slug: "panel_light",
									name: "胜算云",
									description: t("welcome:routers.shengsuanyun.description"),
									authUrl: getShengSuanYunAuthUrl(uriScheme),
								},
							]

							// Render the provider cards
							return baseProviders.map((provider, index) => (
								<a
									key={index}
									href={provider.authUrl}
									className="relative flex-1 border border-vscode-panel-border hover:bg-secondary rounded-md py-3 px-4 mb-2 flex flex-row gap-3 cursor-pointer transition-all no-underline text-inherit"
									target="_blank"
									rel="noopener noreferrer"
									onClick={(e) => {
										// Track telemetry for featured provider click
										telemetryClient.capture(TelemetryEventName.FEATURED_PROVIDER_CLICKED, {
											provider: provider.slug,
										})

										// Special handling for Roo provider
										if (provider.slug === "roo") {
											e.preventDefault()

											// Set the Roo provider configuration
											const rooConfig: ProviderSettings = {
												apiProvider: "roo",
											}

											// Save the Roo provider configuration
											vscode.postMessage({
												type: "upsertApiConfiguration",
												text: currentApiConfigName,
												apiConfiguration: rooConfig,
											})

											// Then trigger cloud sign-in
											vscode.postMessage({ type: "rooCloudSignIn" })
										}
										// For other providers, let the default link behavior work
									}}>
									<div className="w-8 h-8 flex-shrink-0">
										<img
											src={`${imagesBaseUri}/${provider.slug}.png`}
											alt={provider.name}
											className="w-full h-full object-contain"
										/>
									</div>
									<div className="font-bold text-vscode-foreground">{provider.name}</div>
									<div>
										<div className="text-sm font-medium text-vscode-foreground">
											{provider.name}
										</div>
										<div className="text-xs text-vscode-descriptionForeground">
											{provider.description}
										</div>
									</div>
								</a>
							))
						})()}
					</div>

					<p className="text-sm font-medium mt-6 mb-3">{t("welcome:startCustom")}</p>
					<ApiOptions
						fromWelcomeView
						apiConfiguration={apiConfiguration || {}}
						uriScheme={uriScheme}
						setApiConfigurationField={setApiConfigurationFieldForApiOptions}
						errorMessage={errorMessage}
						setErrorMessage={setErrorMessage}
					/>
				</div>
			</TabContent>
			<div className="sticky bottom-0 bg-vscode-sideBar-background p-4 border-t border-vscode-panel-border">
				<div className="flex flex-col gap-2">
					<div className="flex justify-end">
						<VSCodeLink
							href="#"
							onClick={(e) => {
								e.preventDefault()
								vscode.postMessage({ type: "importSettings" })
							}}
							className="text-sm">
							{t("welcome:importSettings")}
						</VSCodeLink>
					</div>
					<VSCodeButton onClick={handleSubmit} appearance="primary">
						{t("welcome:start")}
					</VSCodeButton>
					{errorMessage && <div className="text-vscode-errorForeground">{errorMessage}</div>}
				</div>
			</div>
		</Tab>
	)
}

export default WelcomeView
