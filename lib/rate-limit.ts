import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

type RateLimitStore = {
	redis: Redis
	rateLimiters: {
		login: Ratelimit
		register: Ratelimit
		passwordReset: Ratelimit
		resendVerification: Ratelimit
		changePassword: Ratelimit
	}
}

const globalForRateLimit = globalThis as typeof globalThis & {
	__rateLimitStore?: RateLimitStore
}

function createRateLimitStore(): RateLimitStore {
	const redis = Redis.fromEnv()

	return {
		redis,
		rateLimiters: {
			login: new Ratelimit({
				redis,
				limiter: Ratelimit.slidingWindow(5, '15 m'),
				prefix: 'ratelimit:login',
				analytics: true
			}),
			register: new Ratelimit({
				redis,
				limiter: Ratelimit.slidingWindow(3, '1 h'),
				prefix: 'ratelimit:register',
				analytics: true
			}),
			passwordReset: new Ratelimit({
				redis,
				limiter: Ratelimit.slidingWindow(3, '1 h'),
				prefix: 'ratelimit:password-reset',
				analytics: true
			}),
			resendVerification: new Ratelimit({
				redis,
				limiter: Ratelimit.slidingWindow(3, '1 h'),
				prefix: 'ratelimit:resend-verification',
				analytics: true
			}),
			changePassword: new Ratelimit({
				redis,
				limiter: Ratelimit.slidingWindow(5, '15 m'),
				prefix: 'ratelimit:change-password',
				analytics: true
			})
		}
	}
}

const rateLimitStore = globalForRateLimit.__rateLimitStore ?? createRateLimitStore()

if (process.env.NODE_ENV !== 'production') {
	globalForRateLimit.__rateLimitStore = rateLimitStore
}

export const redis = rateLimitStore.redis
export const rateLimiters = rateLimitStore.rateLimiters
