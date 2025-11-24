import { X_KILOCODE_VERSION } from "../../shared/kilocode/headers"
import { Package } from "../../shared/package"

export const DEFAULT_HEADERS = {
	"HTTP-Referer": "vscode://shengsuan-cloud.kilo-ssy/ssy",
	"X-Title": "Kilo Code Chinese",
	"X-KiloCode-Version": Package.version, // kilocode_change
}
