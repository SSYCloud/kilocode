import * as assert from "assert"
import * as vscode from "vscode"

suite("Kilo SSY Extension", () => {
	test("Commands should be registered", async () => {
		const expectedCommands = [
			"kilo-ssy.plusButtonClicked",
			"kilo-ssy.historyButtonClicked",
			"kilo-ssy.popoutButtonClicked",
			"kilo-ssy.settingsButtonClicked",
			"kilo-ssy.openInNewTab",
			"kilo-ssy.explainCode",
			"kilo-ssy.fixCode",
			"kilo-ssy.improveCode",
		]

		const commands = await vscode.commands.getCommands(true)

		for (const cmd of expectedCommands) {
			assert.ok(commands.includes(cmd), `Command ${cmd} should be registered`)
		}
	})
})
