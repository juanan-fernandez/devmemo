# Code Agent Instructions: Refactor Shared Item Row Sheet/Delete Logic

## Goal

Fix duplicated orchestration logic between `ItemCard` and `PinnedItemRow`.

Both components currently duplicate the same local state and handlers for:

- delete state
- deletion messages
- item detail Sheet session
- Sheet open/close state
- delete handler
- open Sheet handler

Extract this duplicated behavior into a reusable hook or wrapper component.

## Affected Files

Review:

```text
components/items/item-card.tsx:15-44
components/dashboard/pinned-item-row.tsx:15-44
```

## Issue

The following state and logic is duplicated:

```text
isDeleted
showMessage
sheetSession
sheetOpen
handleDelete
handleOpenSheet
```

This makes future changes error-prone because the same behavior must be updated in multiple places.

## Required Refactor

Create a shared abstraction.

Preferred option:

```text
useItemRow()
```

Suggested location:

```text
hooks/use-item-row.ts
```

or, if the project groups item hooks elsewhere:

```text
components/items/hooks/use-item-row.ts
```

Alternative option:

Create a wrapper component only if it fits the current component structure better.

## Hook Responsibilities

The hook should manage:

- `isDeleted`
- `showMessage`
- `sheetSession`
- `sheetOpen`
- `setSheetOpen`
- `handleDelete`
- `handleOpenSheet`

The hook should allow both `ItemCard` and `PinnedItemRow` to reuse the same behavior without duplicating state or handlers.

Suggested API:

```ts
const {
  isDeleted,
  showMessage,
  sheetSession,
  sheetOpen,
  setSheetOpen,
  handleDelete,
  handleOpenSheet,
} = useItemRow({ item })
```

Adapt the API to the existing project types and conventions.

## Requirements

- Preserve existing behavior.
- Do not change the visual design.
- Do not change database behavior.
- Do not change the delete Server Action unless necessary.
- Do not break the item detail Sheet.
- Do not break the pinned item row behavior.
- Keep TypeScript types explicit and reusable.
- Avoid circular imports.
- Keep the hook client-safe if it uses React state.

## Integration

Update both components to use the shared abstraction:

```text
components/items/item-card.tsx
components/dashboard/pinned-item-row.tsx
```

After refactor:

- `ItemCard` should no longer define duplicated Sheet/delete orchestration.
- `PinnedItemRow` should no longer define duplicated Sheet/delete orchestration.
- Both should call the shared hook or use the shared wrapper.

## Testing Checklist

Verify manually:

- Clicking an item card opens the Sheet.
- Clicking a pinned item row opens the Sheet.
- Closing the Sheet works in both places.
- Deleting from an item card works.
- Deleting from a pinned item row works.
- Delete messages still appear as before.
- Deleted items disappear from the UI as before.
- Existing favorite/pinned actions still work.

## Acceptance Criteria

- A shared `useItemRow()` hook or equivalent wrapper exists.
- `ItemCard` no longer duplicates the orchestration logic.
- `PinnedItemRow` no longer duplicates the orchestration logic.
- Existing behavior is preserved.
- TypeScript types are clean.
- No circular imports are introduced.
- Code passes lint, typecheck, and build.
