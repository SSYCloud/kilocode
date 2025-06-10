"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.useRunners = void 0
var react_query_1 = require("@tanstack/react-query")
var runners_1 = require("@/lib/server/runners")
var useRunners = function (runId) {
	return (0, react_query_1.useQuery)({
		queryKey: ["runners", runId],
		queryFn: function () {
			return (0, runners_1.getRunners)(runId)
		},
		refetchInterval: 10000,
	})
}
exports.useRunners = useRunners
