# Auth Security Review

**Last audit:** 2026-06-13
**Scope:** Full authentication/authorization code (NextAuth v5 beta, bcryptjs, Prisma/Postgres)
**Auditor:** security-review Agent

## Summary

The authentication system is **well-architected** overall. Token handling, password hashing, and session validation are implemented correctly. The code avoids almost all common pitfalls: no plaintext token storage, consistent anti-enumeration on login/reset flows, and proper use of bcrypt over raw SHA for passwords.

Three real issues were found: **no rate limiting anywhere** (the most impactful), **email enumeration on the register endpoint**, and **JWT sessions not invalidated on password change** (architecture limitation). The rest are minor inconsistencies and recommended hardening.

## Passed Checks

- **Password hashing** — bcryptjs v3 with cost factors 10–12. The `compare()` function provides constant-time verification. `auth/auth.ts:33` uses cost 12 for OAuth fallback passwords; `actions/auth/change-password.ts:64` uses cost 12; `app/api/auth/register/route.ts:82` and `lib/auth/password-reset.ts:135` use cost 10. Verified: `bcryptjs@^3.0.3` in `package.json`.

- **Token generation** — Both email verification and password-reset tokens use `randomBytes(32)` (256-bit CSPRNG) via `node:crypto`. `lib/auth/email-verification.ts:56`, `lib/auth/password-reset.ts:44`.

- **Token storage** — All tokens are SHA-256 hashed before persisting to the database (`lib/auth/email-verification.ts:29-30`, `lib/auth/password-reset.ts:26-27`). The raw token is never stored. Collision/pre-image risk is negligible because the pre-image is a 256-bit random value.

- **Token expiration** — Verification tokens expire in 24 hours (`lib/auth/email-verification.ts:13`); password-reset tokens in 1 hour (`lib/auth/password-reset.ts:14`). Expired tokens are cleaned up on read.

- **Token single-use + rollback** — Both `createEmailVerificationToken` and `createPasswordResetToken` use `$transaction` to `deleteMany` existing tokens before inserting new ones, ensuring O(N-1) invalidation. The verify/consume functions also delete the token after successful use.

- **Anti-enumeration on login** — `auth/auth.ts:77-79` returns `null` for both "user not found" and "wrong password", giving no indication of which. This is the correct pattern.

- **Anti-enumeration on password reset** — `lib/auth/password-reset.ts:71-76` returns `FORGOT_PASSWORD_SUCCESS_MESSAGE` regardless of whether the email exists. Same for `resendVerificationEmail` in `lib/auth/email-verification.ts:168-172`.

- **Server-side password policy enforcement** — `app/api/auth/register/route.ts:64` calls `isValidPassword()` server-side. The same validation is duplicated in `actions/auth/change-password.ts:45-48` and `actions/auth/reset-password.ts:30-34`. Policy is never client-side only.

- **Email normalization** — Both registration and verification flows call `normalizeEmail` (`trim().toLowerCase()`) consistently server-side.

- **Session validation in change-password** — `actions/auth/change-password.ts:19-22` calls `auth()` and rejects unauthenticated requests before any password operation. The subsequent user lookup is scoped to `session.user.id`.

- **No logging of secrets** — Zero `console.log`, `console.error`, `console.warn`, or `console.debug` statements exist across all audited files. No accidental inclusion of passwords or tokens in error messages.

- **Proxy/middleware protection** — `proxy.ts:14` redirects unauthenticated requests for `/profile` and `/dashboard` to `/login`. The profile page (`app/profile/page.tsx`) has a defense-in-depth null return if `session.user.id` is missing.

- **NextAuth OAuth/CSRF/Cookie handling** — Not audited (assumed handled by the library). Scope explicitly excludes this.

- **Error messages in password-reset/resend flows** — Consistently use generic messages that do not reveal user existence.

- **GitHub credential substitution in adapter** — `auth/auth.ts:29-36` handles OAuth users gracefully by assigning a random bcrypt hash as password, protecting the Credentials provider from leaking that no password exists.

## Findings

### [HIGH] — No rate limiting on any auth endpoint

**Files:**

- `auth/auth.ts:50-97` (credentials login)
- `app/api/auth/register/route.ts:37-121` (registration)
- `actions/auth/request-password-reset.ts:15-41` (request password reset)
- `actions/auth/resend-verification.ts:18-44` (resend verification email)
- `actions/auth/change-password.ts:15-76` (change password)
- `components/auth/login-form.tsx:53-89` (client-side signIn call)

**Issue:** None of the authentication endpoints implement any form of rate limiting. An attacker can:

- Brute-force credentials login at full speed (bcrypt cost 10-12 slows per-attempt to ~100-200ms, but that is not enough to stop a sustained attack).
- Perform password spraying across many accounts.
- Flood a user with password-reset emails or verification resends (both consume third-party email API quota).
- Attack the registration endpoint to discover valid emails (see next finding).

**Risk:** HIGH. Without rate limiting, the only protection against brute force is bcrypt's computational cost. At cost 10, an attacker can still attempt ~10 passwords/second on a single core, and much more with parallel requests. Password spraying (trying `Password123!` against 10,000 accounts) would complete in minutes.

**Fix:** Implement rate limiting on all auth endpoints. For a Next.js App Router app, options include:

- Middleware-based rate limiting using an in-memory store (e.g., `@upstash/ratelimit` with Redis/Upstash).
- Database-level tracking of failed attempts per email/IP with exponential backoff.
- CAPTCHA (e.g., Cloudflare Turnstile) on login and register pages.

Example approach with Upstash:

```ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
	redis: Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(5, '60 s'),
	analytics: true
})

export async function POST(request: Request) {
	const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
	const { success } = await ratelimit.limit(ip)
	if (!success) {
		return NextResponse.json({ error: 'Demasiados intentos. Inténtalo más tarde.' }, { status: 429 })
	}
	// ... proceed
}
```

### [MEDIUM] — Email enumeration via registration endpoint

**File:** `app/api/auth/register/route.ts:72-79`

**Issue:** The registration endpoint returns HTTP 409 with the message `"Ya existe una cuenta con ese correo electrónico."` when the email already exists. An attacker can enumerate registered emails by submitting registration requests and checking for 409 vs 201 responses.

**Risk:** MEDIUM. Attackers can build a list of valid user emails, which can be used for targeted phishing or password spraying.

**Fix:** Return the same generic success response regardless of whether the email is new or already registered. The `isUniqueConstraintError` catch block (line 114-117) also needs the same treatment.

```ts
// Remove the explicit existingUser check (lines 72-79)
// In the try-catch, handle P2002 by returning the same 201 response
// as a successful registration, minus sending the verification email.
// The user experience: they submit the form and always see "check your email".
```

Note: This introduces a trade-off — legitimate users registering with a known email won't get an inline error message. The alternative is to keep the 409 but accept the enumeration risk, which is a product decision.

### [MEDIUM] — JWT sessions not invalidated on password change

**Files:**

- `auth/auth.ts:110-112` (JWT session strategy)
- `actions/auth/change-password.ts:64-69` (password update)
- `lib/auth/password-reset.ts:138-149` (password reset via token)

**Issue:** The app uses JWT session strategy (`auth/auth.ts:111`). When a user changes their password — either through the profile form or via a password reset — existing JWT tokens are not invalidated. An attacker who has compromised a JWT retains access until the token expires (NextAuth v5 default JWT expiry is 30 days without `maxAge` configured).

**Risk:** MEDIUM. If a session JWT is stolen (e.g., XSS, device compromise, compromised middleware), changing the password does not revoke the stolen token. This is a well-known architectural limitation of JWT-based sessions.

**Fix Options (trade-offs noted):**

1. **Switch to database session strategy** (`session: { strategy: 'database' }`) — this allows instant invalidation. Required change:

   ```ts
   // auth/auth.ts
   session: {
   	strategy: 'database'
   }
   ```

   And add a `tokenVersion` or `lastPasswordChange` field to the user model, checked in the `session` callback. This adds a DB read per request.

2. **Add a JWT token version** — add `tokenVersion: number` to the User model, include it in the JWT, and increment it on password change. Check it in the `jwt` callback:

   ```ts
   callbacks: {
     async jwt({ token, user }) {
       if (user) { token.tokenVersion = user.tokenVersion }
       return token
     },
     async session({ session, token }) {
       const dbUser = await prisma.user.findUnique({ where: { id: token.sub }, select: { tokenVersion: true } })
       if (!dbUser || token.tokenVersion !== dbUser.tokenVersion) {
         throw new Error('Session invalidated')
       }
       return session
     }
   }
   ```

3. **Shorten JWT `maxAge`** — reduce to 1 hour and add refresh token rotation. Mitigates but does not solve the issue.

## Recommendations (non-critical)

### R1 — Inconsistent bcrypt cost factor

**Files:** `app/api/auth/register/route.ts:82` uses cost 10, `lib/auth/password-reset.ts:135` uses cost 10, `auth/auth.ts:33` and `actions/auth/change-password.ts:64` use cost 12.

The inconsistency means password-reset users get a weaker hash than profile-change users. Standardise on cost 12 across all flows. Cost 12 takes ~250ms on modern hardware — still acceptable for UX and significantly harder to crack.

### R2 — Weak password policy

**File:** `lib/auth/password-policy.ts:7`

The regex `^(?=.*[0-9\W_]).{8,}$` requires only 8+ chars with at least one digit or symbol. No uppercase or lowercase requirement. Consider `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9\W_]).{8,}$` to require all three character classes. This aligns with NIST SP 800-63B guidelines (though they recommend 8+ minimum without composition rules; the current policy is a hybrid that adds a composition rule but a weak one).

### R3 — `hasPassword` logic incorrect for hybrid-auth users

**File:** `lib/db/profile.ts:41-49`

The `hasPassword` flag is derived from `account === null`. If a user registered with email/password and later linked a GitHub account, they would have both a password and an Account record, making `hasPassword = false`. The "Change Password" button would disappear from their profile. They would still be able to change their password through the "forgot password" flow.

Fix: query for a non-empty `password` field directly, or check that no Credentials-type account exists rather than the absence of any account.

```ts
const hasPassword = !!(
	await prisma.user.findUnique({
		where: { id: userId },
		select: { password: true }
	})
)?.password
```

### R4 — Password reset flow allows OAuth users to set a password without explicit confirmation

**Files:** `lib/auth/password-reset.ts:64-101`, `prisma/schema.prisma:14`

OAuth users (GitHub) have a password field populated with `hash(randomUUID(), 12)`. If someone requests a password reset for an OAuth-only user's email, they receive the reset link and can set a password — effectively converting their account to support credentials login. The email is sent to the owner's inbox, so an attacker cannot intercept it. However, this changes the account's security model (password-based login is now possible) without explicit user intent.

Consider checking if the user has a credentials Account record before allowing password reset, or add an explicit opt-in.

### R5 — SHA-256 token hashing is acceptable but HMAC would be more conventional

**Files:** `lib/auth/email-verification.ts:29-30`, `lib/auth/password-reset.ts:26-27`

SHA-256 without salt is used to hash tokens before storage. Because the input is a 256-bit CSPRNG value, the risk of pre-image or rainbow attacks is negligible. No change needed, but HMAC-SHA256 with a server-side secret key (`createHmac('sha256', SECRET)`) would follow the more conventional pattern for token hashing.

### R6 — No cleanup of expired tokens

**Files:** `prisma/schema.prisma:31-38`, `prisma/schema.prisma:40-49`

Both `EmailVerificationToken` and `PasswordResetToken` models have `@@index([expiresAt])`, but there is no periodic cleanup job for expired tokens. Tokens are only cleaned up on read (when a user clicks an expired link). In high-traffic scenarios, the tables can accumulate stale rows. Consider adding a scheduled cleanup (e.g., a cron job or a Vercel Cron Job running `DELETE FROM EmailVerificationToken WHERE expiresAt < NOW()`).

### R7 — Token in URL query string for email verification

**Files:** `app/verify-email/page.tsx`, `lib/auth/email-verification.ts:33-37`

The verification token is passed as a URL query parameter. URLs may be logged by email clients, corporate proxies, and analytics tools. This is the standard approach for email verification links and is difficult to avoid, but worth awareness. Users should consider custom email link tracking as a token leakage vector.
