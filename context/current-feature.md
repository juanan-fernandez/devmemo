# auth-1-spec

# Current Feature

Auth Setup - NextAuth + GitHub Provider

## Status

In Progress

## Goals

- Set up NextAuth v5 with Prisma adapter and GitHub OAuth.
- Use NextAuth default pages for testing.
- Install `next-auth@beta` and `@auth/prisma-adapter`.
- Set up the split auth config pattern for edge compatibility.
- Add the GitHub OAuth provider.
- Protect `/dashboard/*` routes using Next.js 16 `proxy.ts`.
- Redirect unauthenticated users to sign-in.
- Create these files:
  - `auth/auth.config.ts` — edge-compatible config (providers only, no adapter)
  - `auth/auth.ts` — full config with Prisma adapter and JWT strategy
  - `app/api/auth/[...nextauth]/route.ts` — export handlers from `auth.ts`
  - `proxy.ts` — route protection with redirect logic
  - `auth/next-auth.d.ts` — extend `Session` type with `user.id`

## Notes

- Reference spec: `@context/features/auth-1-spec.md`
- Use Context7 to verify the newest NextAuth/Auth.js config and conventions.
- Important gotchas:
  - use `next-auth@beta` (not `@latest`)
  - the proxy file must live at `proxy.ts` at repo root level
  - use named export: `export const proxy = auth(...)`
  - use `session: { strategy: 'jwt' }` with the split config pattern
  - do not set custom `pages.signIn`; use the default NextAuth page
- Required environment variables:
  - `AUTH_SECRET`
  - `AUTH_GITHUB_ID`
  - `AUTH_GITHUB_SECRET`
- Testing target:
  1. Visit `/dashboard` and confirm redirect to sign-in
  2. Click “Sign in with GitHub”
  3. Verify redirect back to `/dashboard` after auth
- References:
  - Edge compatibility: https://authjs.dev/getting-started/installation#edge-compatibility
  - Prisma adapter: https://authjs.dev/getting-started/adapters/prisma

## History

<!-- refers to the file @context/history.md -->
