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
exports.ROO_CODE_SETTINGS_KEYS = void 0
exports.SettingsDiff = SettingsDiff
exports.SettingDiff = SettingDiff
var react_1 = require("react")
var types_1 = require("@roo-code/types")
var utils_1 = require("@/lib/utils")
exports.ROO_CODE_SETTINGS_KEYS = __spreadArray(
	__spreadArray([], types_1.GLOBAL_SETTINGS_KEYS, true),
	types_1.PROVIDER_SETTINGS_KEYS,
	true,
)
function SettingsDiff(_a) {
	var _b = _a.customSettings,
		customExperiments = _b.experiments,
		customSettings = __rest(_b, ["experiments"]),
		_c = _a.defaultSettings,
		defaultExperiments = _c.experiments,
		defaultSettings = __rest(_c, ["experiments"]),
		className = _a.className,
		props = __rest(_a, ["customSettings", "defaultSettings", "className"])
	var defaults = __assign(__assign({}, defaultSettings), defaultExperiments)
	var custom = __assign(__assign({}, customSettings), customExperiments)
	return (
		<div className={(0, utils_1.cn)("grid grid-cols-3 gap-2 text-sm p-2", className)} {...props}>
			<div className="font-medium text-muted-foreground">Setting</div>
			<div className="font-medium text-muted-foreground">Default</div>
			<div className="font-medium text-muted-foreground">Custom</div>
			{exports.ROO_CODE_SETTINGS_KEYS.map(function (key) {
				var defaultValue = defaults[key]
				var customValue = custom[key]
				var isDefault = JSON.stringify(defaultValue) === JSON.stringify(customValue)
				return isDefault ? null : (
					<SettingDiff
						key={key}
						name={key}
						defaultValue={JSON.stringify(defaultValue, null, 2)}
						customValue={JSON.stringify(customValue, null, 2)}
					/>
				)
			})}
		</div>
	)
}
function SettingDiff(_a) {
	var name = _a.name,
		defaultValue = _a.defaultValue,
		customValue = _a.customValue,
		props = __rest(_a, ["name", "defaultValue", "customValue"])
	return (
		<react_1.Fragment {...props}>
			<div className="overflow-hidden font-mono" title={name}>
				{name}
			</div>
			<pre className="overflow-hidden inline text-rose-500 line-through" title={defaultValue}>
				{defaultValue}
			</pre>
			<pre className="overflow-hidden inline text-teal-500" title={customValue}>
				{customValue}
			</pre>
		</react_1.Fragment>
	)
}
