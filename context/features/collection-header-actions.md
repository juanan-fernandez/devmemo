# Code Agent Instructions: Implement Collection Header Actions

## Goal

Implement the collection action icons in the collection detail header.

Target file:

```text
@components/collections/collection-detail-content.tsx
```

The action icons already exist in the collection detail header. Now they must become functional.

## Actions to Implement

### 1. Edit Collection Icon

When the user clicks the edit icon:

- Open the same Dialog used to create a collection.
- Reuse the existing collection form if possible.
- The Dialog must allow editing:
  - collection title/name
  - collection description
- Preload the current collection values into the form.
- On save, update the collection in the database.
- Refresh the current collection detail UI after successful update.
- Close the Dialog after successful update.

Suggested Spanish labels:

```text
Editar colección
Guardar
Cancelar
Colección actualizada correctamente.
No se ha podido actualizar la colección.
```

Implementation notes:

- Prefer reusing the existing create collection Dialog/form with a `mode: "create" | "edit"` prop.
- If needed, rename it to a more generic component such as `CollectionFormDialog`.
- Keep the same visual style as the current create collection Dialog.

### 2. Favorite Collection Icon

When the user clicks the favorite/star icon:

- Toggle the collection favorite state.
- Use an optimistic UI approach.
- Immediately update the star state in the UI.
- Then persist the change to the database.
- If the database update fails, rollback the UI state and show an error message.

Visual behavior:

- Favorite collection: star icon appears yellow.
- Non-favorite collection: star icon appears uncolored / default muted color.

Suggested Spanish labels:

```text
Marcar colección como favorita
Quitar colección de favoritas
No se ha podido actualizar la colección.
```

Implementation notes:

- Use the existing collection favorite field if present.
- If no favorite field exists, inspect the Prisma schema before adding one.
- If schema changes are required, add a boolean field such as:

```prisma
isFavorite Boolean @default(false)
```

- Run the appropriate Prisma workflow only if the schema changes.

### 3. Delete Collection Icon

When the user clicks the delete icon:

- Show a confirmation dialog.
- The confirmation message must clearly state that the action is irreversible.
- Deleting a collection must not delete its items.
- Items that belonged to the deleted collection must remain in the database with no collection assigned.
- After successful deletion:
  - show a Spanish success message
  - redirect the user to the previous page

Suggested confirmation copy:

```text
Eliminar colección
Esta acción es irreversible. La colección se eliminará permanentemente, pero los items que contiene no se eliminarán y quedarán sin colección.
¿Seguro que quieres continuar?
```

Suggested buttons:

```text
Cancelar
Eliminar
```

Suggested success/error messages:

```text
Colección eliminada correctamente.
No se ha podido eliminar la colección.
```

## Server Actions

Prioritize Server Actions.

Create or reuse actions for:

```text
updateCollection
toggleCollectionFavorite
deleteCollection
```

Suggested location:

```text
actions/collections/
```

Each action must:

- Verify the user is authenticated.
- Verify the collection belongs to the authenticated user.
- Never trust a user ID from the client.
- Return safe success/error responses.
- Revalidate affected paths after success.

Recommended affected paths:

```text
/collections
/collections/[id]
/dashboard
```

### Delete Action Requirements

Before deleting the collection:

- Verify ownership.
- Disconnect or null out the collection relation from all items in that collection.
- Delete the collection.
- Use a database transaction if possible.

Do not delete the items.

Adapt this to the current Prisma schema relationship.

## Security Requirements

- Users can only edit their own collections.
- Users can only favorite/unfavorite their own collections.
- Users can only delete their own collections.
- Collection deletion must not remove item records.
- Keep all database writes server-side.
- Do not expose internal errors to the client.

## UI Requirements

- Keep all user-facing text in Spanish.
- Keep the icons in the collection detail header.
- Use destructive styling for the delete action.
- Preserve accessibility labels for all icon buttons.
- Keep visual style consistent with the current shadcn-based UI.

## Acceptance Criteria

- Edit icon opens the collection form Dialog in edit mode.
- Edit form is prefilled with current collection title and description.
- Saving updates the collection and refreshes the UI.
- Favorite icon toggles favorite state optimistically.
- Favorite collection shows a yellow star.
- Non-favorite collection shows an uncolored/muted star.
- Failed favorite update rolls back optimistic UI state.
- Delete icon opens a confirmation dialog.
- Confirmation clearly warns the action is irreversible.
- Deleting a collection removes only the collection.
- Items from the deleted collection remain in the database with no collection.
- Users cannot modify or delete collections they do not own.
- After deletion, the user sees a success message and is redirected to the previous page.
- Code passes lint, typecheck, build, and Prisma generate if schema changes are made.
