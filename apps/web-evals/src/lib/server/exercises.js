"use server"
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
exports.getExercisesForLanguage = exports.getExercises = exports.listDirectories = void 0
var fs = require("fs/promises")
var path = require("path")
var url_1 = require("url")
var evals_1 = require("@roo-code/evals")
var __dirname = path.dirname((0, url_1.fileURLToPath)(import.meta.url))
var listDirectories = function (relativePath) {
	return __awaiter(void 0, void 0, void 0, function () {
		var targetPath, entries, error_1
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					_a.trys.push([0, 2, , 3])
					targetPath = path.resolve(__dirname, relativePath)
					return [4 /*yield*/, fs.readdir(targetPath, { withFileTypes: true })]
				case 1:
					entries = _a.sent()
					return [
						2 /*return*/,
						entries
							.filter(function (entry) {
								return entry.isDirectory() && !entry.name.startsWith(".")
							})
							.map(function (entry) {
								return entry.name
							}),
					]
				case 2:
					error_1 = _a.sent()
					console.error("Error listing directories at ".concat(relativePath, ":"), error_1)
					return [2 /*return*/, []]
				case 3:
					return [2 /*return*/]
			}
		})
	})
}
exports.listDirectories = listDirectories
// __dirname = <repo>/evals/apps/web/src/lib/server
var EXERCISES_BASE_PATH = path.resolve(__dirname, "../../../../../../evals")
var getExercises = function () {
	return __awaiter(void 0, void 0, void 0, function () {
		var result
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					return [
						4 /*yield*/,
						Promise.all(
							evals_1.exerciseLanguages.map(function (language) {
								return __awaiter(void 0, void 0, void 0, function () {
									var languagePath, exercises
									return __generator(this, function (_a) {
										switch (_a.label) {
											case 0:
												languagePath = path.join(EXERCISES_BASE_PATH, language)
												return [4 /*yield*/, (0, exports.listDirectories)(languagePath)]
											case 1:
												exercises = _a.sent()
												return [
													2 /*return*/,
													exercises.map(function (exercise) {
														return "".concat(language, "/").concat(exercise)
													}),
												]
										}
									})
								})
							}),
						),
					]
				case 1:
					result = _a.sent()
					return [2 /*return*/, result.flat()]
			}
		})
	})
}
exports.getExercises = getExercises
var getExercisesForLanguage = function (language) {
	return __awaiter(void 0, void 0, void 0, function () {
		return __generator(this, function (_a) {
			return [2 /*return*/, (0, exports.listDirectories)(path.join(EXERCISES_BASE_PATH, language))]
		})
	})
}
exports.getExercisesForLanguage = getExercisesForLanguage
