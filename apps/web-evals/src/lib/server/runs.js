"use server"
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
exports.createRun = createRun
exports.deleteRun = deleteRun
var child_process_1 = require("child_process")
var fs_1 = require("fs")
var cache_1 = require("next/cache")
var p_map_1 = require("p-map")
var evals_1 = require("@roo-code/evals")
var exercises_1 = require("./exercises")
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createRun(_a) {
	return __awaiter(this, void 0, void 0, function () {
		var run,
			_i,
			exercises_2,
			path,
			_b,
			language,
			exercise,
			_loop_1,
			_c,
			exerciseLanguages_1,
			language,
			isRunningInDocker,
			dockerArgs,
			cliCommand,
			command,
			childProcess,
			logStream
		var suite = _a.suite,
			_d = _a.exercises,
			exercises = _d === void 0 ? [] : _d,
			systemPrompt = _a.systemPrompt,
			values = __rest(_a, ["suite", "exercises", "systemPrompt"])
		return __generator(this, function (_e) {
			switch (_e.label) {
				case 0:
					return [4 /*yield*/, (0, evals_1.createRun)(__assign(__assign({}, values), { socketPath: "" }))]
				case 1:
					run = _e.sent()
					if (!(suite === "partial")) return [3 /*break*/, 6]
					;(_i = 0), (exercises_2 = exercises)
					_e.label = 2
				case 2:
					if (!(_i < exercises_2.length)) return [3 /*break*/, 5]
					path = exercises_2[_i]
					;(_b = path.split("/")), (language = _b[0]), (exercise = _b[1])
					if (!language || !exercise) {
						throw new Error("Invalid exercise path: " + path)
					}
					return [
						4 /*yield*/,
						(0, evals_1.createTask)(
							__assign(__assign({}, values), { runId: run.id, language: language, exercise: exercise }),
						),
					]
				case 3:
					_e.sent()
					_e.label = 4
				case 4:
					_i++
					return [3 /*break*/, 2]
				case 5:
					return [3 /*break*/, 10]
				case 6:
					_loop_1 = function (language) {
						var exercises_3
						return __generator(this, function (_f) {
							switch (_f.label) {
								case 0:
									return [4 /*yield*/, (0, exercises_1.getExercisesForLanguage)(language)]
								case 1:
									exercises_3 = _f.sent()
									return [
										4 /*yield*/,
										(0, p_map_1.default)(
											exercises_3,
											function (exercise) {
												return (0, evals_1.createTask)(
													__assign(__assign({}, values), {
														runId: run.id,
														language: language,
														exercise: exercise,
													}),
												)
											},
											{
												concurrency: 10,
											},
										),
									]
								case 2:
									_f.sent()
									return [2 /*return*/]
							}
						})
					}
					;(_c = 0), (exerciseLanguages_1 = evals_1.exerciseLanguages)
					_e.label = 7
				case 7:
					if (!(_c < exerciseLanguages_1.length)) return [3 /*break*/, 10]
					language = exerciseLanguages_1[_c]
					return [5 /*yield**/, _loop_1(language)]
				case 8:
					_e.sent()
					_e.label = 9
				case 9:
					_c++
					return [3 /*break*/, 7]
				case 10:
					;(0, cache_1.revalidatePath)("/runs")
					try {
						isRunningInDocker = fs_1.default.existsSync("/.dockerenv")
						dockerArgs = [
							"--name evals-controller-".concat(run.id),
							"--rm",
							"--network evals_default",
							"-v /var/run/docker.sock:/var/run/docker.sock",
							"-e HOST_EXECUTION_METHOD=docker",
						]
						cliCommand = "pnpm --filter @roo-code/evals cli --runId ".concat(run.id)
						command = isRunningInDocker
							? "docker run "
									.concat(dockerArgs.join(" "), ' evals-runner sh -c "')
									.concat(cliCommand, '"')
							: cliCommand
						console.log("spawn ->", command)
						childProcess = (0, child_process_1.spawn)("sh", ["-c", command], {
							detached: true,
							stdio: ["ignore", "pipe", "pipe"],
						})
						logStream = fs_1.default.createWriteStream("/tmp/roo-code-evals.log", { flags: "a" })
						if (childProcess.stdout) {
							childProcess.stdout.pipe(logStream)
						}
						if (childProcess.stderr) {
							childProcess.stderr.pipe(logStream)
						}
						childProcess.unref()
					} catch (error) {
						console.error(error)
					}
					return [2 /*return*/, run]
			}
		})
	})
}
function deleteRun(runId) {
	return __awaiter(this, void 0, void 0, function () {
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					return [4 /*yield*/, (0, evals_1.deleteRun)(runId)]
				case 1:
					_a.sent()
					;(0, cache_1.revalidatePath)("/runs")
					return [2 /*return*/]
			}
		})
	})
}
