export function getKiloCodeBackendAuthUrl(uriScheme: string = "vscode") {
	return `https://kilocode.ai/auth/signin?source=${uriScheme}`
}

export function getShengSuanYunAuthUrl(uriScheme: string = "vscode") {
	return `https://router.shengsuanyun.com/?source=${uriScheme}`
}
