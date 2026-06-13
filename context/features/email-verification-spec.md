# Code Agent Instructions: Implement Email Verification



Implement an email verification feature for users who register with email/password or any local credentials-based registration flow.

Use Server Actions as the preferred implementation approach.

Use Resend to send verification emails. The Resend API key must be read from:

```env
RESEND_API_KEY=
```

Do not expose this key to the client.

## Main Goal

After a user registers, they must receive an email verification link.

The user must see a Spanish confirmation message after registration:

```text
Te hemos enviado un e-mail con un enlace para confirmar la dirección de correo electrónico proporcionada. Revisa tu bandeja de entrada.
```

When the user clicks the verification link, the app must validate the token and update:

```prisma
User.emailVerified
```

If a user has not verified their email address, they must not be allowed to log in.

## Requirements

### 1. Prioritize Server Actions

Use Server Actions for:

- Registering the user, if the project already uses or can safely use server actions for registration.
- Creating and storing the email verification token.
- Sending the verification email through Resend.
- Verifying the token when the user clicks the link.
- Resending a verification email if needed.

Avoid adding API routes unless there is a strong project-specific reason.

### 2. Use Resend

Install Resend if it is not already installed:

```bash
npm install resend
```

or use the project package manager if it uses `pnpm`, `yarn`, or `bun`.

Create a server-only mail utility, for example:

```text
lib/mail/resend.ts
```

It must:

- Import `Resend` from `resend`.
- Read `process.env.RESEND_API_KEY`.
- Fail clearly if the key is missing in non-test environments.
- Send the verification email using a verified sender/domain configured in Resend.

Recommended extra environment variable:

```env
EMAIL_FROM="Your App <noreply@your-domain.com>"
```

Do not hardcode production sender addresses in multiple files.

### 3. Verification Link Base URL

The verification email needs an absolute URL.

Use this:  `APP_URL`.

Recommended:

```env
APP_URL=https://devmemo-blond.vercel.app/
```

For local development in env.local:

```env
APP_URL=http://localhost:3000
```

Do not use user-provided callback URLs to build verification links.

### 4. Prisma Data Model

Inspect the current Prisma schema before changing it.

Auth.js Prisma Adapter normally already uses:

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
}
```

If `emailVerified` already exists, reuse it.

Add a verification token model if the current schema does not already have one suitable for this feature.

Recommended model:

```prisma
model EmailVerificationToken {
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

- Store a hash of the token, not the raw token.
- Tokens must be single-use.
- Delete the token after successful verification.
- Delete or invalidate previous tokens for the same email when creating a new one.
- Use a reasonable expiration time, for example 24 hours.
- Do not run destructive migrations.

Run the appropriate Prisma commands:

```bash
npx prisma generate
npx prisma migrate dev
```

For production, use the existing deployment migration process, usually:

```bash
npx prisma migrate deploy
```

### 5. Registration Flow

When a user registers:

1. Validate input server-side.
2. Normalize the email:
   - trim whitespace
   - convert to lowercase
3. Create the user with `emailVerified: null`.
4. Create a verification token.
5. Send the verification email via Resend.
6. Return a success state to the UI.
7. Show this Spanish message:

```text
Te hemos enviado un e-mail con un enlace para confirmar la dirección de correo electrónico proporcionada. Revisa tu bandeja de entrada.
```

Do not automatically sign in the user after registration. For this task, assume no login until verified.

### 6. Verification Flow

Create a verification page or route, for example:

```text
app/(auth)/verify-email/page.tsx
```

Expected URL:

```text
/verify-email?token=<raw-token>
```

When the user opens the link:

1. Read the token from the query string.
2. Hash the raw token using the same hashing function used when storing it.
3. Look up the token hash in the database.
4. Reject if missing or expired.
5. Find the matching user by token email.
6. Update `User.emailVerified` to the current date.
7. Delete the used token.
8. Show a Spanish success message:

```text
Tu e-mail ha sido verificado correctamente. Ya puedes iniciar sesión.
```

Error states must also be in Spanish, for example:

```text
El enlace de verificación no es válido o ha caducado. Solicita un nuevo e-mail de verificación.
```

### 7. Block Login for Unverified Users

If the project uses a Credentials provider, modify the credentials authorization logic:

- Find the user by normalized email.
- Validate password as currently implemented.
- If `user.emailVerified` is null, reject login.
- Return a Spanish error message or redirect to a page explaining that the email must be verified.

Expected message:

```text
Debes verificar tu e-mail antes de iniciar sesión. Revisa tu bandeja de entrada o solicita un nuevo enlace de verificación.
```

If the project uses Auth.js callbacks, also add a defensive check in the `signIn` callback for credential-based users.

Important provider behavior:

- For GitHub OAuth users, do not block login using this email verification flow unless the product explicitly wants to require an additional local verification step for OAuth users.
- If GitHub returns a verified email and the adapter creates/updates the user, it is acceptable to treat OAuth login separately.
- Do not enable dangerous automatic account linking unless explicitly approved.

### 8. Resend Verification Email

The email should be clear and in Spanish.

Subject:

```text
Confirma tu e-mail
```

Suggested body:

```html
<p>Hola,</p>
<p>Gracias por registrarte. Para confirmar tu dirección de e-mail, haz clic en el siguiente enlace:</p>
<p><a href="{{verificationUrl}}">Confirmar mi e-mail</a></p>
<p>Este enlace caduca en 24 horas.</p>
<p>Si no has creado una cuenta, puedes ignorar este mensaje.</p>
```

Also include a plain text version.

### 9. Resend Verification Retry

Add a safe resend flow if feasible:

- The user enters their email.
- Normalize it.
- If the email exists and `emailVerified` is null, create a fresh token and send a new email.
- Always return a generic success message to avoid email enumeration:

```text
Si existe una cuenta pendiente de verificación para ese e-mail, enviaremos un nuevo enlace de confirmación.
```

### 10. Security Requirements

- Store only hashed verification tokens.
- Use `crypto.randomBytes` or `crypto.randomUUID` plus sufficient entropy for raw tokens.
- Use constant-time comparison if comparing raw values directly; preferably avoid direct raw comparisons by storing hashes.
- Expire verification tokens.
- Delete used tokens.
- Do not leak whether an email exists.
- Rate-limit resend and registration attempts if the project has an existing rate-limit utility.
- Do not log raw tokens, passwords, secrets, or verification URLs.
- Do not expose `RESEND_API_KEY` to client code.
- Do not prefix secrets with `NEXT_PUBLIC_`.

### 11. Environment Variables

Add these to `.env.example` if the project has one:

```env
RESEND_API_KEY=
EMAIL_FROM=
APP_URL=
```


### 12. Documentation to Review

Before implementation, review the current official docs:

- Auth.js / NextAuth v5 installation and configuration.
- Auth.js Prisma Adapter.
- Auth.js callbacks, especially `signIn` and `session`.
- Auth.js edge compatibility and split config.
- Resend Node.js SDK.
- Next.js Server Actions.
- Prisma migrations.
- Vercel environment variables.

Use Context7 to verify the newest conventions, but prefer official documentation if there is a conflict.

## Acceptance Criteria

- A newly registered user has `emailVerified = null`.
- A verification email is sent with Resend after registration.
- The registration UI shows the required Spanish message.
- The verification link updates `User.emailVerified`.
- Unverified users cannot log in.
- Verified users can log in.
- Secrets are read only from environment variables.
- The implementation prioritizes Server Actions.
- The code passes lint, typecheck, build, and Prisma generate.
