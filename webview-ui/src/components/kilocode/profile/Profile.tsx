// import { useExtensionState } from "@/context/ExtensionStateContext" // No longer needed
import Logo from "../common/Logo"
import { Trans } from "react-i18next"
import { vscode } from "@/utils/vscode"
import React, { useEffect } from "react"
import { getShengSuanYunAuthUrl } from "@/oauth/urls"
import { useAppTranslation } from "@/i18n/TranslationContext"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { VSCodeButtonLink } from "@/components/common/VSCodeButtonLink"
import { ProfileDataResponsePayload, WebviewMessage } from "@roo/WebviewMessage"
import { VSCodeButton, VSCodeDivider, VSCodeLink } from "@vscode/webview-ui-toolkit/react"

interface ProfileProps {
	onDone: () => void
}
const Profile: React.FC<ProfileProps> = ({ onDone: _onDone }) => {
	const { apiConfiguration, uriScheme } = useExtensionState()
	const { t } = useAppTranslation()
	const [profileData, setProfileData] = React.useState<any>(null)
	const [isLoadingUser, setIsLoadingUser] = React.useState(true)

	useEffect(() => {
		vscode.postMessage({
			type: "fetchProfileDataRequest",
		})
	}, [apiConfiguration?.shengSuanYunXToken])

	useEffect(() => {
		const handleMessage = (event: MessageEvent<WebviewMessage>) => {
			const message = event.data
			if (message.type === "profileDataResponse") {
				const payload = message.payload as ProfileDataResponsePayload
				if (payload.success) {
					setProfileData(payload.data)
				} else {
					console.error("Error fetching profile data:", payload.error)
					setProfileData(null)
				}
				setIsLoadingUser(false)
			}
		}

		window.addEventListener("message", handleMessage)
		return () => {
			window.removeEventListener("message", handleMessage)
		}
	}, [])

	// function handleLogout(): void {
	// 	console.info("Logging out...", apiConfiguration)
	// 	vscode.postMessage({
	// 		type: "upsertApiConfiguration",
	// 		text: currentApiConfigName,
	// 		apiConfiguration: {
	// 			...apiConfiguration,
	// 			shengSuanYunXToken: "",
	// 		},
	// 	})
	// }

	if (isLoadingUser) {
		return <></>
	}
	const userName = profileData?.Username || profileData?.Nickname || null
	return (
		<div className="h-full flex flex-col">
			<div className="w-full flex justify-center">
				<Logo />
			</div>
			{profileData ? (
				<div className="flex flex-col pr-3 h-full">
					<div className="flex flex-col w-full">
						<div className="flex items-center mb-6 flex-wrap gap-y-4">
							<div className="flex flex-col">
								{userName && (
									<h2 className="text-[var(--vscode-foreground)] m-0 mb-1 text-lg font-medium">
										{userName}
									</h2>
								)}

								{profileData.Email && (
									<div className="text-sm text-[var(--vscode-descriptionForeground)]">
										{profileData.Email}
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="w-full flex gap-2 flex-col min-[225px]:flex-row">
						<div className="w-full min-[225px]:w-1/2">
							<VSCodeButtonLink
								href="https://router.shengsuanyun.com/user/recharge"
								appearance="primary"
								className="w-full">
								{t("kilocode:profile.dashboard")}
							</VSCodeButtonLink>
						</div>
						<VSCodeButton
							appearance="secondary"
							onClick={() => _onDone()}
							className="w-full min-[225px]:w-1/2">
							确 定
						</VSCodeButton>
					</div>

					<VSCodeDivider className="w-full my-6" />

					{profileData.Wallet.Assets < 1 ? (
						<div className="w-full flex flex-col items-center">
							<div className="text-sm text-[var(--vscode-descriptionForeground)] mb-3">
								进群联系客服，领取免费额度
							</div>
							<div className="w-[130px] h-[130px]">
								<img
									src="https://router.shengsuanyun.com/webp/relation-BDyr0A7L.webp"
									alt="customer service"
								/>
							</div>
						</div>
					) : (
						<div className="w-full flex flex-col items-center">
							<div className="text-sm text-[var(--vscode-descriptionForeground)] mb-3">
								{t("kilocode:profile.currentBalance")}
							</div>
							<div className="text-2xl font-bold text-[var(--vscode-foreground)] mb-6 flex items-center gap-2">
								<span>￥{(profileData.Wallet.Assets / 10000).toFixed(2)}</span>
							</div>
						</div>
					)}
				</div>
			) : (
				<div className="flex flex-col items-center pr-3">
					<p className="text-center">{t("kilocode:profile.signUp.description")}</p>
					<VSCodeButtonLink href={getShengSuanYunAuthUrl(uriScheme)} className="w-full mb-4">
						{t("kilocode:profile.signUp.title")}
					</VSCodeButtonLink>
					<p className="text-[var(--vscode-descriptionForeground)] text-xs text-center m-0">
						<Trans
							i18nKey="kilocode:profile.signUp.termsAndPrivacy"
							components={{
								termsLink: <VSCodeLink href="https://kilocode.ai/terms" />,
								privacyLink: <VSCodeLink href="https://kilocode.ai/privacy" />,
							}}
						/>
					</p>
				</div>
			)}
		</div>
	)
}

export default Profile
