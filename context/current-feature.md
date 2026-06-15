# monaco-editor-spec

# Current Feature

<!-- Integrate Monaco Editor for Snippet and Command Items -->

## Status

Done

## Goals

- Integrate `@monaco-editor/react` into the item detail Sheet, item edit form, and item creation form.
- Use Monaco only for the `content` field of `snippet` and `command` item types.
- In `components/items/item-detail-sheet.tsx`, replace the content viewer with a read-only Monaco editor for snippet and command items.
- In the item edit form, replace the current content textarea with editable Monaco for snippet and command items.
- In `components/items/create-item-dialog.tsx`, replace the content textarea with editable Monaco for snippet and command items.
- Keep the existing textarea controls for all other item types (`note`, `prompt`, and any non-code type).
- Monaco must read and write the existing `content` field only; no schema or database changes.
- Language selection must influence Monaco syntax highlighting using the project language values mapped to Monaco language IDs.
- Ensure Monaco is client-only and does not introduce SSR or `window` errors in Next.js.
- Styling requirements: dark theme by default, max 400px height, no horizontal overflow, minimap disabled, word wrap enabled.
- Add a copy button in the editor header.
- Move the `Lenguaje` field into the editor header next to `Copiar`.
- Keep existing server-side validation and existing create/update Server Actions.
- Acceptance criteria require lint, typecheck, and build to pass.

## Notes

- Start by reviewing `components/items/item-detail-sheet.tsx` and `components/items/create-item-dialog.tsx`.
- Also review the existing edit form logic inside the Sheet.
- Install `@monaco-editor/react` if it is not already present.
- Review language options from `lib/items/editable-item.ts`, especially `EDITABLE_ITEM_LANGUAGE_OPTIONS`.
- Create a reusable client-only wrapper component, for example `components/items/code-editor.tsx`, or isolate Monaco cleanly with dynamic import and SSR disabled.
- Suggested helper: `getMonacoLanguage(language?: string | null): string` with `plaintext` fallback.
- Read-only Monaco must support scroll, text selection, and copy.
- Keep visual integration consistent with the current shadcn Sheet/Dialog layout.

## History

<!-- refers to the file @context/history.md -->
