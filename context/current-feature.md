# password-reset-spec

# Current Feature

Password Reset with Resend

## Status

In Progress

## Goals

- Implement a complete password reset flow.
- Make the existing `¿Olvidaste tu contraseña?` link in the login form functional.
- Create a forgot-password page with one email input and Spanish accessible UI.
- Use Server Actions as the preferred approach for requesting reset, creating token, sending email, validating token, updating password, and invalidating used tokens.
- Send reset emails only if the user exists, while always showing a generic success message to avoid enumeration.
- Add a secure single-use password reset token flow with expiration.
- Add a reset-password page with two password fields and eye icons to toggle visibility.
- Keep password fields hidden by default.
- Enforce password rule: at least 8 characters and at least one number or symbol.
- Show password rules and all user-facing messages in Spanish.
- Update the user password using the existing hashing algorithm.
- Ensure old password stops working and new password works after reset.
- Keep existing email verification behavior unchanged.
- Keep GitHub OAuth behavior unchanged.
- Keep secrets server-only and pass lint, build/typecheck, and Prisma generate.

## Notes

- Reference spec: `@context/features/password-reset-spec.md`
- App stack: Next.js, Auth.js / NextAuth v5, Prisma, Supabase Postgres, Resend.
- Existing envs already exist locally and in Vercel:
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `APP_URL`
- Suggested routes from spec:
   - `/forgot-password`
   - `/reset-password?token=<raw-token>`
- Forgot-password Spanish copy:
   - `Recuperar contraseña`
   - `Introduce el e-mail con el que te registraste y te enviaremos un enlace para restablecer tu contraseña.`
   - `Enviar enlace de recuperación`
   - `Si existe una cuenta asociada a ese e-mail, recibirás un enlace para restablecer tu contraseña.`
- Reset-password Spanish copy:
   - `Crear nueva contraseña`
   - `La contraseña debe tener al menos 8 caracteres e incluir números y/o símbolos.`
   - `Nueva contraseña`
   - `Confirmar contraseña`
   - `Guardar nueva contraseña`
   - `Las contraseñas no coinciden.`
   - `El enlace de recuperación no es válido o ha caducado.`
   - `Tu contraseña se ha actualizado correctamente. Ya puedes iniciar sesión.`
- Reset email subject must be:
   - `DevMemo :: Restablece tu contraseña`
- Security requirements:
   - never reveal whether an email exists
   - store only hashed reset tokens
   - tokens must expire and be single-use
   - delete previous reset tokens for same email before creating a new one
   - do not log tokens, passwords, URLs, or secrets
   - keep all reset logic on the server
- Existing email verification rules must remain compatible.
- Review current official docs before implementation:
   - Next.js Server Actions
   - Auth.js / NextAuth v5 credentials flow and callbacks
   - Prisma migrations and schema changes
   - Resend Node.js SDK
   - Vercel environment variables

## History

<!-- refers to the file @context/history.md -->
