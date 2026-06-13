# profile-page-spec

# Current Feature

Profile Page and Change Password

## Status

In Progress

## Goals

- Create a protected `/profile` page with user info card and usage statistics.
- Build a reusable `Avatar` component (GitHub image → initials → email fallback).
- Show name, email, registration date, and avatar in the user info card.
- Add Change password button (visible only for email/password users).
- Implement change password form with current password, new password, confirm — using Server Actions.
- Reuse existing password policy (`lib/auth/password-policy.ts`) and hashing (bcrypt).
- Password inputs: hidden by default, eye icon toggle, Spanish messages.
- Validate current password before updating; show Spanish success message.
- Add Delete account button (disabled/placeholder — no real deletion).
- Add Usage Statistics card: total items, total collections, item count by type.
- Use icons and colors from the existing shared helpers (`lib/item-types.ts`, `lib/item-type-icons.tsx`).
- Use existing Prisma models and data access; only the authenticated user's data.
- Protect `/profile` with existing auth middleware/proxy.
- Pass lint, typecheck, and build.

## Notes

- Reference spec: `@context/features/profile-page-spec.md`
- App stack: Next.js 16, Auth.js / NextAuth v5, Prisma, Supabase Postgres, Tailwind CSS v4.
- Existing shared helpers: `lib/item-types.ts`, `lib/item-type-icons.tsx`, `lib/mockdata.ts`.
- Auth pages already exist: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`.
- A link to `/profile` already exists in the sidebar user profile component.
- Do NOT implement account deletion yet — button must be placeholder/disabled.
- The `Change password` section should reuse patterns from `reset-password-form.tsx` and `lib/auth/password-policy.ts` without duplicating logic.
- Suggested Spanish copy for change password:
   - `Cambiar contraseña`, `Contraseña actual`, `Nueva contraseña`, `Confirmar nueva contraseña`
   - `La contraseña debe tener al menos 8 caracteres e incluir números y/o símbolos.`
   - `Las contraseñas no coinciden.`
   - `La contraseña actual no es correcta.`
   - `Tu contraseña se ha actualizado correctamente.`
- Registration date: use `User.createdAt` from Prisma.
- Usage stats: count items, collections, and group by item type for the authenticated user.
- To determine email/password user: check if user has an Account record with `provider === "credentials"` in the Prisma Account model.

## History

<!-- refers to the file @context/history.md -->
