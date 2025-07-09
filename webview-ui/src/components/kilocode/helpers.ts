export function getKiloCodeBackendSignInUrl(uriScheme: string = "vscode", uiKind: string = "Desktop") {
	const baseUrl = "https://kilocode.ai"
	const source = uiKind === "Web" ? "web" : uriScheme
	return `${baseUrl}/users/sign_in?source=${source}`
}

export function getKiloCodeBackendSignUpUrl(uriScheme: string = "vscode", uiKind: string = "Desktop") {
	const baseUrl = "https://kilocode.ai"
	const source = uiKind === "Web" ? "web" : uriScheme
	return `${baseUrl}/users/sign_up?source=${source}`
}

export function getShengSuanYunAuthUrl(uriScheme: string = "vscode") {
	const id = "kilo-ssy"
	return `https://router.shengsuanyun.com/auth?from=${id}&callback_url=${encodeURIComponent(`${uriScheme || "vscode"}://shengsuan-cloud.${id}/ssy`)}`
}
