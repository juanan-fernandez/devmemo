# Code Agent Instructions: Collection Detail Page

## Goal

Create a collection detail page at:

```text
/collections/:id
```

The page must render inside the existing dashboard layout, consistent with the rest of the application.

When the user opens a collection detail page, show the items that belong to that collection using the same item cards used elsewhere in the app.

## Requirements

### 1. Route and Layout

Create the route:

```text
/collections/[id]
```

Requirements:

- The page must be protected.
- Only authenticated users can access it.
- The collection must belong to the authenticated user.
- If the collection does not exist or does not belong to the user, show the project's standard not-found behavior.
- Use the existing dashboard layout, sidebar, spacing, and visual style.

### 2. Header

At the top of the page, show one header row.

Left side:

```text
{collectionName} ({totalItemCount})
```

Right side:

Show action icons for the collection:

- edit collection icon
- favorite/star icon
- delete collection icon

Important:

- Do not implement functionality for these action icons yet.
- The icons can be disabled or have placeholder handlers.
- Add accessible labels in Spanish.

Suggested labels:

```text
Editar colección
Marcar colección como favorita
Eliminar colección
```

### 3. Collection Description

Below the title/header row, show the collection description.

If there is no description, show a Spanish fallback:

```text
Sin descripción
```

### 4. Item Type Filter

Below the collection description, show a select/dropdown to filter items by item type.

Requirements:

- The dropdown must include all item types available in the collection.
- Each option must show:
  - item type label
  - item type icon on the left
  - item type color
- Use existing item type metadata from the project, for example:

```text
@lib/item-types.ts
```

Do not hardcode icons or colors blindly.

Also include an option for all item types.

Suggested Spanish labels:

```text
Todos los tipos
Filtrar por tipo
```

Next to the dropdown, show the total number of items matching the selected filter.

Example:

```text
8 items
```

### 5. Items List

Show the collection items using the same item card component used in the rest of the application.

Requirements:

- Reuse existing item card components.
- Items must belong to the current collection.
- Items must belong to the authenticated user.
- Item card actions should keep working as they do elsewhere.
- If no items match the filter, show an empty state.

Suggested Spanish empty state:

```text
No hay items en esta colección.
```

For filtered empty state:

```text
No hay items de este tipo en esta colección.
```

### 6. Lazy Loading / Infinite Scroll

The collection detail page must support lazy loading by scroll for collection items.

Behavior:

- If the collection has 12 or fewer items, show them without infinite scroll.
- If the collection has more than 12 items, load the first 12 items initially.
- As the user scrolls near the bottom, load the next 12 items.
- Continue loading in batches of 12 until no more items remain.
- Show a loading state while fetching more items.
- Show an end state when all items are loaded if useful.

Suggested Spanish UI copy:

```text
Cargando más items...
No hay más items.
```

When the item type filter changes:

- Reset the current list.
- Load the first 12 items for the selected filter.
- Continue infinite scroll using the selected filter.

### 7. Refresh After Creating an Item

If the user creates a new item while viewing a collection and assigns the item to the collection currently being viewed:

- Refresh the collection detail page data.
- The new item must appear in the collection item list.
- The total collection count must update.
- The filtered count must update if the new item matches the selected filter.

Use the project's existing refresh/revalidation pattern, for example:

- `router.refresh()`
- `revalidatePath`
- `revalidateTag`
- parent callback after item creation

### 8. Data Fetching

Use the project's existing data-fetching pattern.

Recommended server-side fetch parameters:

```ts
{
  collectionId: string
  limit: 12
  cursor?: string | null
  itemType?: string | null
}
```

Recommended response shape:

```ts
{
  items: Item[]
  nextCursor: string | null
  totalCount: number
  filteredCount: number
}
```

Adapt to existing project types and conventions.

### 9. Security

- Always get the authenticated user ID from the server session.
- Never trust a user ID from the client.
- Verify the collection belongs to the authenticated user.
- Fetch only items owned by the authenticated user and linked to the selected collection.
- Do not expose private collection data across users.
- Keep database access server-side.

### 10. Acceptance Criteria

- `/collections/[id]` exists.
- The page renders inside the dashboard layout.
- The page is protected from unauthenticated access.
- The page only shows collections owned by the current user.
- Header shows collection title and total item count.
- Header shows edit, favorite/star, and delete icons with no functionality yet.
- Description is shown below the header.
- Item type filter appears below the description.
- Filter options include item type icon and color.
- The count next to the filter updates according to the selected type.
- Items are rendered using the existing item cards.
- Infinite scroll loads items in batches of 12 when there are more than 12 items.
- Changing the filter resets pagination.
- Creating an item assigned to the current collection refreshes the view.
- Code passes lint, typecheck, and build.
