import { headers } from 'next/headers'

type HeaderSource = {
	get(name: string): string | null
}

function extractIp(headerSource: HeaderSource) {
	const forwardedFor = headerSource.get('x-forwarded-for')

	if (forwardedFor) {
		const [ip] = forwardedFor.split(',')
		const normalizedIp = ip?.trim()

		if (normalizedIp) {
			return normalizedIp
		}
	}

	return headerSource.get('x-real-ip')?.trim() || 'anonymous'
}

export async function getIPFromHeaders() {
	const headerStore = await headers()
	return extractIp(headerStore)
}

export function getIPFromRequest(request: Request) {
	return extractIp(request.headers)
}
