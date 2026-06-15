# Code Agent Instructions: Fix Item Detail Sheet Refresh and Layout

## Goal

Fix the item detail `Sheet` behavior and update its internal layout.

The item action icons inside the Sheet already exist and work, but toggling **favorite** or **pinned** from inside the Sheet does not update the item list after closing the Sheet. Fix this so the list reflects the latest item state.

Also update the Sheet viewer layout as described below.

## Requirements

### 1. Fix Item List Refresh After Sheet Actions

Current issue:

- The `IconActions` inside the item detail Sheet work correctly.
- If the user toggles favorite or pinned inside the Sheet, the database updates correctly.
- However, when the Sheet is closed, the item list does not reflect the updated favorite/pinned state.

Expected behavior:

- When favorite is toggled from the Sheet, the item list must update accordingly.
- When pinned is toggled from the Sheet, the item list must update accordingly.
- When the Sheet closes, the item list must show the latest item state.
- The fix must work for both favorite and pinned actions.

Implementation guidance:

- Reuse the existing item action logic if possible.
- Ensure the parent item list receives or fetches the updated item state.
- Use the project's existing refresh pattern:
  - `router.refresh()`
  - server action revalidation
  - state callback from Sheet to parent
  - optimistic update
  - or the project's existing cache/tag invalidation approach
- Do not duplicate action logic unnecessarily.
- Keep item ownership and authentication checks server-side.

Acceptance criteria:

- Toggling favorite inside the Sheet updates the list UI after closing the Sheet.
- Toggling pinned inside the Sheet updates the list UI after closing the Sheet.
- No full page reload is required unless that is already the project convention.
- Existing favorite/pinned behavior from the item card still works.

---

## 2. Update Item Detail Sheet Layout

In the item detail Sheet viewer, modify the card layout.

After the item content section, add a card that contains:

1. A grid/flex area with 2 rows and 2 columns.
2. The grid/flex area itself should not use nested cards.
3. Below the grid/flex area, show the tags in a full-width card/section inside the same parent card.

### Required Visual Structure

Represent the layout like this:

| Area | Column 1 | Column 2 |
|---|---|---|
| Row 1 | **Creado**<br>`{createdAt}` | **Colección**<br>`{collectionName}` |
| Row 2 | **Actualizado**<br>`{updatedAt}` 

Below this grid, in a separated card:

| Full-width section |
|---|
| **Tags**<br>`{tags}` |

### Layout Details

- The wrapper for createdAt, updagtedAt, and collection should be a card.
- The metadata grid should use 2 columns and 2 rows.
- Do not wrap each metadata paragraph in its own card.
- Use the same font and typography currently used for `Creado`.
- Show `Colección` with the collection name.
- If there is no collection, show a Spanish fallback such as:

```text
Sin colección
```

- The tags section must appear below the grid and occupy the full width.
- Keep the layout responsive for mobile.
- On small screens, the 2-column grid may collapse to 1 column if needed.

### Required Order Inside the Sheet

The viewer content order should be:

1. Item header / title / type information
2. Main item content
3. Metadata parent card:
   - created date
   - updated date if available
   - collection name
   - tags full-width section
4. Existing remaining actions or secondary sections, if any

### Spanish Labels

Use these labels:

```text
Creado
Actualizado
Colección
Tags
Sin colección
```

---

## 3. General Constraints

- Do not change the existing edit mode unless required by the layout refactor.
- Do not break the existing `IconActions`.
- Do not change database schema for this task.
- Do not remove existing item data.
- Keep the visual style consistent with the current shadcn-based UI.
- Preserve accessibility.

## Acceptance Criteria

- Favorite toggled from the Sheet is reflected in the item list after closing the Sheet.
- Pinned toggled from the Sheet is reflected in the item list after closing the Sheet.
- The Sheet metadata layout matches the required table structure.
- Created date keeps the same current typography.
- Updated date is shown only when available.
- Collection is shown in the top-right metadata area.
- Tags appear below the metadata grid and occupy full width.
- No nested cards are used for individual metadata paragraphs.
- Code passes lint, typecheck, and build.
