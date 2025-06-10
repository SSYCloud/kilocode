"use client"
"use strict"
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value)
					})
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value))
				} catch (e) {
					reject(e)
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value))
				} catch (e) {
					reject(e)
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next())
		})
	}
var __generator =
	(this && this.__generator) ||
	function (thisArg, body) {
		var _ = {
				label: 0,
				sent: function () {
					if (t[0] & 1) throw t[1]
					return t[1]
				},
				trys: [],
				ops: [],
			},
			f,
			y,
			t,
			g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype)
		return (
			(g.next = verb(0)),
			(g["throw"] = verb(1)),
			(g["return"] = verb(2)),
			typeof Symbol === "function" &&
				(g[Symbol.iterator] = function () {
					return this
				}),
			g
		)
		function verb(n) {
			return function (v) {
				return step([n, v])
			}
		}
		function step(op) {
			if (f) throw new TypeError("Generator is already executing.")
			while ((g && ((g = 0), op[0] && (_ = 0)), _))
				try {
					if (
						((f = 1),
						y &&
							(t =
								op[0] & 2
									? y["return"]
									: op[0]
										? y["throw"] || ((t = y["return"]) && t.call(y), 0)
										: y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t
					if (((y = 0), t)) op = [op[0] & 2, t.value]
					switch (op[0]) {
						case 0:
						case 1:
							t = op
							break
						case 4:
							_.label++
							return { value: op[1], done: false }
						case 5:
							_.label++
							y = op[1]
							op = [0]
							continue
						case 7:
							op = _.ops.pop()
							_.trys.pop()
							continue
						default:
							if (
								!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
								(op[0] === 6 || op[0] === 2)
							) {
								_ = 0
								continue
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1]
								break
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1]
								t = op
								break
							}
							if (t && _.label < t[2]) {
								_.label = t[2]
								_.ops.push(op)
								break
							}
							if (t[2]) _.ops.pop()
							_.trys.pop()
							continue
					}
					op = body.call(thisArg, _)
				} catch (e) {
					op = [6, e]
					y = 0
				} finally {
					f = t = 0
				}
			if (op[0] & 5) throw op[1]
			return { value: op[0] ? op[1] : void 0, done: true }
		}
	}
var __rest =
	(this && this.__rest) ||
	function (s, e) {
		var t = {}
		for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p]
		if (s != null && typeof Object.getOwnPropertySymbols === "function")
			for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
				if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]]
			}
		return t
	}
Object.defineProperty(exports, "__esModule", { value: true })
exports.Home = Home
var react_1 = require("react")
var navigation_1 = require("next/navigation")
var link_1 = require("next/link")
var lucide_react_1 = require("lucide-react")
var runs_1 = require("@/lib/server/runs")
var formatters_1 = require("@/lib/formatters")
var ui_1 = require("@/components/ui")
function Home(_a) {
	var _this = this
	var runs = _a.runs
	var router = (0, navigation_1.useRouter)()
	var _b = (0, react_1.useState)(),
		deleteRunId = _b[0],
		setDeleteRunId = _b[1]
	var continueRef = (0, react_1.useRef)(null)
	var onConfirmDelete = (0, react_1.useCallback)(
		function () {
			return __awaiter(_this, void 0, void 0, function () {
				var error_1
				return __generator(this, function (_a) {
					switch (_a.label) {
						case 0:
							if (!deleteRunId) {
								return [2 /*return*/]
							}
							_a.label = 1
						case 1:
							_a.trys.push([1, 3, , 4])
							return [4 /*yield*/, (0, runs_1.deleteRun)(deleteRunId)]
						case 2:
							_a.sent()
							setDeleteRunId(undefined)
							return [3 /*break*/, 4]
						case 3:
							error_1 = _a.sent()
							console.error(error_1)
							return [3 /*break*/, 4]
						case 4:
							return [2 /*return*/]
					}
				})
			})
		},
		[deleteRunId],
	)
	return (
		<>
			<ui_1.Table className="border border-t-0">
				<ui_1.TableHeader>
					<ui_1.TableRow>
						<ui_1.TableHead>Model</ui_1.TableHead>
						<ui_1.TableHead>Passed</ui_1.TableHead>
						<ui_1.TableHead>Failed</ui_1.TableHead>
						<ui_1.TableHead>% Correct</ui_1.TableHead>
						<ui_1.TableHead>Tokens In / Out</ui_1.TableHead>
						<ui_1.TableHead>Diff Edits</ui_1.TableHead>
						<ui_1.TableHead>Cost</ui_1.TableHead>
						<ui_1.TableHead>Duration</ui_1.TableHead>
						<ui_1.TableHead />
					</ui_1.TableRow>
				</ui_1.TableHeader>
				<ui_1.TableBody>
					{runs.length ? (
						runs.map(function (_a) {
							var _b
							var taskMetrics = _a.taskMetrics,
								run = __rest(_a, ["taskMetrics"])
							return (
								<ui_1.TableRow key={run.id}>
									<ui_1.TableCell>{run.model}</ui_1.TableCell>
									<ui_1.TableCell>{run.passed}</ui_1.TableCell>
									<ui_1.TableCell>{run.failed}</ui_1.TableCell>
									<ui_1.TableCell>
										{run.passed + run.failed > 0 && (
											<span>{((run.passed / (run.passed + run.failed)) * 100).toFixed(1)}%</span>
										)}
									</ui_1.TableCell>
									<ui_1.TableCell>
										{taskMetrics && (
											<div className="flex items-center gap-1.5">
												<div>{(0, formatters_1.formatTokens)(taskMetrics.tokensIn)}</div>/
												<div>{(0, formatters_1.formatTokens)(taskMetrics.tokensOut)}</div>
											</div>
										)}
									</ui_1.TableCell>
									<ui_1.TableCell>
										{((_b =
											taskMetrics === null || taskMetrics === void 0
												? void 0
												: taskMetrics.toolUsage) === null || _b === void 0
											? void 0
											: _b.apply_diff) && (
											<div className="flex flex-row items-center gap-1.5">
												<div>{taskMetrics.toolUsage.apply_diff.attempts}</div>
												<div>/</div>
												<div>
													{(0, formatters_1.formatToolUsageSuccessRate)(
														taskMetrics.toolUsage.apply_diff,
													)}
												</div>
											</div>
										)}
									</ui_1.TableCell>
									<ui_1.TableCell>
										{taskMetrics && (0, formatters_1.formatCurrency)(taskMetrics.cost)}
									</ui_1.TableCell>
									<ui_1.TableCell>
										{taskMetrics && (0, formatters_1.formatDuration)(taskMetrics.duration)}
									</ui_1.TableCell>
									<ui_1.TableCell>
										<ui_1.DropdownMenu>
											<ui_1.Button variant="ghost" size="icon" asChild>
												<ui_1.DropdownMenuTrigger>
													<lucide_react_1.Ellipsis />
												</ui_1.DropdownMenuTrigger>
											</ui_1.Button>
											<ui_1.DropdownMenuContent align="end">
												<ui_1.DropdownMenuItem asChild>
													<link_1.default href={"/runs/".concat(run.id)}>
														View Tasks
													</link_1.default>
												</ui_1.DropdownMenuItem>
												<ui_1.DropdownMenuItem
													onClick={function () {
														setDeleteRunId(run.id)
														setTimeout(function () {
															var _a
															return (_a = continueRef.current) === null || _a === void 0
																? void 0
																: _a.focus()
														}, 0)
													}}>
													Delete
												</ui_1.DropdownMenuItem>
											</ui_1.DropdownMenuContent>
										</ui_1.DropdownMenu>
									</ui_1.TableCell>
								</ui_1.TableRow>
							)
						})
					) : (
						<ui_1.TableRow>
							<ui_1.TableCell colSpan={8} className="text-center">
								No eval runs yet.
								<ui_1.Button
									variant="link"
									onClick={function () {
										return router.push("/runs/new")
									}}>
									Launch
								</ui_1.Button>
								one now.
							</ui_1.TableCell>
						</ui_1.TableRow>
					)}
				</ui_1.TableBody>
			</ui_1.Table>
			<ui_1.Button
				variant="default"
				className="absolute top-4 right-12 size-12 rounded-full"
				onClick={function () {
					return router.push("/runs/new")
				}}>
				<lucide_react_1.Rocket className="size-6" />
			</ui_1.Button>
			<ui_1.AlertDialog
				open={!!deleteRunId}
				onOpenChange={function () {
					return setDeleteRunId(undefined)
				}}>
				<ui_1.AlertDialogContent>
					<ui_1.AlertDialogHeader>
						<ui_1.AlertDialogTitle>Are you sure?</ui_1.AlertDialogTitle>
						<ui_1.AlertDialogDescription>This action cannot be undone.</ui_1.AlertDialogDescription>
					</ui_1.AlertDialogHeader>
					<ui_1.AlertDialogFooter>
						<ui_1.AlertDialogCancel>Cancel</ui_1.AlertDialogCancel>
						<ui_1.AlertDialogAction ref={continueRef} onClick={onConfirmDelete}>
							Continue
						</ui_1.AlertDialogAction>
					</ui_1.AlertDialogFooter>
				</ui_1.AlertDialogContent>
			</ui_1.AlertDialog>
		</>
	)
}
