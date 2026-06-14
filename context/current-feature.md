# fix-account-linking

# Current Feature

<!-- Feature Name -->

## Status

In Progress

## Goals

- Fix the `OAuthAccountNotLinked` error when a user registered with email/password later tries to sign in with GitHub using the same email address.
- Update the GitHub provider configuration so NextAuth automatically links the GitHub account to the existing user when the email matches.
- Implement the change by adding `allowDangerousEmailAccountLinking: true` to the GitHub provider configuration.
- Keep the rest of the authentication configuration unchanged.
- Avoid any database migration; rely on NextAuth to create the `Account` row on first GitHub sign-in.
- Keep existing sessions unaffected.
- Keep the credentials login flow unchanged.

## Notes

- Source spec: `context/features/fix-account-linking.md`.
- The first H1 sets the branch seed to `fix-account-linking`.
- The requested code change is intentionally small and focused: one-line provider configuration change in the auth config file.
- The spec explicitly considers this safe for GitHub because GitHub returns verified email ownership for the authenticating user.
- Relevant file called out by the spec: `auth.config.ts` (in this repo the auth split config lives under `auth/auth.config.ts`).
- No database migration should be introduced for this fix.

## History

<!-- refers to the file @context/history.md -->
