export function getKiloCodeBackendSignInUrl(uriScheme: string = "vscode", uiKind: string = "Desktop") {
	const baseUrl = "https://kilocode.ai"
	const source = uiKind === "Web" ? "web" : uriScheme
	return `${baseUrl}/sign-in-to-editor?source=${source}`
}

export function getKiloCodeBackendSignUpUrl(uriScheme: string = "vscode", uiKind: string = "Desktop") {
	const baseUrl = "https://kilocode.ai"
	const source = uiKind === "Web" ? "web" : uriScheme
	return `${baseUrl}/users/sign_up?source=${source}`
}

export function getShengSuanYunAuthUrl(uriScheme: string = "vscode") {
	const id = "kilo-ssy"
	const author = "shengsuan-cloud"
	const from = "CH_0HJ73HTC"
	return `https://router.shengsuanyun.com/auth?from=${from}&callback_url=${encodeURIComponent(`${uriScheme || "vscode"}://${author}.${id}/ssy`)}`
}
