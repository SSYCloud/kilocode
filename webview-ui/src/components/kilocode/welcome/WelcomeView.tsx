import { useState, useEffect, useRef } from "react"
import { useExtensionState } from "../../../context/ExtensionStateContext"
// import { validateApiConfiguration } from "../../../utils/validate"
import { vscode } from "../../../utils/vscode"
import { Tab, TabContent } from "../../common/Tab"
import { useAppTranslation } from "../../../i18n/TranslationContext"
import { ButtonLink } from "../common/ButtonLink"
import ApiOptions from "../../settings/ApiOptions"
import { getShengSuanYunAuthUrl } from "../helpers"
import { ButtonSecondary } from "../common/ButtonSecondary"

const WelcomeView = () => {
	const { apiConfiguration, setApiConfiguration, uriScheme } = useExtensionState()
	const [errorMessage, setErrorMessage] = useState<string | undefined>()
	const [manualConfig, setManualConfig] = useState(false)
	const { t } = useAppTranslation()
	const pendingActivation = useRef<string | null | undefined>(null)

	// Listen for state updates to activate profile after save completes
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			const message = event.data
			// When we receive a state update and have a pending activation, activate the profile
			if (message.type === "state" && pendingActivation.current) {
				const profileToActivate = pendingActivation.current
				pendingActivation.current = null
				// Activate the profile now that it's been saved
				vscode.postMessage({ type: "loadApiConfiguration", text: profileToActivate })
			}
		}

		window.addEventListener("message", handleMessage)
		return () => window.removeEventListener("message", handleMessage)
	}, [])

	// const handleSubmit = useCallback(() => {
	// 	const error = apiConfiguration ? validateApiConfiguration(apiConfiguration) : undefined

	// 	if (error) {
	// 		setErrorMessage(error)
	// 		return
	// 	}

	// 	setErrorMessage(undefined)
	// 	// Mark that we want to activate this profile after save completes
	// 	pendingActivation.current = currentApiConfigName
	// 	// Save the configuration - activation will happen when state update is received
	// 	vscode.postMessage({ type: "upsertApiConfiguration", text: currentApiConfigName, apiConfiguration })
	// }, [apiConfiguration, currentApiConfigName])

	return (
		<Tab>
			<TabContent className="flex flex-col gap-5">
				{manualConfig ? (
					<>
						<ApiOptions
							fromWelcomeView
							apiConfiguration={apiConfiguration || {}}
							uriScheme={uriScheme}
							setApiConfigurationField={(field, value) => setApiConfiguration({ [field]: value })}
							errorMessage={errorMessage}
							setErrorMessage={setErrorMessage}
							hideKiloCodeButton
						/>
						{/* {isSettingUpKiloCode ? (
							<ButtonLink
								href={getKiloCodeBackendSignInUrl(uriScheme, uiKind, kiloCodeWrapperProperties)}>
								{t("kilocode:settings.provider.login")}
							</ButtonLink>
						) : (
							<ButtonPrimary onClick={handleSubmit}>{t("welcome:start")}</ButtonPrimary>
						)} */}
					</>
				) : (
					<div className="bg-vscode-sideBar-background">
						<div className="flex flex-col gap-5">
							<ButtonLink href={getShengSuanYunAuthUrl(uriScheme)}>
								{t("kilocode:welcome.ctaButton")}
							</ButtonLink>
							<ButtonSecondary onClick={() => setManualConfig(true)}>
								{t("kilocode:welcome.manualModeButton")}
							</ButtonSecondary>
							<div className="text-center text-vscode-descriptionForeground">
								{t("kilocode:welcome.alreadySignedUp")}{" "}
								<a
									href={getShengSuanYunAuthUrl(uriScheme)}
									className="underline"
									style={{ color: "inherit" }}>
									{t("kilocode:welcome.loginText")}
								</a>
							</div>
						</div>
					</div>
				)}
			</TabContent>
		</Tab>
	)
}

export default WelcomeView
