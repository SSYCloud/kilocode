"use client"
"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.Run = Run
var react_1 = require("react")
var lucide_react_1 = require("lucide-react")
var formatters_1 = require("@/lib/formatters")
var use_run_status_1 = require("@/hooks/use-run-status")
var ui_1 = require("@/components/ui")
var task_status_1 = require("./task-status")
var connection_status_1 = require("./connection-status")
function Run(_a) {
	var run = _a.run
	var _b = (0, use_run_status_1.useRunStatus)(run),
		tasks = _b.tasks,
		status = _b.status,
		tokenUsage = _b.tokenUsage,
		usageUpdatedAt = _b.usageUpdatedAt
	var taskMetrics = (0, react_1.useMemo)(
		function () {
			var metrics = {}
			tasks === null || tasks === void 0
				? void 0
				: tasks.forEach(function (task) {
						var _a
						var usage = tokenUsage.get(task.id)
						if (task.finishedAt && task.taskMetrics) {
							metrics[task.id] = task.taskMetrics
						} else if (usage) {
							metrics[task.id] = {
								tokensIn: usage.totalTokensIn,
								tokensOut: usage.totalTokensOut,
								tokensContext: usage.contextTokens,
								duration: (_a = usage.duration) !== null && _a !== void 0 ? _a : 0,
								cost: usage.totalCost,
							}
						}
					})
			return metrics
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[tasks, tokenUsage, usageUpdatedAt],
	)
	return (
		<>
			<div>
				<div className="mb-2">
					<div>
						<div>{run.model}</div>
						{run.description && <div className="text-sm text-muted-foreground">{run.description}</div>}
					</div>
					{!run.taskMetricsId && <connection_status_1.ConnectionStatus status={status} runId={run.id} />}
				</div>
				{!tasks ? (
					<lucide_react_1.LoaderCircle className="size-4 animate-spin" />
				) : (
					<ui_1.Table className="border">
						<ui_1.TableHeader>
							<ui_1.TableRow>
								<ui_1.TableHead>Exercise</ui_1.TableHead>
								<ui_1.TableHead className="text-center">Tokens In / Out</ui_1.TableHead>
								<ui_1.TableHead>Context</ui_1.TableHead>
								<ui_1.TableHead>Duration</ui_1.TableHead>
								<ui_1.TableHead>Cost</ui_1.TableHead>
							</ui_1.TableRow>
						</ui_1.TableHeader>
						<ui_1.TableBody>
							{tasks.map(function (task) {
								return (
									<ui_1.TableRow key={task.id}>
										<ui_1.TableCell>
											<div className="flex items-center gap-2">
												<task_status_1.TaskStatus
													task={task}
													running={!!task.startedAt || !!tokenUsage.get(task.id)}
												/>
												<div>
													{task.language}/{task.exercise}
												</div>
											</div>
										</ui_1.TableCell>
										{taskMetrics[task.id] ? (
											<>
												<ui_1.TableCell className="font-mono text-xs">
													<div className="flex items-center justify-evenly">
														<div>
															{(0, formatters_1.formatTokens)(
																taskMetrics[task.id].tokensIn,
															)}
														</div>
														/
														<div>
															{(0, formatters_1.formatTokens)(
																taskMetrics[task.id].tokensOut,
															)}
														</div>
													</div>
												</ui_1.TableCell>
												<ui_1.TableCell className="font-mono text-xs">
													{(0, formatters_1.formatTokens)(taskMetrics[task.id].tokensContext)}
												</ui_1.TableCell>
												<ui_1.TableCell className="font-mono text-xs">
													{taskMetrics[task.id].duration
														? (0, formatters_1.formatDuration)(
																taskMetrics[task.id].duration,
															)
														: "-"}
												</ui_1.TableCell>
												<ui_1.TableCell className="font-mono text-xs">
													{(0, formatters_1.formatCurrency)(taskMetrics[task.id].cost)}
												</ui_1.TableCell>
											</>
										) : (
											<ui_1.TableCell colSpan={4} />
										)}
									</ui_1.TableRow>
								)
							})}
						</ui_1.TableBody>
					</ui_1.Table>
				)}
			</div>
		</>
	)
}
