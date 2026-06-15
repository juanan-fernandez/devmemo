# Code Agent Instructions: Create Item Form Dialog

## Goal

Implement a form to create new items.

The form must open inside a modal using the shadcn `Dialog` component. It must be triggered by the **Nuevo** button in the item list.

Prioritize Server Actions, following the project convention of placing actions inside the `actions` folder.

Create a Server Action named:

```text
createItem
```

The action must validate input with Zod before writing to the database.

## Requirements

### 1. Dialog Modal

Use the shadcn `Dialog` component for the create item modal.

Behavior:

- The Dialog opens when the user clicks the **Nuevo** button in the item list.
- The Dialog closes when the user clicks **Cancelar**.
- The Dialog closes after a successful item creation.
- On successful creation, show a Spanish success message and close the Dialog after 2 seconds.
- Do not save anything when the user clicks **Cancelar**.

Suggested Spanish labels:

```text
Nuevo
Guardar
Cancelar
Item creado correctamente.
No se ha podido crear el item.
```

### 2. Item Type Header

The modal opens with the selected item type already completed.

The Dialog header must show:

```text
Nuevo/Nueva [item_type]
```

Use `Nuevo` or `Nueva` according to the item type gender if that metadata exists. If gender metadata does not exist, add it in a maintainable way.

The header must also show:

- the item type icon
- the item type color

To get icon, color, label, and any related metadata, inspect and reuse:

```text
@lib/item-types.ts
```

Do not hardcode item type metadata blindly.

### 3. Select Components

All selects in this form must use the shadcn `Combobox` component.

This includes:

- language selector
- collection selector
- any other select-like field added for this form

Do not use native `<select>` unless the project does not yet have a Combobox component and you are creating one based on shadcn patterns.

### 4. Fields by Item Type

Show fields depending on the item type.

#### All item types

Show:

- `title` — required
- `description` — optional
- `tags` — optional

Tags behavior:

- UI input accepts comma-separated values.
- On save, split by comma.
- Trim each tag.
- Remove empty values.
- Save as an array of strings.

#### Snippet and Command

Show:

- `content` — textarea for now
- `language` — Combobox

The language options must come from:

```text
@lib/items/editable-item.ts
```

Use the constant:

```text
EDITABLE_ITEM_LANGUAGE_OPTIONS
```

#### Prompt and Note

Show:

- `content` — textarea

#### Link

Show:

- `url` — required text input

Validate `url` as a valid URL.

### 5. Textarea Usage

Use a textarea for `content` when the item type is:

- snippet
- note
- command
- prompt

### 6. Collection Selector

At the end of the form, show a collection selector.

Requirements:

- Load the current user's existing collections.
- Allow the user to choose one collection where the new item will be included.
- The collection selector must use the shadcn `Combobox`.
- The collection selection can be optional unless the existing product rules require it.
- Never show collections belonging to other users.

Suggested Spanish label:

```text
Colección
```

### 7. Footer Buttons

At the bottom of the form, show two buttons:

1. Save button
2. Cancel button

Save button:

- Icon: save icon
- Text: `Guardar`
- Submits the form

Cancel button:

- Icon: cancel/close icon
- Text: `Cancelar`
- Does not save anything
- Closes the Dialog

Use the project's existing icon library.

### 8. Server Action: createItem

Create or update a Server Action in the `actions` folder:

```text
createItem
```

The action must:

- Verify the user is authenticated.
- Validate the payload with Zod.
- Create the item in the database.
- Associate it with the authenticated user.
- Optionally associate it with the selected collection.
- Return safe success/error responses.
- Revalidate affected paths or tags after successful creation.

Possible affected paths:

```text
/dashboard
/profile
```

Also revalidate any route where the item list is displayed.

### 9. Zod Validation

Validate in the Server Action before sending data to the database.

Recommended schema behavior:

- `type` — required valid item type
- `title` — required, non-empty trimmed string
- `description` — optional string or null
- `tags` — array of trimmed non-empty strings
- `content` — required or optional depending on item type
- `language` — required or optional depending on item type
- `url` — required valid URL for link items
- `collectionId` — optional string or null

Validation rules by type:

- link requires a valid `url`
- snippet and command may include `language`
- snippet, command, prompt, and note may include `content`
- do not accept fields that are not allowed for the selected item type unless the existing data model requires them

Return validation errors in a client-displayable format, for example:

```ts
{
  success: false,
  error: zodError
}
```

Successful response:

```ts
{
  success: true,
  item: createdItem
}
```

### 10. Security

- Keep item creation server-side.
- Do not trust user IDs from the client.
- Use the authenticated user from the server session.
- Do not allow creating an item inside another user's collection.
- Validate all fields with Zod in the Server Action.
- Do not log sensitive data.

### 11. UI Error Handling

The client form must:

- Display field-level validation errors when possible.
- Keep the Dialog open if validation fails.
- Show a generic Spanish error message for unexpected failures.
- Disable the Save button while submitting if the project has a pending/loading pattern.

Suggested Spanish validation messages:

```text
El título es obligatorio.
La URL no es válida.
Selecciona un lenguaje válido.
No se ha podido crear el item.
```

### 12. Acceptance Criteria

- Clicking **Nuevo** in the item list opens a shadcn Dialog.
- The Dialog opens with the selected item type already set.
- The Dialog header shows `Nuevo/Nueva [item_type]` with the correct icon and color from `@lib/item-types.ts`.
- All select fields use shadcn Combobox.
- Fields are shown according to item type.
- Snippet and command language options come from `EDITABLE_ITEM_LANGUAGE_OPTIONS`.
- Content uses textarea for snippet, note, command, and prompt.
- Link items require a valid URL.
- The form includes a collection Combobox with the current user's collections.
- Footer has `Guardar` with save icon and `Cancelar` with cancel icon.
- Cancel closes the Dialog without saving.
- Save calls `createItem`.
- `createItem` validates with Zod server-side before database write.
- Successful creation shows a Spanish success message and closes the Dialog after 2 seconds.
- The item list refreshes and shows the new item.
- Code passes lint, typecheck, build, and Prisma generate if needed.
