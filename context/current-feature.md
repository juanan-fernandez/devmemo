# Current Feature

Prisma + Supabase PostgreSQL Setup

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

- Set up Prisma ORM with Supabase PostgreSQL.
- Create the initial schema based on the data models in `@context/project-overview.md`.
- Include NextAuth models: `Account`, `Session`, and `VerificationToken`.
- Add appropriate indexes and cascade deletes.
- Create migrations for all schema changes.

## Notes

- References:
   - `@context/features/database-spec.md`
   - `@context/project-overview.md`
   - `https://prisma.io/docs`
   - `https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres`
- Use Supabase PostgreSQL.
- Use Prisma 7.
- Always create migrations and never push directly unless explicitly specified.
