# auth-3-spec

# Current Feature

Authentication UI: Login, Register, Sidebar Profile

## Status

In Progress

## Goals

- Replace the default NextAuth pages with custom authentication UI.
- Create `app/login/page.tsx` as a modern, responsive custom login page.
- Include GitHub OAuth login and Email/Password login on the custom login page.
- Add Email input, Password input, and submit button labeled `Iniciar sesión`.
- Add links to `/forgot-password` and `/register` on the login page.
- Read NextAuth error query params (such as `?error=CredentialsSignin`) and show friendly Spanish messages.
- Create `app/register/page.tsx` as a custom registration page using `/api/auth/register`.
- Add inputs for Nombre, Correo electrónico, Contraseña, and Confirmar contraseña.
- Add client-side validation for matching passwords and minimum 8 characters, with inline Spanish errors.
- Submit registration via `POST` to `/api/auth/register` using JSON.
- On successful registration, redirect to `/login` (optionally with a success query param).
- On API errors (such as 409 Conflict), show friendly Spanish messages.
- Create avatar logic for sidebar user display.
- Show `session.user.image` when available for GitHub users.
- Fall back to user initials when there is no image.
- Create a `UserProfile` component that groups avatar, name, and email.
- Wrap user info in a link to `/profile`.
- Add a visible `Cerrar sesión` action below the user info.
- Trigger the NextAuth sign-out flow from the logout action.
- Integrate the new `UserProfile` component at the bottom of the existing sidebar.
- Ensure forms include proper accessibility attributes and loading states.
- Keep ALL user-facing text, labels, and error messages in Spanish.

## Notes

- Reference spec: `@context/features/auth-3-spec.md`
- App uses Next.js App Router, NextAuth v5 (GitHub + Credentials), and Tailwind CSS.
- Login page path required by the spec: `app/login/page.tsx`.
- Register page path required by the spec: `app/register/page.tsx`.
- Registration page must use the existing `/api/auth/register` endpoint.
- Friendly error mapping example for `CredentialsSignin`: `Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.`
- Avatar fallback examples:
  - `JUAN FERNANDEZ` -> `JF`
  - `Juan` -> `J`
- Sidebar user profile should link to `/profile` and expose `Cerrar sesión` clearly.
- Sign-out can use a server action or client-side `signOut()` depending on the architecture.
- Accessibility and loading states are required for the forms.
- Testing targets:
  1. Go to `/sign-in` and verify the custom page renders.
  2. Sign in with GitHub and verify the flow works.
  3. Sign in with email/password and verify the flow works.
  4. Verify avatar shows in top bar/sidebar using GitHub image or initials fallback.
  5. Click avatar and verify dropdown appears.
  6. Click `Sign out` and verify logout and redirect.
  7. Go to `/register`, create account, and verify redirect to sign-in.

## History

<!-- refers to the file @context/history.md -->
