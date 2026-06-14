import { describe, it, expect } from 'vitest'
import { getIPFromRequest } from '@/lib/get-ip'

function makeRequest(headers: Record<string, string>) {
	return new Request('https://example.com', { headers })
}

describe('getIPFromRequest', () => {
	it('extracts IP from x-forwarded-for header', () => {
		const req = makeRequest({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' })
		expect(getIPFromRequest(req)).toBe('1.2.3.4')
	})

	it('trims whitespace from x-forwarded-for', () => {
		const req = makeRequest({ 'x-forwarded-for': '  1.2.3.4  ' })
		expect(getIPFromRequest(req)).toBe('1.2.3.4')
	})

	it('falls back to x-real-ip when x-forwarded-for is empty', () => {
		const req = makeRequest({ 'x-real-ip': '9.8.7.6' })
		expect(getIPFromRequest(req)).toBe('9.8.7.6')
	})

	it('prefers x-forwarded-for over x-real-ip', () => {
		const req = makeRequest({
			'x-forwarded-for': '1.2.3.4',
			'x-real-ip': '9.8.7.6'
		})
		expect(getIPFromRequest(req)).toBe('1.2.3.4')
	})

	it('returns "anonymous" when no headers are present', () => {
		const req = makeRequest({})
		expect(getIPFromRequest(req)).toBe('anonymous')
	})

	it('returns "anonymous" when x-forwarded-for is whitespace-only', () => {
		const req = makeRequest({ 'x-forwarded-for': '   ' })
		expect(getIPFromRequest(req)).toBe('anonymous')
	})
})