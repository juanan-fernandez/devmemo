# Code Agent Instructions: Extract Shared Item Capabilities and Normalization

## Goal

Fix duplicated item capability rules and normalization logic between item creation and item editing.

Create a shared module:

```text
lib/items/shared.ts
```

Move common item capabilities, language constants, text schemas, and normalization helpers there.

## Issue

Duplicated logic exists in:

```text
lib/items/create-item.ts:14-34
lib/items/editable-item.ts:20-33
lib/items/create-item.ts:155-162
lib/items/editable-item.ts:69-75
```

Current duplication includes:

- item capability sets
- language options
- text/content schemas
- normalization logic

This makes create and edit behavior easy to drift out of sync.

## Required Change

Create:

```text
lib/items/shared.ts
```

Move shared logic into this file.

Recommended shared exports:

```ts
export const ITEM_TYPES_WITH_CONTENT = ...
export const ITEM_TYPES_WITH_LANGUAGE = ...
export const ITEM_TYPES_WITH_URL = ...
export const ITEM_TYPES_WITH_FILE_UPLOAD = ...
export const EDITABLE_ITEM_LANGUAGE_OPTIONS = ...

export function supportsContent(type: string): boolean
export function supportsLanguage(type: string): boolean
export function supportsUrl(type: string): boolean
export function supportsFileUpload(type: string): boolean

export function normalizeNullableText(value: unknown): string | null
export function normalizeTags(value: unknown): string[]
```

Adapt names to the existing code style, but keep one single source of truth.

## Files to Update

Update these files to import shared logic instead of defining duplicates:

```text
lib/items/create-item.ts
lib/items/editable-item.ts
```

Also update any other files that import duplicated constants from those modules if needed.

## Requirements

- Preserve existing behavior.
- Do not change item type names.
- Do not change validation semantics unless required to remove inconsistencies.
- Keep language options in one place only.
- Keep capability rules in one place only.
- Keep normalization logic in one place only.
- Avoid circular imports.
- `shared.ts` must not import server-only modules, Prisma, actions, or React components.
- `shared.ts` should be safe to import from both server and client code.

## Validation

After refactor, verify that create and edit still agree on:

- which item types support `content`
- which item types support `language`
- which item types support `url`
- how empty strings are normalized
- how tags are normalized
- allowed language options

## Testing Checklist

Run or verify:

```bash
npm run lint
npm run typecheck
npm run build
```

Also manually verify:

- Creating a snippet still supports content and language.
- Editing a snippet still supports content and language.
- Creating a command still supports content and language.
- Editing a command still supports content and language.
- Creating/editing prompt and note still support content.
- Creating/editing link still validates URL.
- Tags are normalized the same way in create and edit.

## Acceptance Criteria

- `lib/items/shared.ts` exists.
- Capability sets are no longer duplicated between create and edit modules.
- Language options are defined in one place.
- Text/tag normalization is defined in one place.
- `create-item.ts` imports shared rules from `shared.ts`.
- `editable-item.ts` imports shared rules from `shared.ts`.
- Existing create and edit behavior is preserved.
- No circular imports are introduced.
- Code passes lint, typecheck, and build.
