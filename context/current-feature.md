# email-verification-spec

# Current Feature

Email Verification with Resend

## Status

In Progress

## Goals

- Implement email verification for users who register with email/password or local credentials.
- Prioritize Server Actions for registration, token creation, email sending, verification, and resend flows.
- Send verification emails using Resend with `RESEND_API_KEY` from server-side environment variables only.
- Use `APP_URL` to build absolute verification links.
- Inspect the Prisma schema and reuse `User.emailVerified` if present.
- Add a suitable verification token model if one does not already exist.
- Store only hashed verification tokens.
- Invalidate previous tokens for the same email when issuing a new one.
- Make tokens single-use and expiring, with a reasonable duration such as 24 hours.
- After registration, create the user with `emailVerified: null`.
- After registration, send a verification email and return a Spanish confirmation message.
- Do not automatically sign in users after registration.
- Create a verification route/page such as `/verify-email?token=<raw-token>`.
- When the user visits the verification link, validate the token, update `User.emailVerified`, and delete the used token.
- Show Spanish success and error messages for the verification flow.
- Block login for unverified credentials users.
- Keep GitHub OAuth users out of this blocking rule unless explicitly required.
- Add a safe resend-verification flow if feasible, without leaking whether the email exists.
- Add `RESEND_API_KEY`, `EMAIL_FROM`, and `APP_URL` to `.env.example`.
- Ensure the code passes lint, typecheck/build, and Prisma generate.

## Notes

- Reference spec: `@context/features/email-verification-spec.md`
- Preferred mail utility path: `lib/mail/resend.ts`.
- Required env vars:
  - `RESEND_API_KEY`
  - `EMAIL_FROM`
  - `APP_URL`
- Example production `APP_URL`: `https://devmemo-blond.vercel.app/`
- Example local `APP_URL`: `http://localhost:3000`
- Registration success message must be:
  - `Te hemos enviado un e-mail con un enlace para confirmar la dirección de correo electrónico proporcionada. Revisa tu bandeja de entrada.`
- Verification success message must be:
  - `Tu e-mail ha sido verificado correctamente. Ya puedes iniciar sesión.`
- Verification error message example:
  - `El enlace de verificación no es válido o ha caducado. Solicita un nuevo e-mail de verificación.`
- Unverified login message must be:
  - `Debes verificar tu e-mail antes de iniciar sesión. Revisa tu bandeja de entrada o solicita un nuevo enlace de verificación.`
- Resend subject must be:
  - `Confirma tu e-mail`
- Resend body must be in Spanish and include both HTML and plain text versions.
- Security requirements:
  - never store raw verification tokens
  - never expose `RESEND_API_KEY`
  - never use `NEXT_PUBLIC_` for secrets
  - never log raw tokens, passwords, secrets, or verification URLs
  - avoid email enumeration
- Review current official docs before implementation:
  - Auth.js / NextAuth v5
  - Auth.js Prisma Adapter
  - Auth.js callbacks and split config
  - Resend Node.js SDK
  - Next.js Server Actions
  - Prisma migrations
  - Vercel env vars

## History

<!-- refers to the file @context/history.md -->
