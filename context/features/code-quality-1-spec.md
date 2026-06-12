# Prisma and code quality fixes

## Overview

Fix some issues related to prisma performance querys, code duplicated, inconsistent types, code quality and components split

## Requirements

- Do not push the database modifications. Use migrations to modify de database.
- Several Prisma queries use broad include shapes and fetch more data than the UI needs. Latest collections loads full items plus full type records just to compute counts/colors/icons; dashboard items load broader rows than necessary. Suggested fix: Replace broad include usage with narrow select projections containing only rendered fields.
- Add indexes aligned to real querys likely including createdAt and later composite indexes such as (userId, createdAt) and (userId, isPinned, createdAt).
- File and line: prisma/migrations/20260610154525_add_user_password/migration.sql:1-8 => Description: This migration adds a required password column to User without a backfill/default. It cannot succeed safely if the table is non-empty. fix: Use a two-step migration: add nullable column, backfill, then make it required

## References

## Notes

ALWAYS create migrations and never push directly unless specified.
You can review the latest documentation using context7 mcp
