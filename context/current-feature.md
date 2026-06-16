# fix-protected-routes-redirect-spec

# Current Feature

<!-- Fix Protected Routes Redirect -->

## Status

Tested

## Goals

- Fix the security issue where protected routes call `auth()` but do not redirect unauthenticated users.
- Ensure `/dashboard`, `/dashboard/*`, `/items/*`, and `/profile` redirect to `/login` when there is no active session.
- Replace current behavior (rendering empty states or returning `null`) with explicit server-side `redirect('/login')` in protected Server Components and layouts.
- Keep server-side checks in protected pages/layouts as defense in depth, even if proxy/middleware exists.
- Preserve existing page behavior for authenticated users.
- Optionally update/improve `proxy.ts` route protection with matcher for `/dashboard/:path*`, `/items/:path*`, and `/profile` if it fits the existing Auth.js setup.
- Code must pass lint, typecheck, and build.

## Notes

- Affected files (per spec): `app/dashboard/layout.ts`, `app/dashboard/page.tsx`, `app/items/[type]/page.tsx`, `app/profile/page.tsx`.
- Import path for `auth` must match the current project structure (`@/auth/auth`).
- Example pattern: `const session = await auth(); if (!session?.user?.id) redirect('/login');`
- Do not return `null` for missing sessions and do not show empty/private states to unauthenticated users.
- Middleware/proxy improvement is optional and should only be applied if compatible with NextAuth v5.

## History

<!-- refers to the file @context/history.md -->
