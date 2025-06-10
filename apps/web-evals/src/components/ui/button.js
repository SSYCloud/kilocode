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
Object.defineProperty(exports, "__esModule", { value: true })
exports.buttonVariants = void 0
exports.Button = Button
var React = require("react")
var react_slot_1 = require("@radix-ui/react-slot")
var class_variance_authority_1 = require("class-variance-authority")
var utils_1 = require("@/lib/utils")
var buttonVariants = (0, class_variance_authority_1.cva)(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:opacity-80 active:scale-95 cursor-pointer",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground shadow-xs [&_svg]:text-accent",
				destructive:
					"bg-destructive text-white shadow-xs focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
				outline:
					"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input",
				secondary: "bg-secondary text-secondary-foreground shadow-xs [&_svg]:text-ring",
				ghost: "hover:bg-primary hover:text-primary-foreground",
				link: "text-accent underline-offset-4 hover:underline h-4! px-1! rounded-none",
				input: "bg-input text-input-foreground active:scale-100 shadow-xs",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5 text-sm",
				lg: "h-10 px-6 has-[>svg]:px-4 text-lg",
				icon: "size-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
)
exports.buttonVariants = buttonVariants
function Button(_a) {
	var className = _a.className,
		variant = _a.variant,
		size = _a.size,
		_b = _a.asChild,
		asChild = _b === void 0 ? false : _b,
		props = __rest(_a, ["className", "variant", "size", "asChild"])
	var Comp = asChild ? react_slot_1.Slot : "button"
	return (
		<Comp
			data-slot="button"
			className={(0, utils_1.cn)(buttonVariants({ variant: variant, size: size, className: className }))}
			{...props}
		/>
	)
}
