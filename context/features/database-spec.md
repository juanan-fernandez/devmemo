# Prisma + Supabase PostgreSQL Setup

## Overview

Set up Prisma ORM with Supabase PostgreSQL database.

## Requirements

- Use Supabase PostgreSQL
- Create initial schema based on data models in project-overview.md (this will evolve)
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes

## References

- Initial data models: `@context/project-overview.md`
- Database standards: `@context/coding-standards.md`
- Prisma docs: https://prisma.io/docs (Prisma 7 has breaking changes - fetch latest)

## Notes

ALWAYS create migrations and never push directly unless specified.

IMPORTANT! Use Prisma 7. You can review the latest documentation using context7 mcp

You can also look at the setup guide here - https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres
