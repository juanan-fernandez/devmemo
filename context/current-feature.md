# refactor-item-row-sheet-delete

# Current Feature

<!-- Refactor Shared Item Row Sheet/Delete Logic -->

## Status

In Progress

## Goals

- Fix duplicated orchestration logic between `ItemCard` and `PinnedItemRow`.
- Create a shared `useItemRow()` hook to manage:
  - `isDeleted`
  - `showMessage`
  - `sheetSession`
  - `sheetOpen`
  - `setSheetOpen`
  - `handleDelete`
  - `handleOpenSheet`
- Update `components/items/item-card.tsx` to use the shared hook.
- Update `components/dashboard/pinned-item-row.tsx` to use the shared hook.
- Preserve existing behavior: Sheet open/close, delete with confirmation, delete messages, favorite/pinned actions.

## Notes

- Affected files (per spec):
  - `components/items/item-card.tsx:15-44`
  - `components/dashboard/pinned-item-row.tsx:15-44`
- Suggested hook location: `hooks/use-item-row.ts` or `components/items/hooks/use-item-row.ts`.
- The hook is client-safe (uses React state).
- No changes to visual design, database behavior, or the delete Server Action.
- Acceptance criteria include lint, typecheck, and build passing.

## History

<!-- refers to the file @context/history.md -->
