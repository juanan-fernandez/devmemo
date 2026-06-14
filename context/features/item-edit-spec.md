# Code Agent Instructions: Editable Item Detail Sheet

## Goal

Enhance the existing `item-detail` view that uses a shadcn `Sheet` component to support editing item data directly inside the sheet.

The sheet currently displays item details in read-only mode. Add an edit mode.

## Requirements

### 1. Edit Icon in Sheet Header

Add an edit icon button to the header of the item detail `Sheet`.

Behavior:

- In read-only mode, show the edit icon.
- Clicking the edit icon switches the sheet to edit mode.
- Use the project’s existing icon library if available.
- Add an accessible label, for example:

```text
Editar
```

### 2. Read Mode vs Edit Mode

The sheet must support two modes:

- Read-only mode
- Edit mode

When edit mode is active:

- The currently displayed item data must be loaded into editable form controls.
- Keep it simple — no form library needed, use controlled inputs with local state
- The item action icons must be replaced with two buttons:
  - Save (text and icon save)
  - Cancel (text and icon cancel)

Suggested Spanish labels:

```text
Guardar
Cancelar
```

### 3. Cancel Behavior

The Cancel button must:

- Not save any changes.
- Reset the form to the original item values.
- Return the sheet to read-only mode.

### 4. Save Behavior

The Save button must:

- Submit the edited values.
- Validate the data with Zod in the Server Action before updating the database.
- Update only editable fields.
- Return validation errors to the client if validation fails.
- Return to read-only mode after a successful save.
- Refresh/revalidate the affected UI so the sheet and item card show the updated data.

### 4b. Server Action
updateItem(itemId, data) in src/actions/items.ts following the { success, data, error } return pattern. Validates input with Zod, gets session via auth(), validates ownership, calls query function.

### 5. Editable Fields

The following fields are editable for all item types:

- Title
- Description
- Tags

Tags behavior:

- In the UI, tags are edited as comma-separated words.
- On save, split the string by comma.
- Trim each tag.
- Remove empty values.
- Store tags as an array of strings.

### 6. Item-Type Specific Editable Fields

Show editable fields depending on the item type.

#### Content field

Use a textarea for content when item type is one of:

- snippet
- prompt
- command
- note

#### Language field

Use a select input for language when item type is one of:

- snippet
- command

Reuse existing language options if the project already defines them.

If no language options exist, infer them from existing item data or add a small, maintainable list.

#### URL field

Use a text input for URL when item type is:

- link

Validate it as a valid URL in the Server Action.

### 7. Non-Editable Fields

The following fields must remain read-only and must not be editable:

- Item type
- Created date
- Updated date
- Collections where the item is included

These fields may still be displayed in read-only mode, but they must not appear as editable controls.

### 8. Zod Validation

Create or reuse a Zod schema for the update action.

Validation rules:

```text
title       — non-empty string, trimmed
description — string or null, optional
content     — string or null, optional
url         — valid URL string or null, optional
language    — string or null, optional
tags        — array of trimmed non-empty strings
```

Important:

- Validate inside the Server Action before writing to the database.
- Do not trust client-side validation only.
- Return Zod errors using this response shape:

```ts
{
  success: false,
  error: zodError
}
```

or the project’s existing equivalent error format, as long as the client can display field-level errors.

Successful response shape:

```ts
{
  success: true,
  item: updatedItem
}
```

### 9. Server Action Security

The update Server Action must:

- Verify the user is authenticated.
- Verify the item belongs to the authenticated user.
- Validate all input with Zod.
- Update only allowed editable fields.
- Never accept or update `itemType`, `createdAt`, `updatedAt`, or collection membership from this form.
- Return safe errors only.

### 10. UI Error Handling

The client form must:

- Display validation errors returned by the Server Action.
- Keep the user in edit mode when validation fails.
- Show field-level errors when possible.
- Show a generic Spanish error if the update fails unexpectedly.

Suggested Spanish messages:

```text
El título es obligatorio.
La URL no es válida.
No se han podido guardar los cambios.
Cambios guardados correctamente.
```

### 11. Acceptance Criteria

- The item detail Sheet shows an edit icon in the header.
- Clicking the edit icon switches the sheet to edit mode.
- Existing item data is loaded into inputs.
- Item action icons are replaced by Save and Cancel buttons in edit mode.
- Cancel discards changes and returns to read-only mode.
- Save validates with Zod in the Server Action before database update.
- Validation errors are returned as `{ success: false, error }` and displayed in the UI.
- Editable fields are shown according to item type.
- Non-editable fields cannot be modified.
- Tags are edited as comma-separated text and saved as an array.
- The updated item appears correctly after saving.
- Code passes lint, typecheck, build, and Prisma generate if schema/types are affected.
