# Code Agent Instructions: Add Collection Combobox to Item Edit Sheet

## Goal

Fix the item edit Sheet so users can edit the collection assigned to an item.

An item can belong to one collection or to no collection.

Add a shadcn Combobox popup in the item edit mode to select the item collection.

## Bug

In the item detail Sheet edit mode, there is currently no dropdown/selector to edit the collection the item belongs to.

Expected behavior:

- The user can select one of their existing collections.
- The user can also choose no collection.
- Saving the item updates the item collection relationship in the database.

## Reference Files

Review the current Sheet/edit implementation, especially:

```text
components/items/item-detail-sheet.tsx
```

Also review the existing item update Server Action and item edit validation logic.

## UI Requirement

Use the shadcn Combobox popup component style.

Reference documentation:

```text
https://ui.shadcn.com/docs/components/radix/combobox
```

Use the project's existing Combobox components:

```ts
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"
```

Follow the popup pattern shown in the provided example.

## Collection Options

The Combobox must be populated with the authenticated user's collections.

Requirements:

- Load only collections owned by the current user.
- Do not show collections from other users.
- Include an explicit "no collection" option.

Suggested option shape:

```ts
type CollectionOption = {
  id: string
  value: string
  label: string
}
```

Suggested no-collection option:

```ts
{
  id: "",
  value: "",
  label: "Sin colección"
}
```

## Form Behavior

In edit mode:

- Show a field labeled `Colección`.
- Display the current item collection as the selected Combobox value.
- If the item has no collection, show `Sin colección`.
- Changing the Combobox updates the form state.
- Clicking `Cancelar` discards the collection change.
- Clicking `Guardar` saves the selected collection.

## Server Action Requirement

Update the existing item update Server Action to accept the selected collection.

Validation requirements:

- `collectionId` can be a valid collection ID or `null`.
- Empty string from the UI should be normalized to `null`.
- Before saving, verify the selected collection belongs to the authenticated user.
- If the selected collection does not exist or belongs to another user, return a safe validation error.
- Never trust collection ownership from the client.

Do not allow editing item type, created date, updated date, or other non-editable fields.

## Database Update

When saving:

- If `collectionId` is a valid collection owned by the user, assign the item to that collection.
- If `collectionId` is `null`, remove the item from its current collection.
- Ensure the item belongs to the authenticated user before updating it.

Adapt the implementation to the existing Prisma schema relationship.

## Spanish UI Copy

Use Spanish labels and messages:

```text
Colección
Sin colección
Buscar colección
No se encontraron colecciones.
La colección seleccionada no es válida.
Cambios guardados correctamente.
No se han podido guardar los cambios.
```

## Acceptance Criteria

- Edit mode in the item Sheet shows a shadcn Combobox popup for `Colección`.
- The Combobox is populated with the current user's collections.
- The Combobox includes a `Sin colección` option.
- The current item collection is selected when edit mode opens.
- The user can change the item collection and save it.
- The user can remove the item from any collection by selecting `Sin colección`.
- Cancel discards collection changes.
- Server-side validation confirms the selected collection belongs to the authenticated user.
- The updated collection is reflected in the Sheet and item list after save.
- Code passes lint, typecheck, and build.
