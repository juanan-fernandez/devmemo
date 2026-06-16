# Code Agent Instructions: Fix Protected Routes Redirect

## Goal

Fix a security issue where protected routes call `auth()` but do not redirect unauthenticated users.

Currently, some private routes render empty states or return `null` when there is no session. They must redirect unauthenticated visitors to `/login`.

## Affected Files

Review and fix these files:

```text
app/dashboard/layout.ts
app/dashboard/page.tsx
app/items/[type]/page.tsx
app/profile/page.tsx
```

Reported lines:

```text
app/dashboard/layout.ts:12-13
app/dashboard/page.tsx:17-18
app/items/[type]/page.tsx:24-29
app/profile/page.tsx:10-15
```

## Issue

These routes call `auth()` but do not enforce authentication correctly.

Current behavior:

- `/dashboard` may render an empty state.
- `/items/[type]` may return `null`.
- `/profile` may return `null`.

Expected behavior:

- If `session?.user?.id` is missing, redirect the user to `/login`.
- Private pages must never render private UI or silently return `null` for unauthenticated visitors.

## Required Fix

Use explicit server-side redirects in protected server components/layouts.

Example pattern:

```ts
import { redirect } from "next/navigation"
import { auth } from "@/auth/auth"

const session = await auth()

if (!session?.user?.id) {
  redirect("/login")
}
```

Adjust the import path for `auth` according to the current project structure.

## Route Protection Scope

Ensure these routes are protected:

```text
/dashboard
/dashboard/*
/items/*
/profile
```

If the project already uses `proxy.ts` or `middleware.ts`, verify it protects these private segments too.

Even if proxy/middleware exists, keep server-side checks in the protected pages/layouts as defense in depth.

## Implementation Notes

- Prefer protecting at the highest shared layout when possible.
- If `app/dashboard/layout.ts` wraps all private dashboard pages, put the main check there.
- Still check standalone private routes that are not covered by that layout.
- Do not return `null` for missing sessions.
- Do not show empty states to unauthenticated users.
- Do not redirect authenticated users.
- Preserve existing page behavior for authenticated users.

## Optional Middleware/Proxy Improvement

If the project does not already protect private paths globally, consider adding or updating route protection.

For Next.js 16, use `proxy.ts`.

Matcher suggestion:

```ts
export const config = {
  matcher: ["/dashboard/:path*", "/items/:path*", "/profile"],
}
```

Only add this if it fits the existing Auth.js / NextAuth v5 setup and does not conflict with current auth configuration.

## Acceptance Criteria

- Visiting `/dashboard` while logged out redirects to `/login`.
- Visiting any `/dashboard/*` route while logged out redirects to `/login`.
- Visiting `/items/[type]` while logged out redirects to `/login`.
- Visiting `/profile` while logged out redirects to `/login`.
- Authenticated users can still access all protected routes.
- No protected route returns `null` for unauthenticated users.
- No protected route renders an empty/private state for unauthenticated users.
- Code passes lint, typecheck, and build.
