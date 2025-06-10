"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.formatToolUsageSuccessRate = exports.formatTokens = exports.formatDuration = exports.formatCurrency = void 0
var formatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
})
var formatCurrency = function (amount) {
	return formatter.format(amount)
}
exports.formatCurrency = formatCurrency
var formatDuration = function (durationMs) {
	var seconds = Math.floor(durationMs / 1000)
	var hours = Math.floor(seconds / 3600)
	var minutes = Math.floor((seconds % 3600) / 60)
	var remainingSeconds = seconds % 60
	var parts = []
	if (hours > 0) {
		parts.push("".concat(hours, "h"))
	}
	if (minutes > 0) {
		parts.push("".concat(minutes, "m"))
	}
	if (remainingSeconds > 0 || parts.length === 0) {
		parts.push("".concat(remainingSeconds, "s"))
	}
	return parts.join(" ")
}
exports.formatDuration = formatDuration
var formatTokens = function (tokens) {
	if (tokens < 1000) {
		return tokens.toString()
	}
	if (tokens < 1000000) {
		return "".concat((tokens / 1000).toFixed(1), "k")
	}
	if (tokens < 1000000000) {
		return "".concat((tokens / 1000000).toFixed(1), "M")
	}
	return "".concat((tokens / 1000000000).toFixed(1), "B")
}
exports.formatTokens = formatTokens
var formatToolUsageSuccessRate = function (usage) {
	return usage.attempts === 0
		? "0%"
		: "".concat((((usage.attempts - usage.failures) / usage.attempts) * 100).toFixed(1), "%")
}
exports.formatToolUsageSuccessRate = formatToolUsageSuccessRate
