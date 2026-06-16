# fix-extract-shared-item-rules

# Current Feature

<!-- Extract Shared Item Capabilities and Normalization -->

## Status

In Progress

## Goals

- Fix duplicated item capability rules and normalization logic between item creation and item editing.
- Create `lib/items/shared.ts` as the single source of truth for:
  - item capability sets (`ITEM_TYPES_WITH_CONTENT`, `ITEM_TYPES_WITH_LANGUAGE`, `ITEM_TYPES_WITH_URL`, `ITEM_TYPES_WITH_FILE_UPLOAD`)
  - language options (`EDITABLE_ITEM_LANGUAGE_OPTIONS`)
  - text/content schemas
  - normalization helpers (`normalizeNullableText`, `normalizeTags`)
- Export helpers: `supportsContent`, `supportsLanguage`, `supportsUrl`, `supportsFileUpload`.
- Update `lib/items/create-item.ts` and `lib/items/editable-item.ts` to import from `lib/items/shared.ts`.
- Preserve existing create/edit behavior and avoid circular imports.

## Notes

- Affected files (per spec):
  - `lib/items/create-item.ts:14-34`
  - `lib/items/editable-item.ts:20-33`
  - `lib/items/create-item.ts:155-162`
  - `lib/items/editable-item.ts:69-75`
- `lib/items/shared.ts` must not import server-only modules, Prisma, actions, or React components.
- `lib/items/shared.ts` must be safe to import from both server and client code.
- Acceptance criteria include lint, typecheck, and build passing.
- Manual verification checklist covers snippet, command, prompt, note, link, and tags normalization.

## History

<!-- refers to the file @context/history.md -->
