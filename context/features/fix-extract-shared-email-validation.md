# Code Agent Instructions: Extract Shared Email Validation Helper

## Goal

Fix duplicated email validation and normalization logic across auth forms, server actions, and API routes.

Create a single shared helper:

```text
lib/validation/email.ts
```

## Issue

The same email regex and normalization logic is duplicated in several files:

```text
components/auth/register-form.tsx:40
actions/auth/request-password-reset.ts:14-16
actions/auth/resend-verification.ts:17-19
app/api/auth/register/route.ts:27-29
```

This creates maintainability risk and inconsistent validation behavior.

## Required Change

Create a shared email validation module:

```text
lib/validation/email.ts
```

It should export at least:

```ts
export function normalizeEmail(email: string): string
export function isValidEmail(email: string): boolean
```

Recommended behavior:

- `normalizeEmail(email)`:
  - trims whitespace
  - converts to lowercase

- `isValidEmail(email)`:
  - normalizes the email before validation
  - returns `true` only for valid email strings
  - uses the same regex currently duplicated in the project, unless there is a clear reason to improve it

Optional helper if it improves call sites:

```ts
export function parseEmail(email: string): { success: true; email: string } | { success: false; error: string }
```

## Files to Update

Replace duplicated regex/normalization logic in:

```text
components/auth/register-form.tsx
actions/auth/request-password-reset.ts
actions/auth/resend-verification.ts
app/api/auth/register/route.ts
```

Use the shared helper instead of local regex definitions.

## Requirements

- Preserve existing user-facing validation messages.
- Do not change auth behavior except centralizing validation.
- Keep the helper usable from both client and server code.
- Do not import server-only modules into `lib/validation/email.ts`.
- Do not expose secrets or auth internals.
- Avoid adding dependencies for this small helper.

## Testing

Verify:

- Registration still rejects invalid emails.
- Registration still normalizes emails before saving.
- Password reset still normalizes and validates emails.
- Resend verification still normalizes and validates emails.
- API registration route still validates emails.
- Existing Spanish validation messages still appear as before.

## Acceptance Criteria

- `lib/validation/email.ts` exists.
- Email regex is no longer duplicated in the listed files.
- Email normalization is centralized.
- Client and server code use the same helper.
- Existing auth flows still work.
- Code passes lint, typecheck, and build.
