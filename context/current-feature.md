# item-create-spec

# Current Feature

<!-- Feature Name -->

## Status

In Progress

## Goals

- Implement a form to create new items triggered by the **Nuevo** button in the item list
- Open the create form inside a shadcn `Dialog` modal
- Close the Dialog on `Cancelar`, and after successful creation show a Spanish success message and close after 2 seconds
- Add a Server Action named `createItem` in the `actions` folder with Zod validation before database writes
- Show the selected item type in the Dialog header as `Nuevo/Nueva [item_type]` using gender metadata , icon, color, and label from `lib/item-types.ts`
- Reuse the existing shadcn `Select` component for all select-like fields in the form
- Show shared fields for all item types: `title` (required), `description` (optional), `tags` (optional, comma-separated in UI and saved as trimmed non-empty array)
- Show type-specific fields:
   - `content` textarea for `snippet`, `command`, `prompt`, and `note`
   - `language` Select for `snippet` and `command` using `EDITABLE_ITEM_LANGUAGE_OPTIONS` from `lib/items/editable-item.ts`
   - `url` required text input for `url` items, validated as a real URL
- Show a collection selector at the end of the form using the existing shadcn `Select`, loading only the authenticated user's collections and optionally associating the item with one collection
- Add footer buttons for `Guardar` and `Cancelar` using the project's icon library
- Keep the Dialog open on validation failure and show field-level or generic Spanish errors
- Revalidate affected routes after successful creation, including `/dashboard`, `/profile`, and any route where the item list is displayed
- Acceptance criteria require lint, typecheck, build, and Prisma generate if needed.
- Once the item is created the list of items UI must show the new item.
- The create Dialog is only required from `/items/[type]` for this feature slice.
- After successful creation, show a simplified success state before closing the Dialog automatically.

## Notes

- Prioritize Server Actions and follow the project convention of placing them under `actions/`
- Reuse item type metadata from `lib/item-types.ts`; do not hardcode icon/color/label data
- Reuse the existing shadcn `Select` component instead of building a new Combobox for this feature
- Recommended validation behavior in the Server Action:
   - `type`: required valid item type
   - `title`: required non-empty trimmed string
   - `description`: optional string or null
   - `tags`: array of trimmed non-empty strings
   - `content`: required or optional depending on item type
   - `language`: required or optional depending on item type
   - `url`: required valid URL for url items
   - `collectionId`: optional string or null
- Validation rules by type:
   - `url` requires a valid `url`
   - `snippet` and `command` may include `language`
   - `snippet`, `command`, `prompt`, and `note` may include `content`
   - do not accept fields not allowed for the selected item type unless the real data model requires them
- Security rules:
   - create items server-side only
   - use the authenticated user from the server session
   - never trust user IDs from the client
   - never allow creating an item inside another user's collection
   - validate all fields with Zod
   - do not log sensitive data
- Suggested Spanish labels and messages:
   - `Nuevo`, `Guardar`, `Cancelar`, `Item creado correctamente.`, `No se ha podido crear el item.`
   - `El título es obligatorio.`, `La URL no es válida.`, `Selecciona un lenguaje válido.`

## History

<!-- refers to the file @context/history.md -->
