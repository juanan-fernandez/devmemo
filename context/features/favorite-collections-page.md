# Code Agent Instructions: Favorite Collections Page

## Goal

Implement the **Ver Favoritas** option in the dashboard sidebar collections section.

Target file:

```text
@components/dashboard/sidebar.tsx
```

Clicking **Ver Favoritas** must show a page with all favorite collections.

Important: reuse the existing `/collections` page behavior as much as possible, filtering it to show only favorite collections.

The same page must also be reachable from the dashboard stats header by clicking the corresponding summary card.

Target file:

```text
@components/dashboard/dashboard-summary-card.tsx
```

## Requirements

### 1. Route

Create or reuse a route for favorite collections.

Preferred options:

```text
/collections?filter=favorites
```

or:

```text
/collections/favorites
```

Prefer the query-param approach if it allows reusing the existing `/collections` page with minimal duplication.

The page must:

- Render inside the dashboard layout.
- Be protected.
- Show only collections owned by the authenticated user.
- Show only collections marked as favorite.

### 2. Reuse `/collections`

Reuse the existing `/collections` implementation as much as possible.

Do not duplicate collection listing logic.

The favorite collections view must keep the same behavior as `/collections`:

- same layout
- same collection cards/list UI
- same sorting Select
- same infinite scroll pagination
- same loading and empty states style

Only add a favorite filter.

### 3. Pagination

Pagination must work exactly like `/collections`.

Requirements:

- Load the first 9 favorite collections initially.
- Load the next 9 as the user scrolls.
- Preserve the current sorting option.
- Reset pagination when sorting changes.
- Never load non-favorite collections in this view.

### 4. Sorting

Keep the same sorting options as `/collections`:

```text
Más recientes primero
Más antiguas primero
Nombre A-Z
Nombre Z-A
```

The sorting must apply only to favorite collections when the favorite filter is active.

### 5. Sidebar Link

Update:

```text
@components/dashboard/sidebar.tsx
```

The **Ver Favoritas** option in the collections section must navigate to the favorite collections view.

Suggested Spanish label:

```text
Ver favoritas
```

Ensure the active/sidebar state works if the project has active link styling.

### 6. Dashboard Summary Card Link

Update:

```text
@components/dashboard/dashboard-summary-card.tsx
```

The corresponding favorite collections summary card in the dashboard stats header must navigate to the same favorite collections view.

Do not duplicate navigation logic if there is already a shared route constant.

### 7. Data Fetching

Update the existing collection fetching logic to support a favorites-only filter.

Suggested parameter:

```ts
{
  limit: 9
  cursor?: string | null
  sort: "createdAt-desc" | "createdAt-asc" | "name-asc" | "name-desc"
  favoritesOnly?: boolean
}
```

When `favoritesOnly` is true:

- query only collections with favorite flag enabled
- keep ownership filtering by authenticated user
- keep pagination and sorting behavior unchanged

### 8. Empty State

If the user has no favorite collections, show a Spanish empty state.

Suggested copy:

```text
No tienes colecciones favoritas todavía.
Marca una colección como favorita para verla aquí.
```

### 9. Security

- Always use the authenticated user ID from the server session.
- Never trust a user ID from the client.
- Do not show collections from other users.
- Keep database queries server-side.

## Acceptance Criteria

- Clicking **Ver Favoritas** in the sidebar opens the favorite collections view.
- Clicking the favorite collections dashboard summary card opens the same view.
- The view reuses `/collections` behavior instead of duplicating the page.
- Only favorite collections are shown.
- Pagination loads favorite collections in batches of 9.
- Sorting works correctly with the favorite filter.
- Empty state is shown when there are no favorite collections.
- The page is protected and user-scoped.
- Code passes lint, typecheck, and build.
