# Code Agent Instructions: Create Collection Dialog Form

## Goal

Implement a form to create new collections.

The form must open inside a shadcn `Dialog` component and be triggered from the **Nueva Colección** button located in:

```text
app/dashboard/page.tsx
```

After saving, refresh the underlying UI and close the Dialog.

## Requirements

### 1. Dialog Form

Create a collection creation form inside a shadcn `Dialog`.

The form must request only:

- `name`
- `description`

Suggested Spanish labels:

```text
Nueva colección
Nombre
Descripción
Guardar
Cancelar
```

### 2. Trigger Button

Use the existing **Nueva Colección** button in:

```text
app/dashboard/page.tsx
```

Clicking this button must open the Dialog.

Do not create a second duplicate button unless required by the current component structure.

### 3. Form Buttons

At the bottom of the form, show two buttons:

- `Guardar`
- `Cancelar`

The buttons must follow the same visual style used by the buttons in:

```text
components/items/create-item-dialog.tsx
```

Requirements:

- `Guardar` submits the form.
- `Cancelar` closes the Dialog without saving.
- Use the same icon/text style as `CreateItemForm` if available.
- Disable `Guardar` while submitting if the project already uses pending/loading states.

### 4. Server Action

Prioritize Server Actions.

Create or reuse an action for collection creation, for example:

```text
actions/collections/createCollection
```

The action must:

- Verify the user is authenticated.
- Validate input before writing to the database.
- Create the collection for the authenticated user only.
- Return a safe success/error response.
- Revalidate affected paths or tags.

Suggested affected path:

```text
/dashboard
```

Also revalidate any route where collections are listed.

### 5. Validation

Use the project's existing validation approach. If Zod is already used, use Zod.

Recommended rules:

- `name`:
  - required
  - trimmed
  - non-empty string
- `description`:
  - optional
  - trimmed
  - string or `null`

Suggested Spanish errors:

```text
El nombre de la colección es obligatorio.
No se ha podido crear la colección.
```

### 6. Success Behavior

After successful creation:

1. Show a Spanish success message if the project has a toast/message pattern.
2. Refresh the underlying UI so the new collection appears.
3. Close the Dialog.

Suggested success message:

```text
Colección creada correctamente.
```

### 7. Cancel Behavior

When clicking `Cancelar`:

- Do not save anything.
- Reset the form if appropriate.
- Close the Dialog.

### 8. Security

- Do not trust user IDs from the client.
- Use the authenticated user from the server session.
- Do not allow creating collections for another user.
- Keep database writes server-side.
- Do not expose internal errors to the UI.

## Acceptance Criteria

- The **Nueva Colección** button opens a shadcn Dialog.
- The Dialog contains only `name` and `description` fields.
- The form footer has `Guardar` and `Cancelar` styled like `CreateItemForm`.
- `Cancelar` closes the Dialog without saving.
- `Guardar` creates the collection for the authenticated user.
- Input is validated before database write.
- After successful save, the UI refreshes and the Dialog closes.
- The new collection appears in the dashboard UI.
- Code passes lint, typecheck, and build.
