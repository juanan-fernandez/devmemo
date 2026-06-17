# add-collection-combobox-to-item-edit-spec

# Current Feature

<!-- Add Collection Combobox to Item Edit Sheet -->

## Status

In Progress

## Goals

- Fix the item edit Sheet so users can edit the collection assigned to an item.
- Add a shadcn Combobox popup in edit mode to select the item's collection.
- Populate the Combobox with the authenticated user's collections.
- Include a `Sin colección` option to remove the item from any collection.
- Show the current item collection as selected when edit mode opens.
- Update the existing item update Server Action (`actions/items/update-item.ts`) to accept `collectionId`.
- Validate server-side that the selected collection belongs to the authenticated user.
- Use Spanish UI copy throughout.
- Pass lint, typecheck, and build.

## Notes

- Reference file: `components/items/item-detail-sheet.tsx` (current Sheet/edit implementation).
- Use shadcn Combobox: `@/components/ui/combobox` (Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger, ComboboxValue).
- Reference docs: https://ui.shadcn.com/docs/components/radix/combobox
- Collection options shape: `{ id, value, label }` with `Sin colección` as `{ id: "", value: "", label: "Sin colección" }`.
- `collectionId`: valid ID or `null` (empty string normalized to `null`).
- Server action to update: `actions/items/update-item.ts`.
- Spanish labels: `Colección`, `Sin colección`, `Buscar colección`, `No se encontraron colecciones.`, `La colección seleccionada no es válida.`, `Cambios guardados correctamente.`, `No se han podido guardar los cambios.`.

## History

<!-- refers to the file @context/history.md -->
