# Current Feature

Seed Data for Development and Demos

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

- Extend `prisma/seed.ts` to populate the database with sample data for development and demos.
- Create a demo user with email `demo@devmemo.com`, name `Demo User`, password `12345678` hashed with `bcryptjs` using 12 rounds, verified email, and the provided avatar URL.
- Use the data from `@lib/mockdata.ts` to populate collections and items.
- Preserve the existing system item types seed and keep the script idempotent.

## Done

- Added `password` to the Prisma `User` model and created a migration for it.
- Extended `prisma/seed.ts` to ensure system item types exist before seeding demo data.
- Created the demo user `demo@devmemo.com` with a `bcryptjs` hash using 12 rounds.
- Seeded collections, tags, items, and item-tag relations from `@lib/mockdata.ts`.
- Mapped mock ids to real Supabase database ids during creation so persisted relations use actual database identifiers.
- Verified the resulting dataset: 1 demo user, 5 collections, 8 tags, and 10 items.

## Notes

- References:
   - `@context/features/seed-spec.md`
   - `@lib/mockdata.ts`
- The seed must be useful for local development and demo environments.
- The id fields must represent id of the supabase database.
- Keep using Prisma seed flow already configured in the project.
- The seed recreates the demo dataset by deleting the previous demo user and rebuilding all dependent data, while preserving shared system item types.

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-06-10: feature preparada a partir de `@context/features/seed-spec.md`.
- 2026-06-10: alcance ajustado al spec actualizado y estado cambiado a `In Progress`.
- 2026-06-10: implementación completada y verificada contra la base de datos remota.
