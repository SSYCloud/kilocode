#!/usr/bin/env node

// Load .env file before any other imports or initialization
import { loadEnvFile } from "./utils/env-loader.js"
loadEnvFile()

import { Command } from "commander"
import { existsSync } from "fs"
import { CLI } from "./cli.js"
import { DEFAULT_MODES } from "./constants/modes/defaults.js"
import { getTelemetryService } from "./services/telemetry/index.js"
import { Package } from "./constants/package.js"
import openConfigFile from "./config/openConfig.js"
import authWizard from "./utils/authWizard.js"
import { configExists } from "./config/persistence.js"
import { envConfigExists, getMissingEnvVars } from "./config/env-config.js"
import { getParallelModeParams } from "./parallel/parallel.js"
import { DEBUG_MODES, DEBUG_FUNCTIONS } from "./debug/index.js"
import { logs } from "./services/logs.js"

const program = new Command()
let cli: CLI | null = null

// Get list of valid mode slugs
const validModes = DEFAULT_MODES.map((mode) => mode.slug)

program
	.name("kilocode")
	.description("Kilo Code 终端用户界面 - 人工智能驱动的编程助手")
	.version(Package.version)
	.option("-m, --mode <mode>", `设置操作模式 (${validModes.join(", ")})`)
	.option("-w, --workspace <path>", "工作区目录的路径", process.cwd())
	.option("-a, --auto", "以自主模式（非交互式）运行", false)
	.option("-j, --json", "以 JSON 格式输出消息（需要使用 --auto 参数）", false)
	.option("-c, --continue", "从此工作区继续上次对话", false)
	.option("-t, --timeout <seconds>", "自主模式超时时间（秒）（需要使用 --auto 参数）", parseInt)
	.option(
		"-p, --parallel",
		"以并行模式运行——除非您提供 `--existing-branch` 选项，否则 agent 将创建一个单独的 Git 分支。",
	)
	.option("-eb, --existing-branch <branch>", "（仅限并行模式）指示 agent 在现有分支上工作")
	.option("-pv, --provider <id>", "按 ID 选择提供商 (如： 'shengsuanyun')")
	.option("-mo, --model <model>", "覆盖所选提供商的模型")
	.option("--nosplash", "禁用欢迎消息和更新通知", false)
	.argument("[prompt]", "执行的提示或命令")
	.action(async (prompt, options) => {
		// Validate mode if provided
		if (options.mode && !validModes.includes(options.mode)) {
			console.error(`Error: 无效的模式 "${options.mode}". 可用模式有: ${validModes.join(", ")}`)
			process.exit(1)
		}

		// Validate that --existing-branch requires --parallel
		if (options.existingBranch && !options.parallel) {
			console.error("Error: --existing-branch 必须 --parallel 需启用")
			process.exit(1)
		}

		// Validate workspace path exists
		if (!existsSync(options.workspace)) {
			console.error(`Error: 工作目录不存在: ${options.workspace}`)
			process.exit(1)
		}

		// Validate that piped stdin requires autonomous mode
		if (!process.stdin.isTTY && !options.auto) {
			console.error("Error: 必须有管道输入 --auto 需启用")
			process.exit(1)
		}

		// Validate that JSON mode requires autonomous mode
		if (options.json && !options.auto) {
			console.error("Error: --json 必须 --auto 需启用")
			process.exit(1)
		}

		// Read from stdin if no prompt argument is provided and stdin is piped
		let finalPrompt = prompt || ""
		if (!finalPrompt && !process.stdin.isTTY) {
			// Read from stdin
			const chunks: Buffer[] = []
			for await (const chunk of process.stdin) {
				chunks.push(chunk)
			}
			finalPrompt = Buffer.concat(chunks).toString("utf-8").trim()
		}

		// Validate that autonomous mode requires a prompt
		if (options.auto && !finalPrompt) {
			console.error("Error: 自主模式 (--auto) 和并行模式 (--parallel) 需要提示参数或管道输入")
			process.exit(1)
		}

		// Validate that timeout requires autonomous mode
		if (options.timeout && !options.auto) {
			console.error("Error: --timeout 参数必须 --auto 需启用")
			process.exit(1)
		}

		// Validate timeout is a positive number
		if (options.timeout && (isNaN(options.timeout) || options.timeout <= 0)) {
			console.error("Error: --timeout 参数必须为正数")
			process.exit(1)
		}

		// Validate that continue mode is not used with autonomous mode
		if (options.continue && options.auto) {
			console.error("Error: --continue 参数不能和 --auto 同时使用")
			process.exit(1)
		}

		// Validate that continue mode is not used with a prompt
		if (options.continue && finalPrompt) {
			console.error("Error: --continue 选项不能与提示参数一起使用")
			process.exit(1)
		}

		// Validate provider if specified
		if (options.provider) {
			// Load config to check if provider exists
			const { loadConfig } = await import("./config/persistence.js")
			const { config } = await loadConfig()
			const providerExists = config.providers.some((p) => p.id === options.provider)
			if (!providerExists) {
				const availableIds = config.providers.map((p) => p.id).join(", ")
				console.error(`Error: 供应商 "${options.provider}" 未找到. 可用供应商: ${availableIds}`)
				process.exit(1)
			}
		}

		// Track autonomous mode start if applicable
		if (options.auto && finalPrompt) {
			getTelemetryService().trackCIModeStarted(finalPrompt.length, options.timeout)
		}

		// Check if config exists or if we have minimal env config
		const hasConfig = await configExists()

		// Check if we have env config with all required fields
		const hasEnvConfig = envConfigExists()

		if (!hasConfig && !hasEnvConfig) {
			// No config file and no env config - show auth wizard
			console.info("欢迎使用 Kilo Code CLI! 🎉\n")
			console.info("为了帮助您开始，请填写以下问题。")
			await authWizard()
		} else if (!hasConfig && hasEnvConfig) {
			// Running with env config only
			logs.info("以临时模式运行，并配置环境变量", "Index")

			const providerType = process.env.KILO_PROVIDER_TYPE
			if (providerType) {
				const missing = getMissingEnvVars(providerType)
				if (missing.length > 0) {
					console.error(`\nError: 缺少提供程序所需的环境变量 "${providerType}":`)
					console.error(`  ${missing.join("\n  ")}`)
					console.error(`\n请设置这些环境变量或运行“kilocode auth”通过向导进行配置。\n`)
					process.exit(1)
				}
			}
		} else if (hasConfig && hasEnvConfig) {
			// Both exist - env vars will override config file values
			logs.debug("使用带有环境变量覆盖的配置文件", "Index")
		}

		let finalWorkspace = options.workspace
		let worktreeBranch

		if (options.parallel) {
			const parallelParams = await getParallelModeParams({
				cwd: options.workspace,
				prompt: finalPrompt,
				timeout: options.timeout,
				existingBranch: options.existingBranch,
			})

			finalWorkspace = parallelParams.worktreePath
			worktreeBranch = parallelParams.worktreeBranch

			getTelemetryService().trackParallelModeStarted(
				!!options.existingBranch,
				finalPrompt.length,
				options.timeout,
			)
		}

		logs.debug("启动 Kilo Code CLI", "Index", { options })

		cli = new CLI({
			mode: options.mode,
			workspace: finalWorkspace,
			ci: options.auto,
			json: options.json,
			prompt: finalPrompt,
			timeout: options.timeout,
			parallel: options.parallel,
			worktreeBranch,
			continue: options.continue,
			provider: options.provider,
			model: options.model,
			noSplash: options.nosplash,
		})
		await cli.start()
		await cli.dispose()
	})

program
	.command("auth")
	.description("Manage authentication for the Kilo Code CLI")
	.action(async () => {
		await authWizard()
	})

// Config command - opens the config file in the default editor
program
	.command("config")
	.description("Open the configuration file in your default editor")
	.action(async () => {
		await openConfigFile()
	})

// Debug command - checks hardware and OS compatibility
program
	.command("debug")
	.description("Run a system compatibility check for the Kilo Code CLI")
	.argument("[mode]", `The mode to debug (${DEBUG_MODES.join(", ")})`, "")
	.action(async (mode: string) => {
		if (!mode || !DEBUG_MODES.includes(mode)) {
			console.error(`Error: Invalid debug mode. Valid modes are: ${DEBUG_MODES.join(", ")}`)
			process.exit(1)
		}

		const debugFunction = DEBUG_FUNCTIONS[mode as keyof typeof DEBUG_FUNCTIONS]
		if (!debugFunction) {
			console.error(`Error: Debug function not implemented for mode: ${mode}`)
			process.exit(1)
		}

		await debugFunction()
	})

// Handle process termination signals
process.on("SIGINT", async () => {
	if (cli) {
		await cli.dispose()
	}
	process.exit(0)
})

process.on("SIGTERM", async () => {
	if (cli) {
		await cli.dispose()
	}
	process.exit(0)
})

// Parse command line arguments
program.parse()
