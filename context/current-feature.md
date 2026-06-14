# rate-limiting-spec

# Current Feature

<!-- Feature Name -->

## Status

In Progress

## Goals

- Implement server-side rate limiting with Upstash Redis for all auth-sensitive endpoints listed in the spec.
- Use `@upstash/ratelimit` and `@upstash/redis` only if they are not already installed.
- Create a shared singleton in `lib/rate-limit.ts` with one `Ratelimit.slidingWindow` instance per endpoint.
- Create shared IP helpers in `lib/get-ip.ts` for API Routes and Server Actions.
- Apply rate limiting at the very start of each protected flow, before any DB query or business logic.
- Protect the NextAuth credentials login flow in `auth/auth.ts` using IP-based limiting.
- Protect registration in `app/api/auth/register/route.ts` using IP-based limiting and return HTTP 429 with `Retry-After` headers.
- Protect the Server Actions for password reset request, resend verification, and change password.
- Use `userId` as the identifier for authenticated change-password limiting, falling back only if needed.
- Do not add any rate limiting logic to `components/auth/login-form.tsx` because it is client-side.
- Verify the actual Upstash env variable names from `.env` and adapt the Redis client initialization if needed.
- Keep the response format appropriate to each execution context: HTTP 429 for API Routes, structured `{ error }` objects for Server Actions, and proper failure signaling in the NextAuth credentials callback.

## Notes

- Source spec: `context/features/rate-limiting-spec.md`.
- Reference docs to review before implementation:
  - Upstash Ratelimit SDK: https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
  - Upstash algorithms: https://upstash.com/docs/redis/sdks/ratelimit-ts/algorithms
  - IP extraction in Next.js Server Actions: https://nextjsweekly.com/blog/rate-limiting-server-actions
- Endpoints in scope:
  - `auth/auth.ts:50-97` — NextAuth credentials callback (Login)
  - `app/api/auth/register/route.ts:37-121` — Registration API Route
  - `actions/auth/request-password-reset.ts:15-41` — Request password reset Server Action
  - `actions/auth/resend-verification.ts:18-44` — Resend verification Server Action
  - `actions/auth/change-password.ts:15-76` — Change password Server Action
  - `components/auth/login-form.tsx:53-89` — explicitly out of scope for server-side rate limiting logic
- Required thresholds from the spec:
  - Login: 5 attempts / 15 minutes
  - Register: 3 attempts / 1 hour
  - Request password reset: 3 attempts / 1 hour
  - Resend verification: 3 attempts / 1 hour
  - Change password: 5 attempts / 15 minutes
- Use sliding window for every limiter.
- API Route blocked responses must include `Retry-After`.
- Manual verification checklist exists in the source spec and should be used after implementation.

## History

<!-- refers to the file @context/history.md -->
