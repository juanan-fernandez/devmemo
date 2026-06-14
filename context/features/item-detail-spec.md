# Code Agent Instructions: Item Detail with Shadcn Sheet component

## Goal

Use the Shadcn Sheet component to create a right-side slide-in drawer that opens when clicking an item card. This is the item detail view — there is no separate item page.

## Requirements

### 1. Sheet Component

Use de Sheet component of Shadcn library

### 2. Data to Display

The Sheet component must show the main item information:

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
The extras like the code editor and item-specific stuff will come later. For now, let's just work on the drawer details display.

### 2b. Data fetching

- Card data (title, description, tags, etc.) is fetched by the server component as before
- Full item detail (content, collections, language, etc.) is fetched on click via API route (/api/items/[id])
- Query function lives in lib/db/items.ts, API route calls it with auth check
- Drawer shows a skeleton/loading state while fetching

### 3. Item Types

Inspect the existing item type definitions before implementing.

Check:

```text
@lib/item-types.ts
```

Reuse existing item type icons, colors, labels, and helpers if they exist.

Do not hardcode item type metadata blindly.

### 4. UI Behavior

- Sheet component shows a skeleton/loading state while fetching
- The ui must be responsive.
- It must work well on desktop and mobile.
- Long content should be scrollable inside the Sheet.
- Clear close button.
- Pressing Escape or clicking outside should close it.
- Keep the visual style consistent with the rest of the app.

### 5. Accessibility

- Ensure keyboard navigation works.
- Ensure the close button has an accessible label.

### 6. Integration

Add the dra trigger to the item card/list UI.

When a user clicks an item or a “view details” action:

- Open the sheet component.
- Pass the selected item to the component.
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

- The Sheet opens from the item list/card UI.
- The Sheet displays item details according to the item type.
- Type icon and color match existing item type definitions.
- Empty or missing fields are not shown.
- Long content is readable and scrollable.
- The UI is responsive and accessible.
- The Sheet can be closed properly.
- Code passes lint, typecheck, and build.
