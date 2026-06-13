# auth-2-spec

# Current Feature

Credentials Provider + Registration API

## Status

In Progress

## Goals

- Add a Credentials authentication provider following the existing split auth pattern.
- Keep `auth.config.ts` edge-compatible: no bcrypt, no database adapter imports.
- Keep OAuth providers and middleware-safe route definitions in `auth.config.ts`.
- Update `auth.ts` (Node runtime only) to add the real `CredentialsProvider` logic.
- In `authorize`, validate `email` and `password` are provided.
- Query the database for a user by `email`.
- Return `null` if the user does not exist or has no hashed password.
- Use `bcrypt.compare()` to validate the password.
- Return a NextAuth-compatible user object (`id`, `name`, `email`) when credentials are valid.
- Create `app/api/auth/register/route.ts` as a public POST registration endpoint.
- Validate `name`, `email`, `password`, and `passwordConfirm` from the request body.
- Enforce a password policy: minimum 8 characters and at least one number or special character.
- Reject mismatched passwords with a `400 Bad Request` JSON response.
- Reject already-registered emails with a `400` or `409` JSON response.
- Hash passwords with `bcrypt.hash()` using 10 salt rounds.
- Insert the new user into the existing `user` table.
- Return `201 Created` with JSON confirmation and never expose the hashed password.
- Verify the endpoint with the provided `curl` command and confirm the record is created.

## Notes

- Reference spec: `@context/features/auth-2-spec.md`
- Preserve the current split pattern: `auth/auth.config.ts` + `auth/auth.ts`.
- `auth.config.ts` must stay lightweight and edge-compatible.
- `auth.ts` is Node.js runtime only and may import bcrypt and the DB layer.
- Credentials provider split-pattern note:
  - `auth.config.ts`: add Credentials provider with `authorize: () => null` placeholder.
  - `auth.ts`: override the Credentials provider with the real bcrypt/database validation logic.
- New file required: `app/api/auth/register/route.ts`.
- API verification target:
  - `curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"name":"Homer Simpson","email":"homer.simpson@springfield.com","password":"SecurePassword123!","passwordConfirm":"SecurePassword123!"}'`
- Reference:
  - Credentials provider: https://authjs.dev/getting-started/authentication/credentials

## History

<!-- refers to the file @context/history.md -->
