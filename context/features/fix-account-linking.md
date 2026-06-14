# Bug Fix: Allow GitHub sign-in for users registered with email/password

## Problem

When a user registers with email and password, attempting to sign in with GitHub using the same email address throws an `OAuthAccountNotLinked` error. NextAuth v5 blocks this by default to prevent account takeover between arbitrary providers.

In this case the fix is safe: GitHub verifies email ownership before granting OAuth access, so linking a GitHub account to an existing credentials account on matching email is not a security risk.

---

## Fix — one line change in `auth.config.ts`

Open `auth.config.ts` and add `allowDangerousEmailAccountLinking: true` to the GitHub provider:

```ts
// Before
GitHub

// After
GitHub({ allowDangerousEmailAccountLinking: true })
```

Full providers array in context:

```ts
import GitHub from 'next-auth/providers/github';

export const authConfig = {
  providers: [
    GitHub({ allowDangerousEmailAccountLinking: true }),
    // ...Credentials and any other providers
  ],
  // rest of config unchanged
};
```

This tells NextAuth to automatically link the incoming GitHub account to the existing user record that shares the same verified email, instead of throwing `OAuthAccountNotLinked`.

> **Why `allowDangerousEmailAccountLinking` is safe here:**
> GitHub guarantees that the email returned in the OAuth profile belongs to and has been verified by the authenticating user. The "dangerous" label in the flag name refers to untrusted providers that do not verify emails — GitHub is not one of them.

---

## What this does NOT change

- Existing sessions are unaffected.
- Users who registered with GitHub continue to sign in with GitHub as before.
- The credentials (email/password) login flow is unchanged.
- No database migration is needed — NextAuth will create a new `Account` row in the `accounts` table linking the GitHub provider to the existing `User` record the first time the user signs in with GitHub.

---
