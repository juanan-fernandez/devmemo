# Code Agent Instructions: Implement Password Reset

## Context

The application is a Next.js app using Auth.js / NextAuth v5, Prisma ORM, Supabase Postgres, and Resend.

Resend is already installed and configured. The project should already have these environment variables or equivalent mail utilities:

```env
RESEND_API_KEY=
EMAIL_FROM=
APP_URL=
```

The application messages and the email content for this feature must be in Spanish.

## Main Goal

Implement a complete password reset flow.

The existing “¿Olvidaste tu contraseña?” link in the login form must become functional.

Flow:

1. User clicks “¿Olvidaste tu contraseña?” in the login form.
2. User is sent to a page with one email input.
3. User enters the email address used to register in the application.
4. If the email exists in the database, send a password reset email using Resend.
5. The email contains a secure reset link.
6. The reset link opens a new page where the user can create a new password.
7. The new password page must have two password fields:
   - new password
   - confirm new password
8. Password fields must include an eye icon to toggle visibility.
9. Passwords are hidden by default.
10. The password must have at least 8 characters and include numbers and/or symbols.
11. The password rule must be shown to the user.
12. After successful reset, the user can log in with the new password.

## Requirements

### 1. Prioritize Server Actions

Use Server Actions as the preferred approach for:

- Requesting a password reset email.
- Creating the password reset token.
- Sending the reset email through Resend.
- Validating the reset token.
- Updating the user password.
- Deleting or invalidating used reset tokens.

Avoid API routes unless the existing architecture strongly requires them.

### 2. Login Form Link

Find the existing login form and make the link functional:

```text
¿Olvidaste tu contraseña?
```

It should navigate to a forgot-password page, for example:

```text
/forgot-password
```

or the project’s existing auth route convention.

The link text must remain in Spanish.

### 3. Forgot Password Page

Create a page where the user can request a password reset email.

Suggested route:

```text
/forgot-password
```

UI requirements:

- One email input.
- Submit button.
- Spanish labels and messages.
- The form must be accessible.
- Validate that the email has a valid format.
- Normalize email:
  - trim whitespace
  - convert to lowercase

Suggested Spanish copy:

```text
Recuperar contraseña
Introduce el e-mail con el que te registraste y te enviaremos un enlace para restablecer tu contraseña.
Enviar enlace de recuperación
```

Success message:

```text
Si existe una cuenta asociada a ese e-mail, recibirás un enlace para restablecer tu contraseña.
```

Important security requirement:

- Always show the same success message whether or not the email exists.
- Do not reveal if an email is registered.
- Do not leak account existence through timing, logs, or error messages.

### 4. Password Reset Token Model

Inspect the Prisma schema before making changes.

If there is already a suitable token model, reuse it carefully.

If not, add a dedicated password reset token model.

Recommended Prisma model:

```prisma
model PasswordResetToken {
  id        String   @id @default(cuid())
  email     String
  tokenHash String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([email])
  @@index([expiresAt])
}
```

Important:

- Store only a hash of the token.
- Never store the raw reset token.
- Tokens must be single-use.
- Delete previous password reset tokens for the same email before creating a new one.
- Delete the token after successful password reset.
- Expire tokens after a reasonable period, for example 1 hour.
- Do not run destructive migrations.

Run the appropriate Prisma commands:

```bash
npx prisma generate
npx prisma migrate dev
```

For production, use the existing deployment process, usually:

```bash
npx prisma migrate deploy
```

### 5. Token Generation and Hashing

Create a server-only utility for password reset tokens.

Requirements:

- Use secure random token generation, for example `crypto.randomBytes`.
- Generate enough entropy, for example 32 bytes encoded as hex or base64url.
- Store a SHA-256 hash of the raw token in the database.
- Send only the raw token in the email link.
- Do not log raw tokens or full reset URLs.
- Do not expose token creation logic to client components.

Suggested URL format:

```text
/reset-password?token=<raw-token>
```

### 6. Resend Email

Use the existing Resend setup.

The email must be in Spanish.

Subject:

```text
Restablece tu contraseña
```

Suggested HTML body:

```html
<p>Hola,</p>
<p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
<p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
<p><a href="{{resetUrl}}">Restablecer mi contraseña</a></p>
<p>Este enlace caduca en 1 hora.</p>
<p>Si no has solicitado este cambio, puedes ignorar este mensaje.</p>
```

Also include a plain text version:

```text
Hola,

Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.

Abre este enlace para crear una nueva contraseña:

{{resetUrl}}

Este enlace caduca en 1 hora.

Si no has solicitado este cambio, puedes ignorar este mensaje.
```

The reset URL must be built using a safe server-side base URL, preferably:

```env
APP_URL=
```

Do not build reset URLs from untrusted request headers unless the project already has a safe URL utility.

### 7. Reset Password Page

Create a page for setting a new password.

Suggested route:

```text
/reset-password?token=<raw-token>
```

UI requirements:

- Two password inputs:
  - `password`
  - `confirmPassword`
- Both password inputs must include an eye icon to toggle visibility.
- Passwords must be hidden by default.
- The user can toggle each field independently or both together, depending on the existing UI convention.
- The password rule must be visible to the user.
- Spanish labels and messages.

Suggested Spanish copy:

```text
Crear nueva contraseña
Introduce tu nueva contraseña.
La contraseña debe tener al menos 8 caracteres e incluir números y/o símbolos.
Nueva contraseña
Confirmar contraseña
Guardar nueva contraseña
```

Validation rules:

- Password is required.
- Confirm password is required.
- Password must have at least 8 characters.
- Password must include at least one number or one symbol.
- Password and confirm password must match.

Regex suggestion:

```ts
const passwordRegex = /^(?=.*[0-9\W_]).{8,}$/
```

Use or adapt the project’s existing validation library if present, for example Zod.

Error messages in Spanish:

```text
La contraseña debe tener al menos 8 caracteres e incluir números y/o símbolos.
Las contraseñas no coinciden.
El enlace de recuperación no es válido o ha caducado.
```

Success message:

```text
Tu contraseña se ha actualizado correctamente. Ya puedes iniciar sesión.
```

### 8. Updating the Password

When the user submits the reset password form:

1. Validate the token.
2. Hash the raw token.
3. Look up the token hash in the database.
4. Reject if missing or expired.
5. Find the user by token email.
6. Validate password and confirm password.
7. Hash the new password using the project’s existing password hashing utility.
8. Update the user’s password field.
9. Delete the used token.
10. Redirect to login or show a success message with a link to login.

Important:

- Use the same password hashing algorithm already used by the registration/login flow.
- Do not introduce a second incompatible hashing method.
- If the project uses bcrypt, continue using bcrypt.
- If the project uses argon2, continue using argon2.
- Never store plain text passwords.

### 9. Authentication Compatibility

Inspect the existing credentials login implementation.

Ensure that after a password reset:

- The user can log in with the new password.
- The old password no longer works.
- Existing email verification rules still apply.
- If the user’s email is not verified and the application blocks unverified login, keep that behavior unchanged.

Do not change GitHub OAuth login behavior for this feature.

### 10. Security Requirements

- Do not reveal whether an email exists.
- Store only hashed reset tokens.
- Tokens must expire.
- Tokens must be single-use.
- Delete previous reset tokens for the same email before creating a new one.
- Delete used tokens after successful reset.
- Do not log tokens, passwords, reset URLs, or secrets.
- Do not expose `RESEND_API_KEY` to the browser.
- Do not prefix secrets with `NEXT_PUBLIC_`.
- Add rate limiting if the project already has a rate-limit utility.
- Avoid sending multiple reset emails too quickly to the same address.
- Keep all password reset logic on the server.

### 11. Environment Variables

The enviroment variables are yet created in both local and vercel.

### 12. Spanish Copy Requirements

All user-facing messages for this feature must be in Spanish.

Examples:

Forgot password page:

```text
Recuperar contraseña
Introduce el e-mail con el que te registraste y te enviaremos un enlace para restablecer tu contraseña.
Enviar enlace de recuperación
Si existe una cuenta asociada a ese e-mail, recibirás un enlace para restablecer tu contraseña.
```

Reset password page:

```text
Crear nueva contraseña
La contraseña debe tener al menos 8 caracteres e incluir números y/o símbolos.
Nueva contraseña
Confirmar contraseña
Guardar nueva contraseña
Las contraseñas no coinciden.
El enlace de recuperación no es válido o ha caducado.
Tu contraseña se ha actualizado correctamente. Ya puedes iniciar sesión.
```

Email:

```text
Restablece tu contraseña
Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
Este enlace caduca en 1 hora.
Si no has solicitado este cambio, puedes ignorar este mensaje.
```

### 13. Documentation to Review

Before implementation, review current official documentation:

- Next.js Server Actions.
- Auth.js / NextAuth v5 credentials flow and callbacks.
- Prisma migrations and schema changes.
- Resend Node.js SDK.
- Vercel environment variables.

Use Context7 to verify the latest conventions, but prefer official documentation when there is a conflict.

## Acceptance Criteria

- The “¿Olvidaste tu contraseña?” login link is functional.
- A forgot-password page exists with an email input.
- Submitting the forgot-password form sends a Resend email only if the user exists.
- The UI always shows a generic success message to avoid email enumeration.
- Password reset emails are in Spanish.
- The reset email contains a secure single-use expiring link.
- A reset-password page exists with two password inputs.
- Password inputs are hidden by default and include eye icons.
- Password validation requires at least 8 characters and at least one number or symbol.
- Password validation rules are shown to the user in Spanish.
- Valid reset updates the stored user password.
- Used or expired reset links cannot be reused.
- The user can log in with the new password.
- Secrets remain server-only.
- The implementation prioritizes Server Actions.
- The code passes lint, typecheck, build, and Prisma generate.
