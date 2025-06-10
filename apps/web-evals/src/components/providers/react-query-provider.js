"use client"
"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.ReactQueryProvider = ReactQueryProvider
var react_query_1 = require("@tanstack/react-query")
function ReactQueryProvider(_a) {
	var children = _a.children
	var queryClient = new react_query_1.QueryClient()
	return <react_query_1.QueryClientProvider client={queryClient}>{children}</react_query_1.QueryClientProvider>
}
