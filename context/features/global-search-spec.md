# Code Agent Instructions: Global Search for Items and Collections

## Goal

Implement a global search feature for items and collections stored in the database.

The search UI must be triggered from the search input in:

```text
@components/dashboard/dashboard-layout-shell.tsx
```

When the user clicks the search input, open the shadcn `Command` component.

## Requirements

### 1. Search Trigger

Update the search input in `dashboard-layout-shell.tsx`.

Behavior:

- Clicking the input opens the shadcn `Command` search UI.
- Keyboard shortcut opens the same search UI:
  - `Cmd + B` on macOS
  - `Ctrl + B` on Windows/Linux
- The input placeholder must briefly explain both shortcuts.

Suggested Spanish placeholder:

```text
Buscar items o colecciones... Cmd+B / Ctrl+B
```

### 2. Command Component

Use the shadcn `Command` component.

The search results must be divided into two groups:

1. Items
2. Collections

Suggested Spanish group labels:

```text
Items
Colecciones
```

### 3. Initial Result Ordering

Before the user filters/searches, entries must be loaded from newest to oldest.

Ordering:

- Items: newest first.
- Collections: newest first.

Use `createdAt` or the closest existing timestamp field.

### 4. Data Loading

Preload all searchable/indexable data when the dashboard layout/app starts.

Requirements:

- Load only data for the authenticated user.
- Reuse existing database retrieval functions if possible.
- Avoid duplicating query logic.
- Keep database access server-side.
- Pass the searchable data to the client search component.
- Search itself must run client-side.

Searchable data should include enough information for:

Items:

- id
- title
- description
- item type
- tags
- icon/color metadata
- created date
- any data needed to open the item Sheet

Collections:

- id
- name
- item count
- created date
- any route or handler needed to open the collection item list

### 5. Item Result Display

Each item result must show:

- item title
- item type icon
- item type color
- optional description or type label if useful

Use item type metadata from the existing project source of truth, for example:

```text
@lib/item-types.ts
```

Do not hardcode item icons or colors blindly.

### 6. Collection Result Display

Each collection result must show:

- folder icon
- collection name
- number of items in parentheses

Example:

```text
📁 Work notes (12)
```

Use the project’s existing icon library for the folder icon.

### 7. Fuzzy Client-Side Search

Implement client-side fuzzy search/filtering.

The search must match items by:

- title
- description
- item type
- tags

For collections, match by:

- collection name

Implementation options:

- Use the built-in shadcn Command filtering if sufficient.
- Use a small fuzzy-search utility if already present in the project.
- Add a lightweight dependency only if justified and consistent with the project.

The Command component must filter results as the user types.

### 8. Selecting a Result

When the selected result is an item:

- Open the item detail Sheet with that item’s content.
- Do not navigate away unless the current app pattern requires it.
- Reuse the existing item Sheet orchestration if possible.

When the selected result is a collection:

- Open the collection with its list of items.
- Use the existing route or navigation pattern for collections.
- If collections are represented as filtered item lists, navigate to or activate that view.

### 9. Keyboard and UX

- The Command dialog should close when pressing Escape.
- Selecting a result should close the Command dialog.
- The search input should focus inside the Command when opened.
- Empty state must be in Spanish.

Suggested Spanish copy:

```text
No se encontraron resultados.
Buscar items o colecciones...
```

### 10. Security

- Only preload data belonging to the authenticated user.
- Do not expose other users’ items or collections.
- Do not trust client-side filtering for authorization.
- Item opening and collection navigation must still rely on existing protected routes/server checks.

### 11. Performance

- Keep the preloaded index compact.
- Do not include large item content unless it is required to open the Sheet without another fetch.
- If item content is large, preload metadata only and fetch full item detail when selected.
- Avoid unnecessary repeated database calls.

### 12. Acceptance Criteria

- Clicking the search input opens the shadcn Command search UI.
- `Cmd + B` on macOS opens the search UI.
- `Ctrl + B` on Windows/Linux opens the search UI.
- The search input placeholder mentions both shortcuts.
- Results are grouped into Items and Collections.
- Initial results are ordered newest to oldest.
- Item results show the correct icon and color.
- Collection results show a folder icon, name, and item count.
- Search filters client-side as the user types.
- Item search matches title, description, item type, and tags.
- Selecting an item opens its Sheet.
- Selecting a collection opens its item list.
- Only the authenticated user’s data is searchable.
- Code passes lint, typecheck, and build.
