"use client"
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
exports.NewRun = NewRun
var react_1 = require("react")
var navigation_1 = require("next/navigation")
var zod_1 = require("zod")
var react_hook_form_1 = require("react-hook-form")
var zod_2 = require("@hookform/resolvers/zod")
var fuzzysort_1 = require("fuzzysort")
var sonner_1 = require("sonner")
var lucide_react_1 = require("lucide-react")
var types_1 = require("@roo-code/types")
var runs_1 = require("@/lib/server/runs")
var schemas_1 = require("@/lib/schemas")
var utils_1 = require("@/lib/utils")
var use_open_router_models_1 = require("@/hooks/use-open-router-models")
var use_exercises_1 = require("@/hooks/use-exercises")
var ui_1 = require("@/components/ui")
var settings_diff_1 = require("./settings-diff")
function NewRun() {
	var _this = this
	var router = (0, navigation_1.useRouter)()
	var _a = (0, react_1.useState)("openrouter"),
		mode = _a[0],
		setMode = _a[1]
	var _b = (0, react_1.useState)(""),
		modelSearchValue = _b[0],
		setModelSearchValue = _b[1]
	var _c = (0, react_1.useState)(false),
		modelPopoverOpen = _c[0],
		setModelPopoverOpen = _c[1]
	var modelSearchResultsRef = (0, react_1.useRef)(new Map())
	var modelSearchValueRef = (0, react_1.useRef)("")
	var models = (0, use_open_router_models_1.useOpenRouterModels)()
	var exercises = (0, use_exercises_1.useExercises)()
	var form = (0, react_hook_form_1.useForm)({
		resolver: (0, zod_2.zodResolver)(schemas_1.createRunSchema),
		defaultValues: {
			model: schemas_1.MODEL_DEFAULT,
			description: "",
			suite: "full",
			exercises: [],
			settings: undefined,
			concurrency: schemas_1.CONCURRENCY_DEFAULT,
		},
	})
	var setValue = form.setValue,
		clearErrors = form.clearErrors,
		watch = form.watch,
		isSubmitting = form.formState.isSubmitting
	var _d = watch(["model", "suite", "settings", "concurrency"]),
		model = _d[0],
		suite = _d[1],
		settings = _d[2]
	var _e = (0, react_1.useState)(false),
		systemPromptDialogOpen = _e[0],
		setSystemPromptDialogOpen = _e[1]
	var _f = (0, react_1.useState)(""),
		systemPrompt = _f[0],
		setSystemPrompt = _f[1]
	var systemPromptRef = (0, react_1.useRef)(null)
	var onSubmit = (0, react_1.useCallback)(
		function (values) {
			return __awaiter(_this, void 0, void 0, function () {
				var id, e_1
				return __generator(this, function (_a) {
					switch (_a.label) {
						case 0:
							_a.trys.push([0, 2, , 3])
							if (mode === "openrouter") {
								values.settings = __assign(__assign({}, values.settings || {}), {
									openRouterModelId: model,
								})
							}
							return [
								4 /*yield*/,
								(0, runs_1.createRun)(__assign(__assign({}, values), { systemPrompt: systemPrompt })),
							]
						case 1:
							id = _a.sent().id
							router.push("/runs/".concat(id))
							return [3 /*break*/, 3]
						case 2:
							e_1 = _a.sent()
							sonner_1.toast.error(e_1 instanceof Error ? e_1.message : "An unknown error occurred.")
							return [3 /*break*/, 3]
						case 3:
							return [2 /*return*/]
					}
				})
			})
		},
		[mode, model, router, systemPrompt],
	)
	var onFilterModels = (0, react_1.useCallback)(
		function (value, search) {
			var _a
			if (modelSearchValueRef.current !== search) {
				modelSearchValueRef.current = search
				modelSearchResultsRef.current.clear()
				for (
					var _i = 0,
						_b = fuzzysort_1.default.go(search, models.data || [], {
							key: "name",
						});
					_i < _b.length;
					_i++
				) {
					var _c = _b[_i],
						id = _c.obj.id,
						score = _c.score
					modelSearchResultsRef.current.set(id, score)
				}
			}
			return (_a = modelSearchResultsRef.current.get(value)) !== null && _a !== void 0 ? _a : 0
		},
		[models.data],
	)
	var onSelectModel = (0, react_1.useCallback)(
		function (model) {
			setValue("model", model)
			setModelPopoverOpen(false)
		},
		[setValue],
	)
	var onImportSettings = (0, react_1.useCallback)(
		function (event) {
			return __awaiter(_this, void 0, void 0, function () {
				var file, _a, providerProfiles, globalSettings, _b, _c, _d, _e, providerSettings, e_2
				var _f, _g, _h
				return __generator(this, function (_j) {
					switch (_j.label) {
						case 0:
							file = (_f = event.target.files) === null || _f === void 0 ? void 0 : _f[0]
							if (!file) {
								return [2 /*return*/]
							}
							clearErrors("settings")
							_j.label = 1
						case 1:
							_j.trys.push([1, 3, , 4])
							_c = (_b = zod_1.z.object({
								providerProfiles: zod_1.z.object({
									currentApiConfigName: zod_1.z.string(),
									apiConfigs: zod_1.z.record(zod_1.z.string(), types_1.providerSettingsSchema),
								}),
								globalSettings: types_1.globalSettingsSchema,
							})).parse
							_e = (_d = JSON).parse
							return [4 /*yield*/, file.text()]
						case 2:
							;(_a = _c.apply(_b, [_e.apply(_d, [_j.sent()])])),
								(providerProfiles = _a.providerProfiles),
								(globalSettings = _a.globalSettings)
							providerSettings =
								(_g = providerProfiles.apiConfigs[providerProfiles.currentApiConfigName]) !== null &&
								_g !== void 0
									? _g
									: {}
							setValue(
								"model",
								(_h = (0, types_1.getModelId)(providerSettings)) !== null && _h !== void 0 ? _h : "",
							)
							setValue(
								"settings",
								__assign(
									__assign(__assign({}, types_1.EVALS_SETTINGS), providerSettings),
									globalSettings,
								),
							)
							setMode("settings")
							event.target.value = ""
							return [3 /*break*/, 4]
						case 3:
							e_2 = _j.sent()
							console.error(e_2)
							sonner_1.toast.error(e_2 instanceof Error ? e_2.message : "An unknown error occurred.")
							return [3 /*break*/, 4]
						case 4:
							return [2 /*return*/]
					}
				})
			})
		},
		[clearErrors, setValue],
	)
	return (
		<>
			<react_hook_form_1.FormProvider {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col justify-center divide-y divide-primary *:py-5">
					<div className="flex flex-row justify-between gap-4">
						{mode === "openrouter" && (
							<ui_1.FormField
								control={form.control}
								name="model"
								render={function () {
									var _a, _b, _c
									return (
										<ui_1.FormItem className="flex-1">
											<ui_1.Popover open={modelPopoverOpen} onOpenChange={setModelPopoverOpen}>
												<ui_1.PopoverTrigger asChild>
													<ui_1.Button
														variant="input"
														role="combobox"
														aria-expanded={modelPopoverOpen}
														className="flex items-center justify-between">
														<div>
															{((_b =
																(_a = models.data) === null || _a === void 0
																	? void 0
																	: _a.find(function (_a) {
																			var id = _a.id
																			return id === model
																		})) === null || _b === void 0
																? void 0
																: _b.name) ||
																model ||
																"Select OpenRouter Model"}
														</div>
														<lucide_react_1.ChevronsUpDown className="opacity-50" />
													</ui_1.Button>
												</ui_1.PopoverTrigger>
												<ui_1.PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
													<ui_1.Command filter={onFilterModels}>
														<ui_1.CommandInput
															placeholder="Search"
															value={modelSearchValue}
															onValueChange={setModelSearchValue}
															className="h-9"
														/>
														<ui_1.CommandList>
															<ui_1.CommandEmpty>No model found.</ui_1.CommandEmpty>
															<ui_1.CommandGroup>
																{(_c = models.data) === null || _c === void 0
																	? void 0
																	: _c.map(function (_a) {
																			var id = _a.id,
																				name = _a.name
																			return (
																				<ui_1.CommandItem
																					key={id}
																					value={id}
																					onSelect={onSelectModel}>
																					{name}
																					<lucide_react_1.Check
																						className={(0, utils_1.cn)(
																							"ml-auto text-accent group-data-[selected=true]:text-accent-foreground size-4",
																							id === model
																								? "opacity-100"
																								: "opacity-0",
																						)}
																					/>
																				</ui_1.CommandItem>
																			)
																		})}
															</ui_1.CommandGroup>
														</ui_1.CommandList>
													</ui_1.Command>
												</ui_1.PopoverContent>
											</ui_1.Popover>
											<ui_1.FormMessage />
										</ui_1.FormItem>
									)
								}}
							/>
						)}

						<ui_1.FormItem className="flex-1">
							<ui_1.Button
								type="button"
								variant="secondary"
								onClick={function () {
									var _a
									return (_a = document.getElementById("json-upload")) === null || _a === void 0
										? void 0
										: _a.click()
								}}>
								<lucide_react_1.SlidersHorizontal />
								Import Settings
							</ui_1.Button>
							<input
								id="json-upload"
								type="file"
								accept="application/json"
								className="hidden"
								onChange={onImportSettings}
							/>
							{settings && (
								<ui_1.ScrollArea className="max-h-64 border rounded-sm">
									<>
										<div className="flex items-center gap-1 p-2 border-b">
											<lucide_react_1.CircleCheck className="size-4 text-ring" />
											<div className="text-sm">
												Imported valid Kilo Code settings. Showing differences from default
												settings.
											</div>
										</div>
										<settings_diff_1.SettingsDiff
											defaultSettings={types_1.EVALS_SETTINGS}
											customSettings={settings}
										/>
									</>
								</ui_1.ScrollArea>
							)}
							<ui_1.FormMessage />
						</ui_1.FormItem>

						<ui_1.Button
							type="button"
							variant="secondary"
							onClick={function () {
								return setSystemPromptDialogOpen(true)
							}}>
							<lucide_react_1.Book />
							Override System Prompt
						</ui_1.Button>

						<ui_1.Dialog open={systemPromptDialogOpen} onOpenChange={setSystemPromptDialogOpen}>
							<ui_1.DialogContent>
								<ui_1.DialogTitle>Override System Prompt</ui_1.DialogTitle>
								<ui_1.Textarea
									ref={systemPromptRef}
									value={systemPrompt}
									onChange={function (e) {
										return setSystemPrompt(e.target.value)
									}}
								/>
								<ui_1.DialogFooter>
									<ui_1.Button
										onClick={function () {
											return setSystemPromptDialogOpen(false)
										}}>
										Done
									</ui_1.Button>
								</ui_1.DialogFooter>
							</ui_1.DialogContent>
						</ui_1.Dialog>
					</div>

					<ui_1.FormField
						control={form.control}
						name="suite"
						render={function () {
							var _a
							return (
								<ui_1.FormItem>
									<ui_1.FormLabel>Exercises</ui_1.FormLabel>
									<ui_1.Tabs
										defaultValue="full"
										onValueChange={function (value) {
											return setValue("suite", value)
										}}>
										<ui_1.TabsList>
											<ui_1.TabsTrigger value="full">All</ui_1.TabsTrigger>
											<ui_1.TabsTrigger value="partial">Some</ui_1.TabsTrigger>
										</ui_1.TabsList>
									</ui_1.Tabs>
									{suite === "partial" && (
										<ui_1.MultiSelect
											options={
												((_a = exercises.data) === null || _a === void 0
													? void 0
													: _a.map(function (path) {
															return { value: path, label: path }
														})) || []
											}
											onValueChange={function (value) {
												return setValue("exercises", value)
											}}
											placeholder="Select"
											variant="inverted"
											maxCount={4}
										/>
									)}
									<ui_1.FormMessage />
								</ui_1.FormItem>
							)
						}}
					/>

					<ui_1.FormField
						control={form.control}
						name="concurrency"
						render={function (_a) {
							var field = _a.field
							return (
								<ui_1.FormItem>
									<ui_1.FormLabel>Concurrency</ui_1.FormLabel>
									<ui_1.FormControl>
										<div className="flex flex-row items-center gap-2">
											<ui_1.Slider
												defaultValue={[field.value]}
												min={schemas_1.CONCURRENCY_MIN}
												max={schemas_1.CONCURRENCY_MAX}
												step={1}
												onValueChange={function (value) {
													return field.onChange(value[0])
												}}
											/>
											<div>{field.value}</div>
										</div>
									</ui_1.FormControl>
									<ui_1.FormMessage />
								</ui_1.FormItem>
							)
						}}
					/>

					<ui_1.FormField
						control={form.control}
						name="description"
						render={function (_a) {
							var field = _a.field
							return (
								<ui_1.FormItem>
									<ui_1.FormLabel>Description / Notes</ui_1.FormLabel>
									<ui_1.FormControl>
										<ui_1.Textarea placeholder="Optional" {...field} />
									</ui_1.FormControl>
									<ui_1.FormMessage />
								</ui_1.FormItem>
							)
						}}
					/>

					<div className="flex justify-end">
						<ui_1.Button size="lg" type="submit" disabled={isSubmitting}>
							<lucide_react_1.Rocket className="size-4" />
							Launch
						</ui_1.Button>
					</div>
				</form>
			</react_hook_form_1.FormProvider>

			<ui_1.Button
				variant="default"
				className="absolute top-4 right-12 size-12 rounded-full"
				onClick={function () {
					return router.push("/")
				}}>
				<lucide_react_1.X className="size-6" />
			</ui_1.Button>
		</>
	)
}
