# Code Agent Instructions: Item Detail Modal

## Goal

Prepare a reusable modal to display the details of a saved item.

The modal should be opened from the item list/card UI when the user wants to view an item in detail.

## Requirements

### 1. Modal Component

Use de Dialog component of Shadcn library


### 2. Data to Display

The modal must show the main item information:

- Title or name
- Type
- Type icon
- Type color
- ItemActions icons
- Description or content preview
- Full content when applicable
- URL when applicable
- File/image metadata when applicable
- Tags if available
- Collection if available
- Created date
- Updated date if available
- Related Tags

Adapt the displayed fields to the item type.

If some fields do not exist for a given item type, do not render empty sections.

### 2b. Data fetching

 - Card data (title, description, tags, etc.) is fetched by the server component as before
 - Full item detail (content, collections, language, etc.) is fetched on click via API route (/api/items/[id])
 - Query function lives in lib/db/items.ts, API route calls it with auth check
 - Modal shows a skeleton/loading state while fetching
 
### 3. Item Types

Inspect the existing item type definitions before implementing.

Check:

```text
@lib/item-types.ts
```

Reuse existing item type icons, colors, labels, and helpers if they exist.

Do not hardcode item type metadata blindly.

### 4. UI Behavior

- Modal shows a skeleton/loading state while fetching
- The modal must be responsive.
- It must work well on desktop and mobile.
- Long content should be scrollable inside the modal.
- The modal must have a clear close button.
- Pressing Escape or clicking outside should close it if this matches the project’s existing modal behavior.
- Keep the visual style consistent with the rest of the app.

### 5. Accessibility

- Use semantic dialog/modal markup from the existing UI library.
- Provide a clear modal title.
- Ensure keyboard navigation works.
- Ensure the close button has an accessible label.

### 6. Integration

Add the modal trigger to the item card/list UI.

When a user clicks an item or a “view details” action:

- Open the modal.
- Pass the selected item to the modal.
- Do not navigate away from the current page.

Avoid loading all extra data client-side if the item detail requires server-only data. Use the existing data-fetching pattern if more detail must be loaded.

### 7. Spanish UI Copy

Use Spanish for user-facing labels.

Suggested labels:

```text
Detalles del item
Tipo
Colección
Etiquetas
Creado
Actualizado
Abrir enlace
Cerrar
```

### 8. Acceptance Criteria

- A reusable item detail modal component exists.
- The modal opens from the item list/card UI.
- The modal displays item details according to the item type.
- Type icon and color match existing item type definitions.
- Empty or missing fields are not shown.
- Long content is readable and scrollable.
- The modal is responsive and accessible.
- The modal can be closed properly.
- Code passes lint, typecheck, and build.
