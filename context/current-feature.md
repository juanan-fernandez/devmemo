# fix-extract-shared-email-validation

# Current Feature

<!-- Extract Shared Email Validation Helper -->

## Status

In Progress

## Goals

- Fix duplicated email validation and normalization logic across auth forms, server actions, and API routes.
- Create a single shared helper at `lib/validation/email.ts` exporting `normalizeEmail(email)` and `isValidEmail(email)`.
- Replace duplicated regex/normalization logic in:
  - `components/auth/register-form.tsx`
  - `actions/auth/request-password-reset.ts`
  - `actions/auth/resend-verification.ts`
  - `app/api/auth/register/route.ts`
- Preserve existing user-facing validation messages and auth behavior.
- Keep the helper usable from both client and server code without importing server-only modules.

## Notes

- Affected files (per spec):
  - `components/auth/register-form.tsx:40`
  - `actions/auth/request-password-reset.ts:14-16`
  - `actions/auth/resend-verification.ts:17-19`
  - `app/api/auth/register/route.ts:27-29`
- Recommended behavior:
  - `normalizeEmail(email)`: trims whitespace and converts to lowercase.
  - `isValidEmail(email)`: normalizes the email before validation and returns `true` only for valid email strings using the existing project regex.
- Optional helper: `parseEmail(email)` returning `{ success: true; email: string } | { success: false; error: string }` if it improves call sites.
- Acceptance criteria include lint, typecheck, and build passing.

## History

<!-- refers to the file @context/history.md -->
