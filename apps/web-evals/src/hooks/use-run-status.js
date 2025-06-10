"use strict"
var __assign =
	(this && this.__assign) ||
	function () {
		__assign =
			Object.assign ||
			function (t) {
				for (var s, i = 1, n = arguments.length; i < n; i++) {
					s = arguments[i]
					for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
				}
				return t
			}
		return __assign.apply(this, arguments)
	}
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
Object.defineProperty(exports, "__esModule", { value: true })
exports.useRunStatus = void 0
var react_1 = require("react")
var react_query_1 = require("@tanstack/react-query")
var types_1 = require("@roo-code/types")
var tasks_1 = require("@/lib/server/tasks")
var use_event_source_1 = require("@/hooks/use-event-source")
var useRunStatus = function (run) {
	var _a = (0, react_1.useState)(),
		tasksUpdatedAt = _a[0],
		setTasksUpdatedAt = _a[1]
	var _b = (0, react_1.useState)(),
		usageUpdatedAt = _b[0],
		setUsageUpdatedAt = _b[1]
	var tokenUsage = (0, react_1.useRef)(new Map())
	var startTimes = (0, react_1.useRef)(new Map())
	var tasks = (0, react_query_1.useQuery)({
		queryKey: ["run", run.id, tasksUpdatedAt],
		queryFn: function () {
			return __awaiter(void 0, void 0, void 0, function () {
				return __generator(this, function (_a) {
					return [2 /*return*/, (0, tasks_1.getTasks)(run.id)]
				})
			})
		},
		placeholderData: react_query_1.keepPreviousData,
		refetchInterval: 30000,
	}).data
	var url = "/api/runs/".concat(run.id, "/stream")
	var onMessage = (0, react_1.useCallback)(function (messageEvent) {
		var data
		try {
			data = JSON.parse(messageEvent.data)
		} catch (_) {
			console.log("invalid JSON: ".concat(messageEvent.data))
			return
		}
		var result = types_1.taskEventSchema.safeParse(data)
		if (!result.success) {
			console.log("unrecognized messageEvent.data: ".concat(messageEvent.data))
			return
		}
		var _a = result.data,
			eventName = _a.eventName,
			payload = _a.payload,
			taskId = _a.taskId
		if (!taskId) {
			console.log("no taskId: ".concat(messageEvent.data))
			return
		}
		switch (eventName) {
			case types_1.RooCodeEventName.TaskStarted:
				startTimes.current.set(taskId, Date.now())
				break
			case types_1.RooCodeEventName.TaskTokenUsageUpdated: {
				var startTime = startTimes.current.get(taskId)
				var duration = startTime ? Date.now() - startTime : undefined
				tokenUsage.current.set(taskId, __assign(__assign({}, payload[1]), { duration: duration }))
				setUsageUpdatedAt(Date.now())
				break
			}
			case types_1.RooCodeEventName.EvalPass:
			case types_1.RooCodeEventName.EvalFail:
				setTasksUpdatedAt(Date.now())
				break
		}
	}, [])
	var status = (0, use_event_source_1.useEventSource)({ url: url, onMessage: onMessage })
	return {
		status: status,
		tasks: tasks,
		tokenUsage: tokenUsage.current,
		usageUpdatedAt: usageUpdatedAt,
	}
}
exports.useRunStatus = useRunStatus
