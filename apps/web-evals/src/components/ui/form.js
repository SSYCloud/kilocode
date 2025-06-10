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
exports.FormField = exports.Form = exports.useFormField = void 0
exports.FormItem = FormItem
exports.FormLabel = FormLabel
exports.FormControl = FormControl
exports.FormDescription = FormDescription
exports.FormMessage = FormMessage
var React = require("react")
var react_slot_1 = require("@radix-ui/react-slot")
var react_hook_form_1 = require("react-hook-form")
var utils_1 = require("@/lib/utils")
var label_1 = require("@/components/ui/label")
var Form = react_hook_form_1.FormProvider
exports.Form = Form
var FormFieldContext = React.createContext({})
var FormField = function (_a) {
	var props = __rest(_a, [])
	return (
		<FormFieldContext.Provider value={{ name: props.name }}>
			<react_hook_form_1.Controller {...props} />
		</FormFieldContext.Provider>
	)
}
exports.FormField = FormField
var useFormField = function () {
	var fieldContext = React.useContext(FormFieldContext)
	var itemContext = React.useContext(FormItemContext)
	var getFieldState = (0, react_hook_form_1.useFormContext)().getFieldState
	var formState = (0, react_hook_form_1.useFormState)({ name: fieldContext.name })
	var fieldState = getFieldState(fieldContext.name, formState)
	if (!fieldContext) {
		throw new Error("useFormField should be used within <FormField>")
	}
	var id = itemContext.id
	return __assign(
		{
			id: id,
			name: fieldContext.name,
			formItemId: "".concat(id, "-form-item"),
			formDescriptionId: "".concat(id, "-form-item-description"),
			formMessageId: "".concat(id, "-form-item-message"),
		},
		fieldState,
	)
}
exports.useFormField = useFormField
var FormItemContext = React.createContext({})
function FormItem(_a) {
	var className = _a.className,
		props = __rest(_a, ["className"])
	var id = React.useId()
	return (
		<FormItemContext.Provider value={{ id: id }}>
			<div data-slot="form-item" className={(0, utils_1.cn)("grid gap-2", className)} {...props} />
		</FormItemContext.Provider>
	)
}
function FormLabel(_a) {
	var className = _a.className,
		props = __rest(_a, ["className"])
	var _b = useFormField(),
		error = _b.error,
		formItemId = _b.formItemId
	return (
		<label_1.Label
			data-slot="form-label"
			data-error={!!error}
			className={(0, utils_1.cn)("data-[error=true]:text-destructive", className)}
			htmlFor={formItemId}
			{...props}
		/>
	)
}
function FormControl(_a) {
	var props = __rest(_a, [])
	var _b = useFormField(),
		error = _b.error,
		formItemId = _b.formItemId,
		formDescriptionId = _b.formDescriptionId,
		formMessageId = _b.formMessageId
	return (
		<react_slot_1.Slot
			data-slot="form-control"
			id={formItemId}
			aria-describedby={
				!error ? "".concat(formDescriptionId) : "".concat(formDescriptionId, " ").concat(formMessageId)
			}
			aria-invalid={!!error}
			{...props}
		/>
	)
}
function FormDescription(_a) {
	var className = _a.className,
		props = __rest(_a, ["className"])
	var formDescriptionId = useFormField().formDescriptionId
	return (
		<p
			data-slot="form-description"
			id={formDescriptionId}
			className={(0, utils_1.cn)("text-muted-foreground text-sm", className)}
			{...props}
		/>
	)
}
function FormMessage(_a) {
	var _b
	var className = _a.className,
		props = __rest(_a, ["className"])
	var _c = useFormField(),
		error = _c.error,
		formMessageId = _c.formMessageId
	var body = error
		? String((_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : "")
		: props.children
	if (!body) {
		return null
	}
	return (
		<p
			data-slot="form-message"
			id={formMessageId}
			className={(0, utils_1.cn)("text-destructive text-sm", className)}
			{...props}>
			{body}
		</p>
	)
}
