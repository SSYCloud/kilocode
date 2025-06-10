"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.TaskStatus = void 0
var lucide_react_1 = require("lucide-react")
var TaskStatus = function (_a) {
	var task = _a.task,
		running = _a.running
	return task.passed === false ? (
		<lucide_react_1.CircleSlash className="size-4 text-destructive" />
	) : task.passed === true ? (
		<lucide_react_1.CircleCheck className="size-4 text-green-500" />
	) : running ? (
		<lucide_react_1.LoaderCircle className="size-4 animate-spin" />
	) : (
		<lucide_react_1.CircleDashed className="size-4" />
	)
}
exports.TaskStatus = TaskStatus
