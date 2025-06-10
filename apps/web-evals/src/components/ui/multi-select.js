"use strict"
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
var __spreadArray =
	(this && this.__spreadArray) ||
	function (to, from, pack) {
		if (pack || arguments.length === 2)
			for (var i = 0, l = from.length, ar; i < l; i++) {
				if (ar || !(i in from)) {
					if (!ar) ar = Array.prototype.slice.call(from, 0, i)
					ar[i] = from[i]
				}
			}
		return to.concat(ar || Array.prototype.slice.call(from))
	}
Object.defineProperty(exports, "__esModule", { value: true })
exports.MultiSelect = void 0
var React = require("react")
var class_variance_authority_1 = require("class-variance-authority")
var fuzzysort_1 = require("fuzzysort")
var lucide_react_1 = require("lucide-react")
var utils_1 = require("@/lib/utils")
var badge_1 = require("./badge")
var popover_1 = require("./popover")
var command_1 = require("./command")
/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
var multiSelectVariants = (0, class_variance_authority_1.cva)("px-2 py-1", {
	variants: {
		variant: {
			default: "border-foreground/10 text-foreground bg-card hover:bg-card/80",
			secondary: "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
			destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
			inverted: "bg-background",
		},
	},
	defaultVariants: {
		variant: "default",
	},
})
exports.MultiSelect = React.forwardRef(function (_a, ref) {
	var options = _a.options,
		onValueChange = _a.onValueChange,
		variant = _a.variant,
		_b = _a.defaultValue,
		defaultValue = _b === void 0 ? [] : _b,
		_c = _a.placeholder,
		placeholder = _c === void 0 ? "Select options" : _c,
		_d = _a.maxCount,
		maxCount = _d === void 0 ? 3 : _d,
		_e = _a.modalPopover,
		modalPopover = _e === void 0 ? false : _e,
		className = _a.className,
		props = __rest(_a, [
			"options",
			"onValueChange",
			"variant",
			"defaultValue",
			"placeholder",
			"maxCount",
			"modalPopover",
			"className",
		])
	var _f = React.useState(defaultValue),
		selectedValues = _f[0],
		setSelectedValues = _f[1]
	var _g = React.useState(false),
		isPopoverOpen = _g[0],
		setIsPopoverOpen = _g[1]
	var handleInputKeyDown = function (event) {
		if (event.key === "Enter") {
			setIsPopoverOpen(true)
		} else if (event.key === "Backspace" && !event.currentTarget.value) {
			var newSelectedValues = __spreadArray([], selectedValues, true)
			newSelectedValues.pop()
			setSelectedValues(newSelectedValues)
			onValueChange(newSelectedValues)
		}
	}
	var toggleOption = function (option) {
		var newSelectedValues = selectedValues.includes(option)
			? selectedValues.filter(function (value) {
					return value !== option
				})
			: __spreadArray(__spreadArray([], selectedValues, true), [option], false)
		setSelectedValues(newSelectedValues)
		onValueChange(newSelectedValues)
	}
	var handleTogglePopover = function () {
		setIsPopoverOpen(function (prev) {
			return !prev
		})
	}
	var clearExtraOptions = function () {
		var newSelectedValues = selectedValues.slice(0, maxCount)
		setSelectedValues(newSelectedValues)
		onValueChange(newSelectedValues)
	}
	var searchResultsRef = React.useRef(new Map())
	var searchValueRef = React.useRef("")
	var onSelectAll = function () {
		var values = Array.from(searchResultsRef.current.keys())
		if (selectedValues.length === values.length && selectedValues.sort().join(",") === values.sort().join(",")) {
			setSelectedValues([])
			onValueChange([])
			return
		}
		setSelectedValues(values)
		onValueChange(values)
	}
	var onFilter = React.useCallback(
		function (value, search) {
			var _a
			if (searchValueRef.current !== search) {
				searchValueRef.current = search
				searchResultsRef.current.clear()
				for (
					var _i = 0,
						_b = fuzzysort_1.default.go(search, options, {
							key: "label",
						});
					_i < _b.length;
					_i++
				) {
					var _c = _b[_i],
						value_1 = _c.obj.value,
						score = _c.score
					searchResultsRef.current.set(value_1, score)
				}
			}
			if (value === "all") {
				return searchResultsRef.current.size > 1 ? 0.01 : 0
			}
			return (_a = searchResultsRef.current.get(value)) !== null && _a !== void 0 ? _a : 0
		},
		[options],
	)
	return (
		<popover_1.Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
			<popover_1.PopoverTrigger asChild>
				<div
					ref={ref}
					{...props}
					onClick={handleTogglePopover}
					className={(0, utils_1.cn)(
						"flex w-full rounded-sm min-h-9 h-auto items-center justify-between [&_svg]:pointer-events-auto",
						"font-medium border border-input bg-input hover:opacity-80 cursor-pointer",
						className,
					)}>
					{selectedValues.length > 0 ? (
						<div className="flex justify-between items-center w-full">
							<div className="flex flex-wrap items-center gap-1 p-1">
								{selectedValues.slice(0, maxCount).map(function (value) {
									var _a
									return (
										<badge_1.Badge
											key={value}
											className={(0, utils_1.cn)(multiSelectVariants({ variant: variant }))}>
											<div className="flex items-center gap-1.5">
												<div>
													{(_a = options.find(function (o) {
														return o.value === value
													})) === null || _a === void 0
														? void 0
														: _a.label}
												</div>
												<div
													onClick={function (event) {
														event.stopPropagation()
														toggleOption(value)
													}}
													className="cursor-pointer">
													<lucide_react_1.X className="size-4 rounded-full p-0.5 bg-accent/5" />
												</div>
											</div>
										</badge_1.Badge>
									)
								})}
								{selectedValues.length > maxCount && (
									<badge_1.Badge
										className={(0, utils_1.cn)(
											"text-ring",
											multiSelectVariants({ variant: variant }),
										)}>
										<div className="flex items-center gap-1.5">
											<div>{"+ ".concat(selectedValues.length - maxCount, " more")}</div>
											<div
												onClick={function (event) {
													event.stopPropagation()
													clearExtraOptions()
												}}
												className="cursor-pointer">
												<lucide_react_1.X className="size-4 rounded-full p-0.5 bg-ring/5" />
											</div>
										</div>
									</badge_1.Badge>
								)}
							</div>
						</div>
					) : (
						<div className="flex items-center justify-between w-full mx-auto">
							<span className="text-muted-foreground mx-3">{placeholder}</span>
							<lucide_react_1.ChevronsUpDown className="opacity-50 size-4 mx-2" />
						</div>
					)}
				</div>
			</popover_1.PopoverTrigger>
			<popover_1.PopoverContent
				className="p-0 w-[var(--radix-popover-trigger-width)]"
				align="start"
				onEscapeKeyDown={function () {
					return setIsPopoverOpen(false)
				}}>
				<command_1.Command filter={onFilter}>
					<command_1.CommandInput placeholder="Search" onKeyDown={handleInputKeyDown} />
					<command_1.CommandList>
						<command_1.CommandEmpty>No results found.</command_1.CommandEmpty>
						<command_1.CommandGroup>
							{options.map(function (option) {
								return (
									<command_1.CommandItem
										key={option.value}
										value={option.value}
										onSelect={function () {
											return toggleOption(option.value)
										}}
										className="flex items-center justify-between">
										<span>{option.label}</span>
										<lucide_react_1.Check
											className={(0, utils_1.cn)(
												"text-accent group-data-[selected=true]:text-accent-foreground size-4",
												{ "opacity-0": !selectedValues.includes(option.value) },
											)}
										/>
									</command_1.CommandItem>
								)
							})}
							<command_1.CommandItem
								key="all"
								value="all"
								onSelect={onSelectAll}
								className="flex items-center justify-between">
								<span>Select All</span>
							</command_1.CommandItem>
						</command_1.CommandGroup>
					</command_1.CommandList>
				</command_1.Command>
			</popover_1.PopoverContent>
		</popover_1.Popover>
	)
})
exports.MultiSelect.displayName = "MultiSelect"
