# code-quality-2-spec

# Current Feature

Prisma and code quality fixes

## Status

In Progress

## Goals

- Fix duplicated code, inconsistent types, code quality issues, and oversized UI components.
- Do not touch anything related to authentication.
- Extract the duplicated icon-name-to-component mapping logic into a shared icon registry/helper and reuse it across the dashboard.
- Unify item type definitions so they follow a single shared shape, using the mock file as the reference format.
- Split UI modules that currently mix rendering, mapping, view-state, and presentation details into smaller presentational components and shared helpers.
- Resolve the lint noise reported in `.agents/skills/tailwind-v4-shadcn/templates/theme-provider.tsx` for the unused variables at lines 35, 65, and 69, either by excluding template/reference files from app linting or by cleaning those variables.

## Notes

- Reference spec: `@context/features/code-quality-2-spec.md`
- Initial data models: `@context/project-overview.md`
- Database standards: `@context/coding-standards.md`
- Keep the work focused on Prisma/code quality/component structure only; authentication is explicitly out of scope.

## History

<!-- refers to the file @context/history.md -->
