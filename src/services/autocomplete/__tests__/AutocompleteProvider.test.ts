// Mock the vscode module
vi.mock("vscode", () => ({
	window: {
		createTextEditorDecorationType: vi.fn().mockReturnValue({ dispose: vi.fn() }),
		activeTextEditor: {
			selection: { active: {} },
			edit: vi.fn().mockImplementation(() => Promise.resolve(true)),
			setDecorations: vi.fn(),
		},
	},
	commands: {
		executeCommand: vi.fn(),
		registerCommand: vi.fn().mockImplementation((_, handler) => {
			if (_ === "kilo-code.acceptAutocompletePreview") {
				;(global as any).acceptHandler = handler
			}
			return { dispose: vi.fn() }
		}),
	},
	Range: class {
		constructor(
			public start: any,
			public end: any,
		) {}
	},
	ThemeColor: class {
		constructor(public id: string) {}
	},
	DecorationRangeBehavior: { ClosedOpen: 1 },
	StatusBarAlignment: { Right: 1 },
	workspace: {
		getConfiguration: vi.fn().mockReturnValue({ get: vi.fn() }),
		onDidChangeConfiguration: vi.fn().mockReturnValue({ dispose: vi.fn() }),
		onDidChangeTextDocument: vi.fn().mockReturnValue({ dispose: vi.fn() }),
	},
}))

// Create a mock class that simulates the behavior we want to test
class MockAutocompleteProvider {
	// State variables
	isShowingAutocompletePreview = false
	currentAutocompletePreview = ""
	firstLinePreview = ""
	remainingLinesPreview = ""
	hasAcceptedFirstLine = false

	// Mock editor
	editor = {
		selection: { active: {} },
		edit: vi.fn().mockImplementation((callback) => {
			const editBuilder = { insert: vi.fn() }
			callback(editBuilder)

			// Create a mock Promise with a then method that can be called in tests
			const mockPromise = {
				then: vi.fn().mockImplementation((thenCallback) => {
					// Store the callback for later execution in tests
					mockPromise._thenCallback = thenCallback
					return mockPromise
				}),
				_thenCallback: null,
			}

			return mockPromise
		}),
		setDecorations: vi.fn(),
	}

	// Clear preview method
	clearAutocompletePreview() {
		this.isShowingAutocompletePreview = false
		this.currentAutocompletePreview = ""
		this.firstLinePreview = ""
		this.remainingLinesPreview = ""
		this.hasAcceptedFirstLine = false
	}

	// Update preview method
	updateAutocompletePreview(editor: any, text: string) {
		this.currentAutocompletePreview = text
		this.isShowingAutocompletePreview = true
	}

	// Accept preview command handler
	acceptAutocompletePreview() {
		if (this.isShowingAutocompletePreview) {
			const pos = this.editor.selection.active

			if (!this.hasAcceptedFirstLine) {
				// First Tab press: Insert only the first line
				if (this.firstLinePreview) {
					this.editor
						.edit((editBuilder: any) => {
							editBuilder.insert(pos, this.firstLinePreview)
						})
						.then(() => {
							// If there are remaining lines, keep them for the next Tab press
							if (this.remainingLinesPreview) {
								this.hasAcceptedFirstLine = true
								this.currentAutocompletePreview = this.remainingLinesPreview
								this.updateAutocompletePreview(this.editor, this.remainingLinesPreview)
							} else {
								this.clearAutocompletePreview()
							}
						})
				}
			} else {
				// Second Tab press: Insert the remaining lines
				if (this.remainingLinesPreview) {
					this.editor
						.edit((editBuilder: any) => {
							editBuilder.insert(pos, this.remainingLinesPreview)
						})
						.then(() => {
							this.clearAutocompletePreview()
						})
				}
			}
		}
	}
}

describe("Two-stage completion acceptance", () => {
	let provider: MockAutocompleteProvider

	beforeEach(() => {
		vi.clearAllMocks()
		provider = new MockAutocompleteProvider()
	})

	test("should accept first line on first Tab press", () => {
		// Setup
		provider.isShowingAutocompletePreview = true
		provider.firstLinePreview = "first line"
		provider.remainingLinesPreview = "second line\nthird line"
		provider.hasAcceptedFirstLine = false
		provider.currentAutocompletePreview = "first line"

		// Execute the accept command
		provider.acceptAutocompletePreview()

		// Verify edit was called
		expect(provider.editor.edit).toHaveBeenCalled()

		// Get the edit callback that was passed to edit()
		const editCallback = provider.editor.edit.mock.calls[0][0]
		const mockEditBuilder = { insert: vi.fn() }

		// Execute the edit callback
		editCallback(mockEditBuilder)

		// Verify the first line was inserted
		expect(mockEditBuilder.insert).toHaveBeenCalledWith(provider.editor.selection.active, "first line")

		// Simulate the edit completion
		const mockPromise = provider.editor.edit.mock.results[0].value
		mockPromise._thenCallback()

		// Verify state after accepting first line
		expect(provider.hasAcceptedFirstLine).toBe(true)
		expect(provider.currentAutocompletePreview).toBe("second line\nthird line")
	})

	test("should accept remaining lines on second Tab press", () => {
		// Setup
		provider.isShowingAutocompletePreview = true
		provider.firstLinePreview = "first line"
		provider.remainingLinesPreview = "second line\nthird line"
		provider.hasAcceptedFirstLine = true
		provider.currentAutocompletePreview = "second line\nthird line"

		// Execute the accept command
		provider.acceptAutocompletePreview()

		// Verify edit was called
		expect(provider.editor.edit).toHaveBeenCalled()

		// Get the edit callback that was passed to edit()
		const editCallback = provider.editor.edit.mock.calls[0][0]
		const mockEditBuilder = { insert: vi.fn() }

		// Execute the edit callback
		editCallback(mockEditBuilder)

		// Verify the remaining lines were inserted
		expect(mockEditBuilder.insert).toHaveBeenCalledWith(provider.editor.selection.active, "second line\nthird line")

		// Simulate the edit completion
		const mockPromise = provider.editor.edit.mock.results[0].value
		mockPromise._thenCallback()

		// Verify state after accepting remaining lines
		expect(provider.isShowingAutocompletePreview).toBe(false)
		expect(provider.currentAutocompletePreview).toBe("")
		expect(provider.firstLinePreview).toBe("")
		expect(provider.remainingLinesPreview).toBe("")
		expect(provider.hasAcceptedFirstLine).toBe(false)
	})
})
