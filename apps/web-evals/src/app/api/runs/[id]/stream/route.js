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
Object.defineProperty(exports, "__esModule", { value: true })
exports.dynamic = void 0
exports.GET = GET
var types_1 = require("@roo-code/types")
var evals_1 = require("@roo-code/evals")
var sse_stream_1 = require("@/lib/server/sse-stream")
var redis_1 = require("@/lib/server/redis")
exports.dynamic = "force-dynamic"
function GET(request_1, _a) {
	return __awaiter(this, arguments, void 0, function (request, _b) {
		var id, requestId, stream, run, redis, isStreamClosed, channelName, onMessage, disconnect
		var _this = this
		var params = _b.params
		return __generator(this, function (_c) {
			switch (_c.label) {
				case 0:
					return [4 /*yield*/, params]
				case 1:
					id = _c.sent().id
					requestId = crypto.randomUUID()
					stream = new sse_stream_1.SSEStream()
					return [4 /*yield*/, (0, evals_1.findRun)(Number(id))]
				case 2:
					run = _c.sent()
					return [4 /*yield*/, (0, redis_1.redisClient)()]
				case 3:
					redis = _c.sent()
					isStreamClosed = false
					channelName = "evals:".concat(run.id)
					onMessage = function (data) {
						return __awaiter(_this, void 0, void 0, function () {
							var taskEvent, writeSuccess, _error_1
							return __generator(this, function (_a) {
								switch (_a.label) {
									case 0:
										if (isStreamClosed || stream.isClosed) {
											return [2 /*return*/]
										}
										_a.label = 1
									case 1:
										_a.trys.push([1, 5, , 6])
										taskEvent = types_1.taskEventSchema.parse(JSON.parse(data))
										return [4 /*yield*/, stream.write(JSON.stringify(taskEvent))]
									case 2:
										writeSuccess = _a.sent()
										if (!!writeSuccess) return [3 /*break*/, 4]
										return [4 /*yield*/, disconnect()]
									case 3:
										_a.sent()
										_a.label = 4
									case 4:
										return [3 /*break*/, 6]
									case 5:
										_error_1 = _a.sent()
										console.error("[stream#".concat(requestId, "] invalid task event:"), data)
										return [3 /*break*/, 6]
									case 6:
										return [2 /*return*/]
								}
							})
						})
					}
					disconnect = function () {
						return __awaiter(_this, void 0, void 0, function () {
							var error_1, error_2
							return __generator(this, function (_a) {
								switch (_a.label) {
									case 0:
										if (isStreamClosed) {
											return [2 /*return*/]
										}
										isStreamClosed = true
										_a.label = 1
									case 1:
										_a.trys.push([1, 3, , 4])
										return [4 /*yield*/, redis.unsubscribe(channelName)]
									case 2:
										_a.sent()
										console.log(
											"[stream#".concat(requestId, "] unsubscribed from ").concat(channelName),
										)
										return [3 /*break*/, 4]
									case 3:
										error_1 = _a.sent()
										console.error("[stream#".concat(requestId, "] error unsubscribing:"), error_1)
										return [3 /*break*/, 4]
									case 4:
										_a.trys.push([4, 6, , 7])
										return [4 /*yield*/, stream.close()]
									case 5:
										_a.sent()
										return [3 /*break*/, 7]
									case 6:
										error_2 = _a.sent()
										console.error("[stream#".concat(requestId, "] error closing stream:"), error_2)
										return [3 /*break*/, 7]
									case 7:
										return [2 /*return*/]
								}
							})
						})
					}
					return [4 /*yield*/, redis.subscribe(channelName, onMessage)]
				case 4:
					_c.sent()
					request.signal.addEventListener("abort", function () {
						console.log("[stream#".concat(requestId, "] abort"))
						disconnect().catch(function (error) {
							console.error("[stream#".concat(requestId, "] cleanup error:"), error)
						})
					})
					return [2 /*return*/, stream.getResponse()]
			}
		})
	})
}
