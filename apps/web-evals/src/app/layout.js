"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.metadata = void 0
exports.default = RootLayout
var google_1 = require("next/font/google")
var providers_1 = require("@/components/providers")
var ui_1 = require("@/components/ui")
var header_1 = require("@/components/layout/header")
require("./globals.css")
var fontSans = (0, google_1.Geist)({ variable: "--font-sans", subsets: ["latin"] })
var fontMono = (0, google_1.Geist_Mono)({ variable: "--font-mono", subsets: ["latin"] })
exports.metadata = {
	title: "Kilo Code Evals",
}
function RootLayout(_a) {
	var children = _a.children
	return (
		<html lang="en">
			<body
				className={"".concat(fontSans.variable, " ").concat(fontMono.variable, " font-sans antialiased pb-12")}>
				<providers_1.ThemeProvider attribute="class" forcedTheme="dark" disableTransitionOnChange>
					<providers_1.ReactQueryProvider>
						<header_1.Header />
						{children}
					</providers_1.ReactQueryProvider>
				</providers_1.ThemeProvider>
				<ui_1.Toaster />
			</body>
		</html>
	)
}
