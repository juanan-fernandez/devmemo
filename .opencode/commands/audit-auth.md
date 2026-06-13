---
description: "Spawns a sub-agent to audit all auth-related code for security issues NextAuth does NOT handle automatically. Writes findings to docs/audit-results/AUTH_SECURITY_REVIEW.md. Usage: /audit-auth"
---

You are a senior application security engineer specializing in Next.js authentication systems.
Spawn a sub-agent and instruct it to perform the steps below in order.

---

## Phase 1 — File discovery

Use **Glob** to locate all files relevant to authentication. Cast a wide net:

- `**/auth/**/*.{ts,tsx,js,jsx}`
- `**/actions/auth*.{ts,tsx,js,jsx}`
- `**/actions/*password*.{ts,tsx,js,jsx}`
- `**/actions/*email*.{ts,tsx,js,jsx}`
- `**/actions/*token*.{ts,tsx,js,jsx}`
- `**/app/**/login/**/*.{ts,tsx}`
- `**/app/**/register/**/*.{ts,tsx}`
- `**/app/**/verify*/**/*.{ts,tsx}`
- `**/app/**/reset*/**/*.{ts,tsx}`
- `**/app/**/forgot*/**/*.{ts,tsx}`
- `**/app/**/profile/**/*.{ts,tsx}`
- `**/middleware.ts`
- `**/lib/prisma.ts`
- `auth.ts`
- `auth.config.ts`
- `**/prisma/schema.prisma`
- `.env` (read for key names only — never log values)

Use **Read** to open every file found before drawing any conclusions.

---

## Phase 2 — Targeted security checks

For each check below, use **Grep** to find patterns, then **Read** the full surrounding context before deciding if an issue is real. Do NOT report a finding based on a grep match alone.

**If you are unsure whether something is a genuine vulnerability in the context of Next.js App Router + NextAuth v5 + Prisma, use web search to verify before including it.**

---

### ✅ Scope — What NextAuth v5 already handles (do NOT flag these)

- CSRF protection on sign-in/sign-out endpoints
- `HttpOnly`, `Secure`, and `SameSite` flags on session cookies
- OAuth `state` parameter validation
- Session token rotation on sign-in
- JWT signature verification (when using JWT strategy)

Only audit what the application code is responsible for.

---

### 🔐 A — Password hashing

- Grep for any call that stores or compares passwords: `password`, `hash`, `bcrypt`, `argon`, `scrypt`, `crypto`.
- Verify that passwords are **never stored in plain text**.
- Verify that a strong hashing algorithm is used: `bcrypt` (cost ≥ 12), `argon2id`, or `scrypt`. Flag `MD5`, `SHA-1`, `SHA-256` used directly for password hashing.
- Verify that password comparison uses a **timing-safe** method (`bcrypt.compare`, `argon2.verify`) and not `===` or `==`.
- Check that the **plain-text password is never logged** at any point before or after hashing.

---

### 🚦 B — Rate limiting & brute-force protection

- Check login, registration, email verification, and password reset endpoints/actions for rate limiting.
- Look for any use of an in-memory store, Redis, Upstash, or a middleware-level rate limiter.
- Flag any of these endpoints that have **no rate limiting at all**.
- Note: NextAuth does not provide rate limiting out of the box — this is always the app's responsibility.

---

### 📧 C — Email verification flow

- Locate where verification tokens are **generated**. Verify that `crypto.randomBytes(32)` or equivalent CSPRNG is used. Flag `Math.random()` or any non-cryptographic source.
- Verify tokens are **hashed before storage** (e.g. `SHA-256` of the raw token stored in DB; raw token sent in email). Flag tokens stored in plain text.
- Verify that tokens have an **expiry** stored in the database and that it is enforced on use.
- Verify that used tokens are **deleted or invalidated immediately** after successful verification.
- Check that the verification endpoint does not leak whether an email exists via different error messages (user enumeration).
- Check that the verification link uses `HTTPS` in production (look for hardcoded `http://`).

---

### 🔑 D — Password reset flow

- Locate where reset tokens are generated. Apply the same CSPRNG check as section C.
- Verify tokens are **hashed before storage**; raw token sent in email only.
- Verify tokens have a **short expiry** (≤ 1 hour is best practice). Flag expirations longer than 24 hours.
- Verify **single-use enforcement**: the token must be deleted or marked used immediately when the password is reset, before the success response is returned.
- Check for a **race condition**: if the token is validated and then deleted in two separate DB calls without a transaction, flag it.
- Verify that after a successful reset, **all existing sessions for that user are invalidated** (not just the current one).
- Check that the reset endpoint does not confirm whether an email exists (user enumeration).

---

### 👤 E — Profile page & session validation

- Locate the profile page server component and any server actions it uses.
- Verify that `auth()` (or equivalent NextAuth session getter) is called **server-side** at the top of the component/action, not just in middleware.
- Verify that the `userId` used to fetch or update the profile comes from the **session**, not from a user-supplied input (e.g. a form field or URL parameter).
- Check that profile update actions validate **ownership**: the record being updated must belong to the authenticated user.
- Check for **mass assignment**: ensure that sensitive fields (`role`, `emailVerified`, `id`) cannot be overwritten by a user-supplied payload.
- Verify that email changes trigger **re-verification** before the new email is activated.
- Verify that password changes require the user to supply the **current password** before setting a new one.

---

### 🛡️ F — Token storage & transmission

- Grep for tokens or secrets stored in `localStorage`, `sessionStorage`, or cookies without `HttpOnly`.
- Grep for tokens or secrets appearing in URL query parameters in client-side navigation where they would appear in browser history. Email links using `?token=` for reset/verification are acceptable — flag client-side exposure only.
- Check that `.env` values for `AUTH_SECRET`, `AUTH_GITHUB_SECRET`, `RESEND_API_KEY` etc. are never interpolated into client-side bundles (`'use client'` files or `NEXT_PUBLIC_` prefixed vars).

---

### 🧱 G — General hardening

- Check that **server actions** performing sensitive operations (`'use server'`) validate the session at the start and return early if unauthenticated.
- Check for **verbose error messages** in catch blocks that could expose stack traces or internal details to the client.
- Check that Prisma queries in auth flows use `select` to return **only the fields needed** (avoid returning the full user record including password hash to the client).
- Check the middleware matcher for **route coverage gaps**: protected routes under `/dashboard` that may have sub-paths not covered.

---

## Phase 3 — Verify before reporting

Before writing any finding, the sub-agent must:

1. Re-read the full function or block in context.
2. Confirm the issue is reachable in normal application flow.
3. If uncertain about NextAuth v5 behavior, web search the specific behavior.
4. Discard false positives. It is better to miss a low-severity issue than to report a non-issue.

---

## Phase 4 — Write the report

Use **Write** to create the file at `docs/audit-results/AUTH_SECURITY_REVIEW.md` (create the `docs/audit-results/` folder if it does not exist). Overwrite the file completely if it already exists.

The report must follow this structure exactly:

```markdown
# Auth Security Review

**Last audit:** YYYY-MM-DD HH:MM UTC  
**Auditor:** OpenCode sub-agent  
**Scope:** NextAuth v5 · Credentials + GitHub · Email verification · Password reset · Profile page

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | N |
| 🟠 High | N |
| 🟡 Medium | N |
| 🔵 Low / Informational | N |
| ✅ Passed checks | N |

---

## Findings

### FINDING-001 · [Severity emoji] [Severity label]

**Category:** [A–G from the checklist above]  
**File:** `path/to/file.ts` · Line N  
**Description:** Clear explanation of the issue and why it is a problem.  
**Evidence:** The specific code pattern or value that triggered this finding.  
**Fix:** Concrete, actionable recommendation with a code example where helpful.

<!-- repeat FINDING block for each issue found -->

---

## Passed Checks

List each check from the audit checklist that was examined and found to be correctly implemented.
Be specific — name the file and function where the correct behavior was confirmed.

- ✅ **Password hashing** — bcrypt with cost factor 12 confirmed in `lib/actions/auth.ts · hashPassword()`
- ✅ ...

---

## Out of scope

The following were intentionally not audited because NextAuth v5 handles them automatically:

- CSRF protection
- Cookie security flags (HttpOnly, Secure, SameSite)
- OAuth state parameter validation
- Session token rotation
```

---

Do not modify any source files. This command is read-only analysis. All output goes to `docs/audit-results/AUTH_SECURITY_REVIEW.md` only.
