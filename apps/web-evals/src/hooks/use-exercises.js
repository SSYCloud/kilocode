"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.useExercises = void 0
var react_query_1 = require("@tanstack/react-query")
var exercises_1 = require("@/lib/server/exercises")
var useExercises = function () {
	return (0, react_query_1.useQuery)({
		queryKey: ["exercises"],
		queryFn: function () {
			return (0, exercises_1.getExercises)()
		},
	})
}
exports.useExercises = useExercises
