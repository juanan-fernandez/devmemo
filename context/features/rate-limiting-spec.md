# Task: Implement Rate Limiting with Upstash Redis

## Context

- **Framework:** Next.js (App Router)
- **Rate limiting provider:** Upstash Redis (already configured, credentials exist in `.env`)
- **Deployment:** Vercel (serverless — no shared memory between function instances, so in-memory maps are NOT suitable)
- **Auth library:** NextAuth v5

The following endpoints need rate limiting. They cover two different execution contexts that require different implementation strategies:

| File | Endpoint type | Description |
|------|--------------|-------------|
| `auth/auth.ts:50-97` | NextAuth credentials callback | Login |
| `app/api/auth/register/route.ts:37-121` | API Route handler | Registration |
| `actions/auth/request-password-reset.ts:15-41` | Server Action | Request password reset |
| `actions/auth/resend-verification.ts:18-44` | Server Action | Resend verification email |
| `actions/auth/change-password.ts:15-76` | Server Action | Change password |
| `components/auth/login-form.tsx:53-89` | Client component | `signIn()` call |

> **Important — `login-form.tsx` is a client component.** Rate limiting must NEVER be implemented client-side. The login form calls `signIn()` which hits the credentials callback in `auth/auth.ts`. Rate limiting already covers that path server-side. Do NOT add any rate limiting logic to `login-form.tsx` itself.

---

## Reference documentation

Read these before writing any code:

- Upstash Ratelimit SDK: https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
- Upstash algorithms (sliding window vs fixed window): https://upstash.com/docs/redis/sdks/ratelimit-ts/algorithms
- IP extraction in Next.js Server Actions (no Request object available): https://nextjsweekly.com/blog/rate-limiting-server-actions

---

## ⚠️ Critical considerations before writing any code

### 1. Server Actions do not expose a Request object

Next.js Server Actions (`'use server'`) do not provide access to the raw `Request` object. To extract the client IP inside a Server Action, use Next.js's `headers()` function:

```ts
import { headers } from 'next/headers';

const headersList = await headers();
const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous';
```

### 2. Use the identifier that makes most sense per endpoint

| Endpoint | Recommended identifier | Reason |
|----------|----------------------|--------|
| Login | `login:<ip>` | User is not yet authenticated |
| Register | `register:<ip>` | User is not yet authenticated |
| Request password reset | `reset:<ip>` | User may not exist; use IP |
| Resend verification | `resend-verification:<ip>` | Same as above |
| Change password | `change-password:<userId>` | User is authenticated; prefer userId over IP |

For authenticated actions, prefer `userId` from the session over IP. Fall back to IP if the session is somehow unavailable.

### 3. Algorithm choice: Sliding Window

Use `Ratelimit.slidingWindow` for all auth endpoints. It prevents edge-case bursts that fixed windows allow at window boundaries, which is critical for brute-force protection.

### 4. Rate limit thresholds (security-focused, auth endpoints)

These are conservative starting values appropriate for auth endpoints. Do not increase them without security review:

| Endpoint | Limit | Window |
|----------|-------|--------|
| Login (credentials) | 5 attempts | 15 minutes |
| Register | 3 attempts | 1 hour |
| Request password reset | 3 attempts | 1 hour |
| Resend verification email | 3 attempts | 1 hour |
| Change password | 5 attempts | 15 minutes |

### 5. Response format differs between API Routes and Server Actions

- **API Routes** → return `Response` or `NextResponse` with HTTP status `429` and `Retry-After` header.
- **Server Actions** → no HTTP response possible; return a structured error object: `{ error: 'Too many requests. Please try again later.' }`.
- **NextAuth credentials callback** → throw an error or return `null` to signal failed authentication. Do not throw a string — throw an `Error` or return `null` with a meaningful message.

### 6. Upstash env variable names

Check `.env` for the actual variable names. Common conventions are:
- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`

If those names match, use `Redis.fromEnv()` for automatic resolution. If the names differ, instantiate manually:

```ts
import { Redis } from '@upstash/redis';
const redis = new Redis({
  url: process.env.YOUR_UPSTASH_URL!,
  token: process.env.YOUR_UPSTASH_TOKEN!,
});
```

---

## Step 1 — Install dependencies

Check `package.json` first. If `@upstash/ratelimit` and `@upstash/redis` are not already present, install them:

```bash
npm install @upstash/ratelimit @upstash/redis
```

---

## Step 2 — Create the rate limiter singleton

Create `lib/rate-limit.ts`. Define one named `Ratelimit` instance per endpoint so each has its own counter and threshold in Redis.

```ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Use Redis.fromEnv() if env vars are named UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.
// Otherwise replace with: new Redis({ url: process.env.YOUR_URL!, token: process.env.YOUR_TOKEN! })
const redis = Redis.fromEnv();

export const rateLimiters = {
  login: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    prefix: 'ratelimit:login',
    analytics: true,
  }),
  register: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    prefix: 'ratelimit:register',
    analytics: true,
  }),
  passwordReset: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    prefix: 'ratelimit:password-reset',
    analytics: true,
  }),
  resendVerification: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    prefix: 'ratelimit:resend-verification',
    analytics: true,
  }),
  changePassword: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    prefix: 'ratelimit:change-password',
    analytics: true,
  }),
};
```

---

## Step 3 — Create a shared IP helper

Create `lib/get-ip.ts`. This helper will be used in Server Actions (via `headers()`) and in API Routes (via the `Request` object):

```ts
import { headers } from 'next/headers';

/**
 * Extracts the client IP from Next.js Server Action context.
 * Uses the next/headers module — only call from 'use server' files.
 */
export async function getIPFromHeaders(): Promise<string> {
  const headersList = await headers();
  return headersList.get('x-forwarded-for')?.split(',')[0].trim() ?? 'anonymous';
}

/**
 * Extracts the client IP from an API Route Request object.
 */
export function getIPFromRequest(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'anonymous'
  );
}
```

---

## Step 4 — Apply rate limiting to each endpoint

Read each file fully before modifying it. Apply the rate limiter at the **very top** of the protected block, before any database query or business logic.

### 4a — `auth/auth.ts` (credentials callback, lines 50–97)

Inside the `authorize` function of the Credentials provider, add at the top:

```ts
import { rateLimiters } from '@/lib/rate-limit';
import { headers } from 'next/headers';

// Inside authorize():
const headersList = await headers();
const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() ?? 'anonymous';
const { success } = await rateLimiters.login.limit(`login:${ip}`);
if (!success) {
  throw new Error('Too many login attempts. Please try again later.');
}
```

> The `authorize` function runs server-side inside NextAuth. Using `headers()` here is valid.

### 4b — `app/api/auth/register/route.ts` (lines 37–121)

At the top of the `POST` handler, before any logic:

```ts
import { rateLimiters } from '@/lib/rate-limit';
import { getIPFromRequest } from '@/lib/get-ip';

// Inside POST(request: Request):
const ip = getIPFromRequest(request);
const { success, reset } = await rateLimiters.register.limit(`register:${ip}`);
if (!success) {
  const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000);
  return Response.json(
    { error: 'Too many registration attempts. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': retryAfterSeconds.toString(),
        'X-RateLimit-Limit': '3',
        'X-RateLimit-Remaining': '0',
      },
    }
  );
}
```

### 4c — `actions/auth/request-password-reset.ts` (lines 15–41)

At the top of the action function body:

```ts
import { rateLimiters } from '@/lib/rate-limit';
import { getIPFromHeaders } from '@/lib/get-ip';

// Inside the action:
const ip = await getIPFromHeaders();
const { success } = await rateLimiters.passwordReset.limit(`reset:${ip}`);
if (!success) {
  return { error: 'Too many requests. Please try again later.' };
}
```

### 4d — `actions/auth/resend-verification.ts` (lines 18–44)

```ts
import { rateLimiters } from '@/lib/rate-limit';
import { getIPFromHeaders } from '@/lib/get-ip';

const ip = await getIPFromHeaders();
const { success } = await rateLimiters.resendVerification.limit(`resend-verification:${ip}`);
if (!success) {
  return { error: 'Too many requests. Please try again later.' };
}
```

### 4e — `actions/auth/change-password.ts` (lines 15–76)

This action is authenticated, so prefer `userId` as identifier. Read the session first, then rate limit:

```ts
import { auth } from '@/auth';
import { rateLimiters } from '@/lib/rate-limit';
import { getIPFromHeaders } from '@/lib/get-ip';

// Inside the action:
const session = await auth();
if (!session?.user?.id) {
  return { error: 'Unauthorized.' };
}

// Use userId as identifier for authenticated actions
const identifier = `change-password:${session.user.id}`;
const { success } = await rateLimiters.changePassword.limit(identifier);
if (!success) {
  return { error: 'Too many requests. Please try again later.' };
}
```

### 4f — `components/auth/login-form.tsx` (lines 53–89)

**Do NOT add rate limiting here.** This is a client component. The `signIn()` call it makes routes through the NextAuth credentials callback in `auth/auth.ts`, which is already rate limited in step 4a. Adding client-side guards here would be trivially bypassable and provides no real security benefit.

---

## Step 5 — Verify environment variables

Check that `.env` contains the Upstash credentials. They must also be present in Vercel environment variables for production:

```env
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

If the variable names in the project differ from the above, update `lib/rate-limit.ts` accordingly (use explicit `new Redis({ url, token })` instead of `Redis.fromEnv()`).

---

## Step 6 — Manual test checklist

After implementation, verify each endpoint:

- [ ] Trigger login 6 times rapidly with wrong credentials → 6th attempt must be blocked.
- [ ] Trigger register 4 times → 4th attempt must be blocked.
- [ ] Trigger password reset request 4 times → 4th must be blocked.
- [ ] Trigger resend verification 4 times → 4th must be blocked.
- [ ] Trigger change password 6 times → 6th must be blocked.
- [ ] Verify that blocked API Route responses include `Retry-After` header.
- [ ] Verify that blocked Server Action responses return `{ error: '...' }` and the UI displays the message correctly.
- [ ] Verify Upstash dashboard shows analytics data for each prefix after testing.

---

## Common pitfalls to avoid

| Pitfall | Explanation |
|---------|-------------|
| Using `new Map()` for caching on Vercel | Each serverless function instance has isolated memory — the map never persists across requests. Only use Redis. |
| Adding rate limiting to client components | Trivially bypassable. Only enforce server-side. |
| Using IP as identifier for authenticated actions | Prefer `userId` — multiple legitimate users may share an IP (NAT, office networks). |
| Placing the rate limit check after a DB query | The DB query runs before the limit is enforced, wasting resources and leaking timing information. Always check the rate limit first. |
| Forgetting `Retry-After` header on 429 responses | Required by RFC 6585 and helps clients back off gracefully. Always include it in API Route responses. |
