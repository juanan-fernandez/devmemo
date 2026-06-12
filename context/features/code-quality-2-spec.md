# Prisma and code quality fixes

## Overview

Fix code duplicated, inconsistent types, code quality and components split

## Requirements

- Do not touch anything related to authentication. We will set up this feature later.
- The icon-name-to-component mapping logic is duplicated in three places, with overlapping fallback behavior. This is brittle and easy to desynchronize. Fix: Extract a shared icon registry/helper module and reuse it across the dashboard.
- Item types definitions exist in multiple forms, unify all in the way at mock file appears.
- Some ui modules are mixing rendering, mapping, view-state, and presentation details in one file. Fix: Split them into smaller presentational components and move shared helpers into separate modules
- File and line: .agents/skills/tailwind-v4-shadcn/templates/theme-provider.tsx:35, :65, :69 - npm run lint reports repo-wide unused-variable warnings from a checked-in template file. This adds noise and can hide app-level issues. fix: Exclude template/reference files from app linting or clean the unused variables.

## References

- Initial data models: `@context/project-overview.md`
- Database standards: `@context/coding-standards.md`

## Notes
