import { useCallback, useState } from "react"
import { useExtensionState } from "../../../context/ExtensionStateContext"
import { validateApiConfiguration } from "../../../utils/validate"
import { vscode } from "../../../utils/vscode"
import { Tab, TabContent } from "../../common/Tab"
import { useAppTranslation } from "../../../i18n/TranslationContext"
import { ButtonPrimary } from "../common/ButtonPrimary"
import { ButtonLink } from "../common/ButtonLink"
import ApiOptions from "../../settings/ApiOptions"
import { getShengSuanYunAuthUrl } from "../helpers"
import { ButtonSecondary } from "../common/ButtonSecondary"

const WelcomeView = () => {
	const { apiConfiguration, currentApiConfigName, setApiConfiguration, uriScheme, uiKind } = useExtensionState()
	const [errorMessage, setErrorMessage] = useState<string | undefined>()
	const [manualConfig, setManualConfig] = useState(false)
	const { t } = useAppTranslation()

	const handleSubmit = useCallback(() => {
		const error = apiConfiguration ? validateApiConfiguration(apiConfiguration) : undefined

		if (error) {
			setErrorMessage(error)
			return
		}

		setErrorMessage(undefined)
		vscode.postMessage({ type: "upsertApiConfiguration", text: currentApiConfigName, apiConfiguration })
	}, [apiConfiguration, currentApiConfigName])

	return (
		<Tab>
			<TabContent className="flex flex-col gap-5">
				{manualConfig ? (
					<>
						<ApiOptions
							fromWelcomeView
							apiConfiguration={apiConfiguration || {}}
							uriScheme={uriScheme}
							uiKind={uiKind}
							setApiConfigurationField={(field, value) => setApiConfiguration({ [field]: value })}
							errorMessage={errorMessage}
							setErrorMessage={setErrorMessage}
							hideKiloCodeButton
						/>
						{!apiConfiguration?.apiProvider || apiConfiguration?.apiProvider === "shengsuanyun" ? (
							<ButtonLink href={getShengSuanYunAuthUrl(uriScheme)}>
								{t("kilocode:welcome.ctaButton")}
							</ButtonLink>
						) : (
							<ButtonPrimary onClick={handleSubmit}>{t("welcome:start")}</ButtonPrimary>
						)}
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
