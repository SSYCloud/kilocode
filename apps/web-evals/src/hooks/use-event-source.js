"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.useEventSource = useEventSource
var react_1 = require("react")
function useEventSource(_a) {
	var url = _a.url,
		withCredentials = _a.withCredentials,
		onMessage = _a.onMessage
	var sourceRef = (0, react_1.useRef)(null)
	var statusRef = (0, react_1.useRef)("waiting")
	var _b = (0, react_1.useState)("waiting"),
		status = _b[0],
		setStatus = _b[1]
	var reconnectTimeoutRef = (0, react_1.useRef)(null)
	var isUnmountedRef = (0, react_1.useRef)(false)
	var handleMessage = (0, react_1.useCallback)(
		function (event) {
			return onMessage(event)
		},
		[onMessage],
	)
	var cleanup = (0, react_1.useCallback)(function () {
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current)
			reconnectTimeoutRef.current = null
		}
		if (sourceRef.current) {
			sourceRef.current.close()
			sourceRef.current = null
		}
	}, [])
	var createEventSource = (0, react_1.useCallback)(
		function () {
			if (isUnmountedRef.current) {
				return
			}
			cleanup()
			statusRef.current = "waiting"
			setStatus("waiting")
			sourceRef.current = new EventSource(url, { withCredentials: withCredentials })
			sourceRef.current.onopen = function () {
				if (isUnmountedRef.current) {
					return
				}
				statusRef.current = "connected"
				setStatus("connected")
			}
			sourceRef.current.onmessage = function (event) {
				if (isUnmountedRef.current) {
					return
				}
				handleMessage(event)
			}
			sourceRef.current.onerror = function () {
				if (isUnmountedRef.current) {
					return
				}
				statusRef.current = "error"
				setStatus("error")
				// Clean up current connection.
				cleanup()
				// Attempt to reconnect after a delay.
				reconnectTimeoutRef.current = setTimeout(function () {
					if (!isUnmountedRef.current) {
						createEventSource()
					}
				}, 1000)
			}
		},
		[url, withCredentials, handleMessage, cleanup],
	)
	;(0, react_1.useEffect)(
		function () {
			isUnmountedRef.current = false
			createEventSource()
			// Initial connection timeout.
			var initialTimeout = setTimeout(function () {
				if (statusRef.current === "waiting" && !isUnmountedRef.current) {
					createEventSource()
				}
			}, 5000)
			return function () {
				isUnmountedRef.current = true
				clearTimeout(initialTimeout)
				cleanup()
			}
		},
		[createEventSource, cleanup],
	)
	return status
}
