const SECOND_IN_MS = 1000
const MINUTE_IN_MS = 60 * SECOND_IN_MS
const HOUR_IN_MS = 60 * MINUTE_IN_MS

export const AUTH_RATE_LIMIT_CODE = 'rate_limited'

function pluralize(value: number, singular: string, plural: string) {
	return `${value} ${value === 1 ? singular : plural}`
}

export function getRemainingRateLimitTime(reset: number, now = Date.now()) {
	return Math.max(0, reset - now)
}

export function getRateLimitRetryAfterSeconds(reset: number, now = Date.now()) {
	return Math.max(1, Math.ceil(getRemainingRateLimitTime(reset, now) / SECOND_IN_MS))
}

export function formatRateLimitWaitTime(reset: number, now = Date.now()) {
	const remainingTime = getRemainingRateLimitTime(reset, now)

	if (remainingTime < MINUTE_IN_MS) {
		const seconds = Math.max(1, Math.ceil(remainingTime / SECOND_IN_MS))
		return pluralize(seconds, 'segundo', 'segundos')
	}

	if (remainingTime < 55 * MINUTE_IN_MS) {
		const minutes = Math.ceil(remainingTime / MINUTE_IN_MS)
		return pluralize(minutes, 'minuto', 'minutos')
	}

	const hours = Math.ceil(remainingTime / HOUR_IN_MS)
	return pluralize(hours, 'hora', 'horas')
}

export function buildAuthRateLimitMessage(reset: number, now = Date.now()) {
	return `Has hecho demasiados intentos. Inténtalo de nuevo en ${formatRateLimitWaitTime(reset, now)}.`
}

export function buildRateLimitErrorCode(reset: number) {
	return `${AUTH_RATE_LIMIT_CODE}:${reset}`
}

export function getRateLimitMessageFromCode(code?: string | null, now = Date.now()) {
	const reset = parseRateLimitResetFromCode(code)

	return reset === null ? null : buildAuthRateLimitMessage(reset, now)
}

export function parseRateLimitResetFromCode(code?: string | null) {
	if (!code?.startsWith(`${AUTH_RATE_LIMIT_CODE}:`)) {
		return null
	}

	const resetValue = Number(code.slice(AUTH_RATE_LIMIT_CODE.length + 1))

	return Number.isFinite(resetValue) ? resetValue : null
}
