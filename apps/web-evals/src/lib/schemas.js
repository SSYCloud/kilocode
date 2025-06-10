"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.createRunSchema =
	exports.CONCURRENCY_DEFAULT =
	exports.CONCURRENCY_MAX =
	exports.CONCURRENCY_MIN =
	exports.MODEL_DEFAULT =
		void 0
var zod_1 = require("zod")
var types_1 = require("@roo-code/types")
/**
 * CreateRun
 */
exports.MODEL_DEFAULT = "anthropic/claude-sonnet-4"
exports.CONCURRENCY_MIN = 1
exports.CONCURRENCY_MAX = 25
exports.CONCURRENCY_DEFAULT = 1
exports.createRunSchema = zod_1.z
	.object({
		model: zod_1.z.string().min(1, { message: "Model is required." }),
		description: zod_1.z.string().optional(),
		suite: zod_1.z.enum(["full", "partial"]),
		exercises: zod_1.z.array(zod_1.z.string()).optional(),
		settings: types_1.rooCodeSettingsSchema.optional(),
		concurrency: zod_1.z
			.number()
			.int()
			.min(exports.CONCURRENCY_MIN)
			.max(exports.CONCURRENCY_MAX)
			.default(exports.CONCURRENCY_DEFAULT),
		systemPrompt: zod_1.z.string().optional(),
	})
	.refine(
		function (data) {
			return data.suite === "full" || (data.exercises || []).length > 0
		},
		{
			message: "Exercises are required when running a partial suite.",
			path: ["exercises"],
		},
	)
