import { describe, it, expect } from 'vitest'
import {
	formatRateLimitWaitTime,
	getRemainingRateLimitTime,
	getRateLimitRetryAfterSeconds,
	buildAuthRateLimitMessage,
	buildRateLimitErrorCode,
	parseRateLimitResetFromCode,
	getRateLimitMessageFromCode,
	AUTH_RATE_LIMIT_CODE
} from '@/lib/auth/rate-limit-messages'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

describe('formatRateLimitWaitTime', () => {
	it('shows seconds when remaining time is under a minute', () => {
		const now = Date.now()
		expect(formatRateLimitWaitTime(now + 30 * SECOND, now)).toBe('30 segundos')
		expect(formatRateLimitWaitTime(now + 1 * SECOND, now)).toBe('1 segundo')
		expect(formatRateLimitWaitTime(now + 500, now)).toBe('1 segundo')
	})

	it('shows minutes when between 1 and 55 minutes', () => {
		const now = Date.now()
		expect(formatRateLimitWaitTime(now + 5 * MINUTE, now)).toBe('5 minutos')
		expect(formatRateLimitWaitTime(now + 1 * MINUTE, now)).toBe('1 minuto')
	})

	it('shows hours when 55 minutes or more remain', () => {
		const now = Date.now()
		expect(formatRateLimitWaitTime(now + 55 * MINUTE, now)).toBe('1 hora')
		expect(formatRateLimitWaitTime(now + 2 * HOUR, now)).toBe('2 horas')
	})
})

describe('getRemainingRateLimitTime', () => {
	it('returns time difference in ms', () => {
		const now = Date.now()
		const reset = now + 30_000
		expect(getRemainingRateLimitTime(reset, now)).toBe(30_000)
	})

	it('clamps to 0 when reset is in the past', () => {
		const now = Date.now()
		expect(getRemainingRateLimitTime(now - 10_000, now)).toBe(0)
	})
})

describe('getRateLimitRetryAfterSeconds', () => {
	it('returns at least 1 second', () => {
		const now = Date.now()
		expect(getRateLimitRetryAfterSeconds(now + 100, now)).toBe(1)
	})

	it('rounds up to the next second', () => {
		const now = Date.now()
		expect(getRateLimitRetryAfterSeconds(now + 1500, now)).toBe(2)
		expect(getRateLimitRetryAfterSeconds(now + 5000, now)).toBe(5)
	})
})

describe('buildAuthRateLimitMessage', () => {
	it('includes the formatted wait time in Spanish', () => {
		const now = Date.now()
		const message = buildAuthRateLimitMessage(now + 30 * SECOND, now)
		expect(message).toContain('30 segundos')
		expect(message).toContain('Inténtalo de nuevo')
	})
})

describe('buildRateLimitErrorCode / parseRateLimitResetFromCode', () => {
	it('round-trips a reset timestamp', () => {
		const reset = Date.now() + 60_000
		const code = buildRateLimitErrorCode(reset)
		expect(parseRateLimitResetFromCode(code)).toBe(reset)
	})

	it('returns null for non-rate-limit codes', () => {
		expect(parseRateLimitResetFromCode('other_error')).toBeNull()
		expect(parseRateLimitResetFromCode(null)).toBeNull()
		expect(parseRateLimitResetFromCode(undefined)).toBeNull()
	})

	it('returns null for malformed codes', () => {
		expect(parseRateLimitResetFromCode(`${AUTH_RATE_LIMIT_CODE}:notanumber`)).toBeNull()
	})
})

describe('getRateLimitMessageFromCode', () => {
	it('returns a message when code is a rate limit code', () => {
		const now = Date.now()
		const reset = now + 5 * MINUTE
		const code = buildRateLimitErrorCode(reset)
		const message = getRateLimitMessageFromCode(code, now)
		expect(message).toContain('5 minutos')
	})

	it('returns null for non-rate-limit codes', () => {
		expect(getRateLimitMessageFromCode('credentials')).toBeNull()
		expect(getRateLimitMessageFromCode(null)).toBeNull()
	})
})