# fix-item-detail-sheet-spec

# Current Feature

<!-- Fix Item Detail Sheet Refresh and Layout -->

## Status

In Progress

## Goals

1. **Fix item list refresh after Sheet actions**: When favorite or pinned is toggled inside the item detail Sheet, the item list must reflect the updated state after closing the Sheet. Use the project's existing refresh pattern (router.refresh, revalidation, state callback, or optimistic update). Do not duplicate action logic.

2. **Update item detail Sheet layout**: After the item content section, add a metadata card containing:
   - A 2-column, 2-row grid with **Creado** (createdAt), **Colección** (collectionName or "Sin colección"), and **Actualizado** (updatedAt, only when available).
   - Below that grid, a full-width tags section inside the same parent card.
   - No nested cards for individual metadata paragraphs.
   - Responsive: collapse to 1 column on mobile.
   - Keep consistent shadcn visual style.

3. **Preserve existing behavior**: Do not break IconActions, do not change the edit mode unless required by the layout refactor, do not change the database schema, keep accessibility.
4. **Special attention to not broke the animation of the sheet**

## Notes

- The Sheet viewer content order should be: header/title → main content → metadata card (created, updated, collection, tags) → existing actions.
- Spanish labels: Creado, Actualizado, Colección, Tags, Sin colección.
- Reuse existing item action logic; do not duplicate.
- Keep ownership and authentication checks server-side.
- Reference: `components/items/item-detail-sheet.tsx`, `components/items/item-actions.tsx`, `lib/item-types.ts`, `lib/db/items.ts`.

## History

<!-- refers to the file @context/history.md -->
