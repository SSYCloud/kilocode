"use client"
"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.ConnectionStatus = void 0
var use_runners_1 = require("@/hooks/use-runners")
var utils_1 = require("@/lib/utils")
var ConnectionStatus = function (connectionStatus) {
	var _a = (0, use_runners_1.useRunners)(connectionStatus.runId),
		runners = _a.data,
		isLoading = _a.isLoading
	var status = isLoading ? "loading" : runners === null ? "dead" : connectionStatus.status
	return (
		<div>
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-2">
					<div>Status:</div>
					<div className="capitalize">{status}</div>
				</div>
				<div className="relative">
					<div
						className={(0, utils_1.cn)("absolute size-2.5 rounded-full opacity-50 animate-ping", {
							"bg-gray-500": status === "loading",
							"bg-green-500": status === "connected",
							"bg-amber-500": status === "waiting",
							"bg-rose-500": status === "error" || status === "dead",
						})}
					/>
					<div
						className={(0, utils_1.cn)("size-2.5 rounded-full", {
							"bg-gray-500": status === "loading",
							"bg-green-500": status === "connected",
							"bg-amber-500": status === "waiting",
							"bg-rose-500": status === "error" || status === "dead",
						})}
					/>
				</div>
			</div>
			<div className="flex items-center gap-2">
				<div>Runners:</div>
				{runners && runners.length > 0 && (
					<div className="font-mono text-sm text-muted-foreground">
						{runners === null || runners === void 0 ? void 0 : runners.join(", ")}
					</div>
				)}
			</div>
		</div>
	)
}
exports.ConnectionStatus = ConnectionStatus
