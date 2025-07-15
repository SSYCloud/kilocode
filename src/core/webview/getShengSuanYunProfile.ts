import axios, { AxiosRequestConfig } from "axios"

export function dateQueryString(): string {
	const endDate = new Date()
	const startDate = new Date(endDate)
	startDate.setDate(endDate.getDate() - 3)
	const formatDate = (date: Date): string => {
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, "0") // 月份补零
		const day = String(date.getDate()).padStart(2, "0") // 日期补零
		return `${year}-${month}-${day}`
	}
	return `startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`
}

export function dateLocal(ds: string): string {
	const dateObj = new Date(ds)
	return dateObj.toLocaleDateString("zh-CN", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	})
}
export async function fetchUserDataRPC(token: string): Promise<any> {
	const baseUrl = "https://api.shengsuanyun.com"
	try {
		const dqs = dateQueryString()
		const cfg = {
			headers: { "x-token": token, "Content-Type": "application/json" },
		}
		let [rate, usage, payment, user] = await Promise.all<any>([
			axios.get(`${baseUrl}/base/rate`, cfg).then((res) => res.data.data || null),
			axios
				.get(`${baseUrl}/modelrouter/userlog?page=1&pageSize=1000&${dqs}`, cfg)
				.then((res) => res.data.data || null),
			axios
				.get(`${baseUrl}/modelrouter/listrecharge?page=1&pageSize=10000`, cfg)
				.then((res) => res.data.data || null),
			axios.get(`${baseUrl}/user/info`, cfg).then((res) => res.data.data || null),
		])

		if (!usage || !Array.isArray(usage?.logs) || !rate) {
			usage = []
		} else {
			usage = usage.logs.map((it: any) => ({
				spentAt: it.request_time,
				model: `${it.model?.company}/${it.model?.name}`,
				credits: (rate * it.total_amount) / 10000000,
				totalTokens: it.total_amount,
				promptTokens: it.input_tokens,
				completionTokens: it.output_tokens,
			}))
		}

		if (!payment || !Array.isArray(payment.records) || !rate) {
			payment = []
		} else {
			payment = payment.records.map((it: any) => ({
				paidAt: it.create_at,
				creatorId: "",
				amountCents: ((rate * it.price) / 10000).toString(),
				credits: 0,
			}))
		}

		let balance = 0
		let account: any = null
		if (user && user.Wallet && user.Wallet.Assets) {
			account = {
				Email: user.Email,
				Nickname: user.Nickname,
				HeadImg: user.HeadImg,
				Username: user.Username,
				Wallet: user.Wallet,
				Phone: user.Phone,
			}
			if (rate) balance = (rate * user.Wallet.Assets) / 10000
		}
		return { balance, usage, payment, account }
	} catch (error) {
		console.error("Failed fetchUserDataRPC:", error)
		throw error
	}
}
