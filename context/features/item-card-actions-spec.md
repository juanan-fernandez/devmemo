# Code Agent Instructions: Item Card Action Icons

## Goal

Implement the action icons in the item card UI:

- Delete item
- Toggle favorite
- Toggle pinned

These actions must update the database and refresh the UI consistently.
These actions must be reusable in other ui screens of the application (example: the item details modal)

## Scope

Implement only the behavior for the existing item card action icons.

Do not redesign the item card unless small visual adjustments are required for icon states.

## Requirements

### 1. Delete Icon

When the user clicks the delete icon:

1. Show a confirmation dialog/modal.
2. Clearly ask the user to confirm item deletion.
3. If the user cancels, do nothing.
4. If the user confirms, delete the item from the database.
5. Remove the item from the current UI after deletion.
6. Show a Spanish success or error message if the project has a toast/notification system.

Suggested Spanish copy:

```text
Eliminar item
¿Seguro que quieres eliminar este item? Esta acción no se puede deshacer.
Cancelar
Eliminar
Item eliminado correctamente.
No se ha podido eliminar el item.
```

Security requirements:

- The delete action must run server-side.
- Verify the authenticated user server-side.
- Delete only items owned by the current user.
- Never trust an item owner/user ID sent from the client.

### 2. Favorite Icon

The favorite icon must toggle the item favorite state.

Behavior:

- If the item is not favorite:
  - clicking the icon marks it as favorite.
  - the icon should appear yellow.
- If the item is already favorite:
  - clicking the icon removes it from favorites.
  - the icon should appear without color / default muted color.

Implementation notes:

- Use the existing item field if present, for example `isFavorite`, `favorite`, or similar.
- If no field exists, inspect the Prisma schema and existing mock data before adding one.
- Prefer a boolean field such as `isFavorite`.
- Persist the change in the database.
- Update the UI optimistically only if the project already uses optimistic updates safely; otherwise refresh/revalidate after the server action.

Suggested Spanish labels or aria labels:

```text
Marcar como favorito
Quitar de favoritos
```

### 3. Pinned Icon

The pinned icon must toggle the item pinned state.

Behavior:

- If the item is not pinned:
  - show the normal pin icon.
  - clicking it marks the item as pinned.
  - the item should appear on the board/dashboard area if that is the existing product behavior.
- If the item is already pinned:
  - show the crossed/disabled pin icon.
  - clicking it unpins the item.
  - the item should be removed from the pinned board/dashboard area if applicable.

Implementation notes:

- Use the existing item field if present, for example `isPinned`, `pinned`, or similar.
- If no field exists, inspect the Prisma schema and existing mock data before adding one.
- Prefer a boolean field such as `isPinned`.
- Persist the change in the database.
- Refresh or revalidate the affected views after the update.

Suggested Spanish labels or aria labels:

```text
Fijar item
Quitar item fijado
```

### 4. Server Actions

Prioritize Server Actions if the project already uses them.

Create or reuse server actions for:

- `deleteItem`
- `toggleItemFavorite`
- `toggleItemPinned`

Each action must:

- Check authentication.
- Check item ownership.
- Validate the item ID.
- Update or delete the database record.
- Return a safe success/error result.
- Revalidate affected paths or tags if the project uses Next.js caching.

Possible affected paths:

```text
/dashboard
/profile
```

Also revalidate any route where item cards are shown.

### 5. UI State

The icon UI must reflect the current database state.

Favorite icon:

- favorite: yellow icon
- not favorite: default/muted icon

Pinned icon:

- pinned: crossed/disabled pin icon
- not pinned: normal pin icon

Delete icon:

- destructive visual treatment, for example red hover state or destructive variant.

Add accessible labels to all icon buttons.

### 6. Database

Before changing the schema, inspect the current Prisma models.

If favorite/pinned fields already exist, reuse them.

If they do not exist, add fields to the item model:

```prisma
isFavorite Boolean @default(false)
isPinned   Boolean @default(false)
```

Run the appropriate Prisma workflow:

```bash
npx prisma generate
npx prisma migrate dev
```

For production, use the project’s existing migration process, usually:

```bash
npx prisma migrate deploy
```

Do not run destructive migrations.

### 7. Confirmation Dialog

Use the project’s existing dialog/modal component if available.

The delete confirmation dialog must:

- Be accessible.
- Have a clear title.
- Have Cancel and Delete buttons.
- Keep Delete styled as destructive.
- Close after cancel or successful delete.
- Show loading state while deleting if supported.

### 8. Acceptance Criteria

- Delete icon asks for confirmation before deleting.
- Canceling the dialog does not delete the item.
- Confirming deletes only the authenticated user’s item.
- Favorite icon toggles favorite state in the database.
- Favorite icon appears yellow when active.
- Favorite icon appears uncolored/muted when inactive.
- Pinned icon toggles pinned state in the database.
- Pinned item shows the crossed/disabled pin icon.
- Unpinned item shows the normal pin icon.
- Unpinning removes the item from the pinned board/dashboard area if applicable.
- All actions are protected server-side.
- The UI refreshes correctly after each action.
- Icon buttons have accessible labels.
- Code passes lint, typecheck, build, and Prisma generate.
