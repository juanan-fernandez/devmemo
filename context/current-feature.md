# item-edit-spec

# Current Feature

<!-- Feature Name -->

## Status

In Progress

## Goals

- Add an edit icon button to the item detail Sheet header with accessible Spanish label `Editar`
- Support two Sheet modes: read-only and edit mode
- In edit mode, load the current item data into controlled form inputs using local component state
- Replace `ItemActions` icons with `Guardar` and `Cancelar` buttons while editing
- `Cancelar` must discard unsaved changes, reset the form to original values, and return to read-only mode
- `Guardar` must submit edited values through a Server Action validated with Zod before writing to the database
- After a successful save, return to read-only mode and refresh/revalidate the affected UI so the Sheet and item card show updated data
- Create/update a Server Action for item editing following the existing success/error response pattern, with auth and ownership checks
- Make these fields editable for all item types: title, description, tags
- Edit tags as comma-separated text in the UI, then split/trim/remove empties before saving as an array of strings
- Show item-type-specific editable fields:
  - `content` textarea for snippet, prompt, command, note
  - `language` select for snippet and command
  - `url` text input for url items, validated as a real URL on the server
- Keep these fields read-only and never editable: item type, created date, updated date, collections (hide collections in edit mode)
- Display server-side validation errors in the client UI, keeping the user in edit mode on failure
- Show Spanish success/error messaging for save outcomes
- Acceptance criteria require lint, typecheck, build, and Prisma generate if schema/types are affected

## Notes

- The feature enhances the existing item detail Sheet rather than creating a new page or modal
- No form library is needed; use controlled inputs with local state
- Zod validation rules required:
  - `title`: non-empty trimmed string
  - `description`: optional string or null
  - `content`: optional string or null
  - `url`: optional valid URL string or null
  - `language`: optional string or null
  - `tags`: array of trimmed non-empty strings
- The Server Action must only update allowed editable fields and must never accept `itemType`, `createdAt`, `updatedAt`, or collection membership from the client
- Validation errors should be returned as `{ success: false, error }` or equivalent field-displayable shape
- Suggested Spanish messages: `El título es obligatorio.`, `La URL no es válida.`, `No se han podido guardar los cambios.`, `Cambios guardados correctamente.`
- Successful save should return to read-only mode and show a visible success message
- Use a small maintainable language list for snippet and command editing
- The spec mentions `src/actions/items.ts`, but this project currently uses root-level `actions/items/`; implementation should follow the repo’s real structure

## History

<!-- refers to the file @context/history.md -->
