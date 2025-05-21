import axios from "axios"
import { z } from "zod"
import { VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"

const shengSuanYunKeyInfoSchema = z.object({
	Nickname: z.string(),
	Assets: z.number(),
	Balance: z.number(),
	VoucherBalance: z.number(),
})

export type ShengSuanYunKeyInfo = z.infer<typeof shengSuanYunKeyInfoSchema>

async function getShengSuanYunKeyInfo(apiKey?: string) {
	if (!apiKey) return null
	try {
		const res = await axios.get("https://api.shengsuanyun.com/user/info", {
			headers: {
				"x-token": `${apiKey}`,
				"Content-Type": "application/json",
			},
		})
		if (res.status !== 200 || !res.data || res.data.code !== 0 || !res.data.data) {
			console.error("Failed to fetch ShengSuanYun key info:", res)
			return null
		}
		const result = shengSuanYunKeyInfoSchema.safeParse({
			Nickname: res.data.data.Nickname,
			Assets: res.data.data.Wallet.Assets / 10000,
			Balance: res.data.data.Wallet.Balance / 10000,
			VoucherBalance: res.data.data.Wallet.VoucherBalance / 10000,
		})
		if (!result.success) {
			console.error("ShengSuanYun API key info validation failed:", result.error)
			return null
		}

		return result.data
	} catch (error) {
		console.error("Error fetching ShengSuanYun key info:", error)
		console.log("access token:", apiKey)
		return null
	}
}

type UseShengSuanYunKeyInfoOptions = Omit<UseQueryOptions<ShengSuanYunKeyInfo | null>, "queryKey" | "queryFn">
export const useShengSuanYunKeyInfo = (apiKey?: string, options?: UseShengSuanYunKeyInfoOptions) => {
	return useQuery<ShengSuanYunKeyInfo | null>({
		queryKey: ["shengsuanyun-key-info", apiKey],
		queryFn: () => getShengSuanYunKeyInfo(apiKey),
		staleTime: 30 * 1000, // 30 seconds
		enabled: !!apiKey,
		...options,
	})
}

export const ShengSuanYunBalanceDisplay = ({ apiKey }: { apiKey: string | undefined }) => {
	const { data: keyInfo } = useShengSuanYunKeyInfo(apiKey)
	if (!keyInfo) {
		return null
	}
	const formattedBalance = keyInfo.Assets.toFixed(2)
	return (
		<VSCodeLink href="https://router.shengsuanyun.com/user/bill" className="text-vscode-foreground hover:underline">
			￥{formattedBalance}
		</VSCodeLink>
	)
}
