import { Package } from "../../shared/package"

export const DEFAULT_HEADERS = {
	"HTTP-Referer": "vscode://shengsuan-cloud.kilo-ssy/ssy",
	"X-Title": "Kilo Code",
	"X-KiloCode-Version": Package.version, // kilocode_change
}
