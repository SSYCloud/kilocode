"use client"
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
exports.TabsTrigger = exports.TabsList = exports.TabsContent = exports.Tabs = void 0
var React = require("react")
var react_1 = require("react")
var TabsPrimitive = require("@radix-ui/react-tabs")
var utils_1 = require("@/lib/utils")
var Tabs = TabsPrimitive.Root
exports.Tabs = Tabs
var TabsList = React.forwardRef(function (_a, ref) {
	var className = _a.className,
		props = __rest(_a, ["className"])
	var _b = (0, react_1.useState)({
			left: 0,
			top: 0,
			width: 0,
			height: 0,
		}),
		indicatorStyle = _b[0],
		setIndicatorStyle = _b[1]
	var tabsListRef = (0, react_1.useRef)(null)
	var updateIndicator = React.useCallback(function () {
		if (!tabsListRef.current) {
			return
		}
		var activeTab = tabsListRef.current.querySelector('[data-state="active"]')
		if (!activeTab) {
			return
		}
		var activeRect = activeTab.getBoundingClientRect()
		var tabsRect = tabsListRef.current.getBoundingClientRect()
		requestAnimationFrame(function () {
			setIndicatorStyle({
				left: activeRect.left - tabsRect.left,
				top: activeRect.top - tabsRect.top,
				width: activeRect.width,
				height: activeRect.height,
			})
		})
	}, [])
	;(0, react_1.useEffect)(
		function () {
			var timeoutId = setTimeout(updateIndicator, 0)
			window.addEventListener("resize", updateIndicator)
			var observer = new MutationObserver(updateIndicator)
			if (tabsListRef.current) {
				observer.observe(tabsListRef.current, {
					attributes: true,
					childList: true,
					subtree: true,
				})
			}
			return function () {
				clearTimeout(timeoutId)
				window.removeEventListener("resize", updateIndicator)
				observer.disconnect()
			}
		},
		[updateIndicator],
	)
	return (
		<div className="relative" ref={tabsListRef}>
			<TabsPrimitive.List
				ref={ref}
				className={(0, utils_1.cn)(
					"relative inline-flex items-center justify-center rounded-sm bg-primary p-0.5 text-muted-foreground",
					className,
				)}
				{...props}
			/>
			<div
				className={(0, utils_1.cn)(
					"absolute rounded-sm transition-all duration-300 ease-in-out pointer-events-none",
					"bg-accent/5",
				)}
				style={indicatorStyle}
			/>
		</div>
	)
})
exports.TabsList = TabsList
TabsList.displayName = TabsPrimitive.List.displayName
var TabsTrigger = React.forwardRef(function (_a, ref) {
	var className = _a.className,
		props = __rest(_a, ["className"])
	return (
		<TabsPrimitive.Trigger
			ref={ref}
			className={(0, utils_1.cn)(
				"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 z-10",
				"data-[state=active]:text-accent data-[state=active]:font-medium cursor-pointer",
				className,
			)}
			{...props}
		/>
	)
})
exports.TabsTrigger = TabsTrigger
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName
var TabsContent = React.forwardRef(function (_a, ref) {
	var className = _a.className,
		props = __rest(_a, ["className"])
	return (
		<TabsPrimitive.Content
			ref={ref}
			className={(0, utils_1.cn)(
				"mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				className,
			)}
			{...props}
		/>
	)
})
exports.TabsContent = TabsContent
TabsContent.displayName = TabsPrimitive.Content.displayName
