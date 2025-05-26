import path from "path"
import * as vscode from "vscode"
import { ClineRulesToggles } from "../../../shared/cline-rules"
import { ContextProxy } from "../../config/ContextProxy"
import { GlobalFileNames } from "../../../shared/globalFileNames"
import { synchronizeRuleToggles } from "./rule-helpers"

/**
 * Refresh the workflow toggles
 */
export async function refreshWorkflowToggles(
	context: vscode.ExtensionContext,
	workingDirectory: string,
): Promise<ClineRulesToggles> {
	const proxy = new ContextProxy(context)

	const workflowRulesToggles =
		((await proxy.getWorkspaceState(context, "workflowToggles")) as ClineRulesToggles) || {}
	const workflowsDirPath = path.resolve(workingDirectory, GlobalFileNames.workflows)
	const updatedWorkflowToggles = await synchronizeRuleToggles(workflowsDirPath, workflowRulesToggles)
	await proxy.updateWorkspaceState(context, "workflowToggles", updatedWorkflowToggles)

	return updatedWorkflowToggles
}
