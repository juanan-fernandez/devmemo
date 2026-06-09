# Current Feature

Prisma + Supabase PostgreSQL Setup

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

- Set up Prisma ORM with Supabase PostgreSQL.
- Create the initial schema based on the data models in `@context/project-overview.md`.
- Include NextAuth models: `Account`, `Session`, and `VerificationToken`.
- Add appropriate indexes and cascade deletes.
- Create migrations for all schema changes.

## Done

- Schema with 10 models: User, Account, Session, VerificationToken, Item, ItemType, Collection, Tag, ItemTag + indexes and cascade deletes.
- Initial migration created and applied.
- Seed script (`prisma/seed.ts`) with 7 system item types: Snippet, Prompt, Note, Command, File, Image, URL.
- Connection test script (`scripts/test-db.ts`).
- `DIRECT_URL` documented in `.env.example` for CLI migrations vs `DATABASE_URL` for runtime.

## Notes

- References:
   - `@context/features/database-spec.md`
   - `@context/project-overview.md`
   - `https://prisma.io/docs`
   - `https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres`
- Use Supabase PostgreSQL.
- Use Prisma 7.
- Always create migrations and never push directly unless explicitly specified.
- CLI migrations use `DIRECT_URL` (direct connection) — runtime uses `DATABASE_URL` (pooled via PgBouncer).
- System item types have `userId = null` and `isSystem = true`, available globally.
