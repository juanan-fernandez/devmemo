# create-collection-spec

# Current Feature

<!-- Create Collection Dialog Form -->

## Status

In Progress

## Goals

- Implement a form to create new collections inside a shadcn `Dialog`.
- Trigger the Dialog from the existing **Nueva Colección** button in `app/dashboard/page.tsx`.
- Create a Server Action `actions/collections/createCollection` that:
  - Verifies the user is authenticated
  - Validates input before writing to the database
  - Creates the collection for the authenticated user only
  - Returns a safe success/error response
  - Revalidates affected paths (`/dashboard` and any route where collections are listed)
- Use Zod validation with rules:
  - `name`: required, trimmed, non-empty string
  - `description`: optional, trimmed, string or null
- Display Spanish error/success messages:
  - `El nombre de la colección es obligatorio.`
  - `No se ha podido crear la colección.`
  - `Colección creada correctamente.`
- After saving, refresh the underlying UI and close the Dialog.
- Match the button style from `components/items/create-item-dialog.tsx`.
- Pass lint, typecheck, and build.

## Notes

- Trigger location: `app/dashboard/page.tsx` (existing **Nueva Colección** button).
- Suggested action path: `actions/collections/createCollection`.
- Form fields: `name`, `description`.
- Spanish labels: `Nueva colección`, `Nombre`, `Descripción`, `Guardar`, `Cancelar`.
- Affected path for revalidation: `/dashboard`.
- Follow the existing validation approach (Zod).

## History

<!-- refers to the file @context/history.md -->
