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
exports.HoppingLogo = exports.Logo = void 0
var react_1 = require("react")
var navigation_1 = require("next/navigation")
var react_use_1 = require("react-use")
var utils_1 = require("@/lib/utils")
var Logo = function (_a) {
	var _b = _a.width,
		width = _b === void 0 ? 50 : _b,
		_c = _a.height,
		height = _c === void 0 ? 32 : _c,
		_d = _a.fill,
		fill = _d === void 0 ? "#fff" : _d,
		className = _a.className,
		props = __rest(_a, ["width", "height", "fill", "className"])
	var router = (0, navigation_1.useRouter)()
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			viewBox="90 12 100 64"
			onClick={function () {
				return router.push("/")
			}}
			className={(0, utils_1.cn)("logo cursor-pointer", className)}
			{...props}>
			<path
				d="M171.633,15.8336l-1.7284,6.2499c-.0915.3309-.4369.5221-.7659.4239l-28.9937-8.6507c-.1928-.0575-.4016-.0167-.5586.1092l-28.7143,23.0269c-.0838.0672-.1839.1112-.2901.1276l-17.0849,2.6329c-.3163.0488-.5419.3327-.5178.6519l.0742.9817c.0237.3136.2809.5583.5953.5664l19.8448.513.2263.0063,14.6634-7.8328c.2053-.1097.455-.0936.6445.0415l10.3884,7.4053c.1629.1161.2589.3045.2571.5045l-.0876,9.826c-.0011.1272.0373.2515.11.3559l14.6133,20.9682c.1146.1644.3024.2624.5028.2624h4.626c.4615,0,.7574-.4908.542-.8989l-10.4155-19.7312c-.1019-.193-.0934-.4255.0221-.6106l5.4305-8.6994c.0591-.0947.143-.1715.2425-.222l19.415-9.8522c.1973-.1001.4332-.0861.6172.0366l5.5481,3.6981c.1007.0671.2189.1029.3399.1029h5.0407c.4881,0,.7804-.5429.5116-.9503l-13.9967-21.2171c-.2898-.4393-.962-.3331-1.1022.1741Z"
				fill={fill}
				strokeWidth="0"
			/>
		</svg>
	)
}
exports.Logo = Logo
var HoppingLogo = function (props) {
	var ref = (0, react_1.useRef)(null)
	var logo = <exports.Logo ref={ref} {...props} />
	var _a = (0, react_use_1.useHover)(logo),
		hoverable = _a[0],
		hovered = _a[1]
	;(0, react_1.useEffect)(
		function () {
			var element = ref.current
			var isHopping = element !== null && element.classList.contains("animate-hop")
			if (hovered && element && !isHopping) {
				element.classList.add("animate-hop")
			} else if (element && isHopping) {
				var onAnimationEnd_1 = function () {
					element.classList.remove("animate-hop")
					element.removeEventListener("animationiteration", onAnimationEnd_1)
				}
				element.addEventListener("animationiteration", onAnimationEnd_1)
			}
		},
		[hovered],
	)
	return hoverable
}
exports.HoppingLogo = HoppingLogo
