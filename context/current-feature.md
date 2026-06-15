# markdown-editor-spec

# Current Feature

<!-- Integrate react-markdown editor for prompt items -->

## Status

In Progress

## Goals

- Integrate `react-markdown` into the item detail Sheet, the item edit form, and the item creation form.
- Use the markdown editor only for the `prompt` item type and only for the existing `content` field.
- In `components/items/item-detail-sheet.tsx`, render prompt content with `react-markdown` in read-only mode.
- In the item edit form inside the Sheet, replace the current `content` textarea with an editable markdown editor only for `prompt` items.
- In `components/items/create-item-dialog.tsx`, replace the current `content` textarea with an editable markdown editor only when creating a `prompt`.
- Keep the existing controls for all other item types (`note`, `snippet`, `command`, `link`, `image`, `file`, and any other non-prompt type).
- The markdown editor must read and write the existing `content` field only; do not add schema or database fields.
- The read-only viewer must allow scrolling, text selection, and copying.
- The editable version must be controlled by form state and preserve the current validation and submit behavior.
- Ensure the markdown editor runs client-side only and does not introduce SSR or `window` errors in Next.js.
- Keep the UI integrated with the current shadcn Sheet/Dialog layout, with dark theme by default, max 400px height, no horizontal overflow, and a copy button in the editor header.
- Keep the existing `createItem` and `updateItemAction` Server Actions with server-side Zod validation.
- Acceptance criteria require lint, typecheck, and build to pass.

## Notes

- Start by reviewing:
  - `components/items/item-detail-sheet.tsx`
  - `components/items/create-item-dialog.tsx`
- Also review the current item edit form logic inside the Sheet.
- Install `react-markdown` if it is not already present.
- npm reference: `https://www.npmjs.com/package/react-markdown`
- If needed, wrap markdown functionality in a reusable client-only component and isolate the markdown-specific configuration there.
- Suggested reusable shape from the spec:
  - `type CodeEditorProps = { value: string; language?: string | null; readOnly?: boolean; onChange?: (value: string) => void }`
- Important note: the spec text contains one contradictory line mentioning `snippet` and `command`; the rest of the document and acceptance criteria consistently indicate the markdown editor should be used only for `prompt`.

## History

<!-- refers to the file @context/history.md -->
