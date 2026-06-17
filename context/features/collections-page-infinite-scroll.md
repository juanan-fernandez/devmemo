# Code Agent Instructions: Collections Page with Infinite Scroll

## Goal

Create a new `/collections` page.

The page must be displayed inside the existing dashboard layout, consistent with the rest of the application.

It must list the authenticated user's collections with lazy loading / infinite scroll.

## Requirements

### 1. Route and Layout

Create the page:

```text
/collections
```

The page must render inside the dashboard layout used by the rest of the authenticated application.

Requirements:

- The page must be protected.
- Only authenticated users can access it.
- Use the existing dashboard layout, sidebar, spacing, and visual style.
- Do not create a separate standalone layout unless the project structure requires it.

### 2. Initial Collection Load

On first render, load the first 9 collections.

Default order:

```text
newest to oldest by createdAt
```

Only load collections owned by the authenticated user.

Do not expose collections from other users.

### 3. Lazy Load / Infinite Scroll

Implement lazy loading with scroll.

Behavior:

- Initially show 9 collections.
- As the user scrolls near the bottom, load the next 9 collections.
- Continue loading in batches of 9 until there are no more collections.
- Show a loading state while fetching the next page.
- Show an end state when all collections are loaded.

Suggested Spanish UI copy:

```text
Cargando más colecciones...
No hay más colecciones.
```

### 4. Sorting Select

At the top of the collection list, show a Select dropdown with sorting options.

Use the project's existing Select component. If the project uses shadcn UI, use the shadcn Select component.

Sorting options:

```text
Más recientes primero
Más antiguas primero
Nombre A-Z
Nombre Z-A
```

Mapping:

- `Más recientes primero` -> `createdAt desc`
- `Más antiguas primero` -> `createdAt asc`
- `Nombre A-Z` -> `name asc`
- `Nombre Z-A` -> `name desc`

Default selected option:

```text
Más recientes primero
```

When the user changes the sort option:

- Reset the list.
- Load the first 9 collections again using the selected order.
- Continue lazy loading with the new sorting mode.

### 5. Data Fetching

Use the existing project data-fetching pattern.

Preferred implementation:

- A server-side data function or Server Action to fetch paginated collections.
- Client component for the infinite scroll behavior if needed.
- Isolate the infinite scroll in a component because we're going to use it in every list.
- Use cursor-based pagination if the project already uses it.
- Offset pagination is acceptable if it matches the current project style.

The fetch function must accept:

```ts
{
  limit: 9,
  cursor?: string | null,
  sort: "createdAt-desc" | "createdAt-asc" | "name-asc" | "name-desc"
}
```

or an equivalent typed structure.

The response should include:

```ts
{
  collections: Collection[]
  nextCursor: string | null
}
```

or the project's existing pagination response shape.

### 6. Collection Card/List UI

Render each collection using the existing collection card/list component if available.

If no component exists, create a small reusable component that shows at least:

- collection name
- description if available
- created date
- number of items if easily available from the existing data model

Do not overbuild the UI.

Suggested Spanish labels:

```text
Colecciones
Ordenar por
Sin descripción
```

### 7. Empty State

If the user has no collections, show an empty state.

Suggested Spanish copy:

```text
No tienes colecciones todavía.
Crea una nueva colección para organizar tus items.
```

If there is already a create collection dialog/button, reuse it.

### 8. Security

- Always use the authenticated user ID from the server session.
- Never trust a user ID from the client.
- Fetch only collections owned by the current user.
- Keep database access server-side.

### 9. Acceptance Criteria

- `/collections` exists.
- `/collections` renders inside the dashboard layout.
- The page is protected from unauthenticated access.
- The first 9 collections load initially.
- Default sort is newest to oldest by `createdAt`.
- Infinite scroll loads the next 9 collections.
- Isolated component for the infinite scroll.
- Loading and end states are shown.
- The sorting Select appears above the list.
- Changing sort resets the list and fetches the first page again.
- Collections are never shown across users.
- Code passes lint, typecheck, and build.
