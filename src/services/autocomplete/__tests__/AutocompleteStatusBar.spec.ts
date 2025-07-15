import { AutocompleteStatusBar } from "../AutocompleteStatusBar"

vi.mock("../../../i18n", () => ({
	t: vi.fn((key: string) => {
		const translations: Record<string, string> = {
			"kilocode:autocomplete.statusBar.enabled": "$(sparkle) Kilo Complete",
			"kilocode:autocomplete.statusBar.disabled": "$(circle-slash) Kilo Complete",
			"kilocode:autocomplete.statusBar.warning": "$(warning) Kilo Complete",
			"kilocode:autocomplete.statusBar.tooltip.basic": "Kilo Code Autocomplete",
			"kilocode:autocomplete.statusBar.tooltip.disabled": "Kilo Code Autocomplete (disabled)",
			"kilocode:autocomplete.statusBar.tooltip.tokenError": "A valid token must be set to use autocomplete",
			"kilocode:autocomplete.statusBar.tooltip.lastCompletion": "Last completion:",
			"kilocode:autocomplete.statusBar.tooltip.sessionTotal": "Session total cost:",
			"kilocode:autocomplete.statusBar.tooltip.model": "Model:",
			"kilocode:autocomplete.statusBar.cost.zero": "$0.00",
			"kilocode:autocomplete.statusBar.cost.lessThanCent": "<$0.01",
		}
		return translations[key] || key
	}),
}))

vi.mock("vscode", () => ({
	window: {
		createStatusBarItem: vi.fn(() => ({
			text: "",
			tooltip: "",
			command: "",
			show: vi.fn(),
			hide: vi.fn(),
			dispose: vi.fn(),
		})),
	},
	StatusBarAlignment: {
		Right: 2,
	},
}))

describe("AutocompleteStatusBar", () => {
	let statusBar: AutocompleteStatusBar

	beforeEach(() => {
		vi.clearAllMocks()
		statusBar = new AutocompleteStatusBar({
			enabled: true,
			model: "test-model",
			hasValidToken: true,
		})
	})

	afterEach(() => {
		statusBar.dispose()
	})

	it("should update enabled state to false and render correctly", () => {
		// Initially enabled
		expect(statusBar.enabled).toBe(true)

		// Update to disabled
		statusBar.update({ enabled: false })

		// Should be disabled and render correctly
		expect(statusBar.enabled).toBe(false)
		expect(statusBar.statusBar.text).toBe("$(circle-slash) Kilo Complete")
		expect(statusBar.statusBar.tooltip).toBe("Kilo Code Autocomplete (disabled)")
	})

	it("should update enabled state to true and render correctly", () => {
		// Start with disabled state
		statusBar.update({ enabled: false })
		expect(statusBar.enabled).toBe(false)

		// Update to enabled
		statusBar.update({ enabled: true })

		// Should be enabled and render correctly
		expect(statusBar.enabled).toBe(true)
		expect(statusBar.statusBar.text).toBe("$(sparkle) Kilo Complete ($0.00)")
	})

	it("should not change enabled state when not provided", () => {
		// Initially enabled
		expect(statusBar.enabled).toBe(true)

		// Update without changing enabled state
		statusBar.update({})

		// Should still be enabled
		expect(statusBar.enabled).toBe(true)
	})
})
