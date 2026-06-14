# item-list-spec

# Current Feature

<!-- Feature Name -->

## Status

In Progress

## Goals

- Create dynamic route `/items/[type]` (e.g., /items/snippets, /items/notes) that displays items filtered by type.
- the route must be created under app at same level as profile, dashboard, etc.
- Fetch and display items filtered by type, ordered from latest to earliest
- Build a responsive grid of ItemCard components
- Respect the dashboard layout (sidebar, header, shell)
- Each card has a left border colored by item type

## Notes

- The `ItemCard` component already exists at `components/items/item-card.tsx` and can be reused directly
- `lib/item-types.ts` provides `CANONICAL_SYSTEM_ITEM_TYPES` and `getItemTypeHref()` which generates slugs like `/items/snippets`, `/items/notas`
- `lib/db/items.ts` already has query patterns (`getDashboardItemsSection`, `getSidebarItemTypes`) that can be extended
- The dashboard layout (`app/dashboard/layout.tsx`) wraps children with `DashboardLayoutShell` — the new route should be inside its subtree
- Slug resolution must handle diacritics (e.g., `Imágenes` → `imagenes`, `Comandos` → `comandos`) via `getItemTypeHref()`
- `getItemTypeHref()` strips diacritics and produces kebab-case slugs from `ItemType.name`

## History

<!-- refers to the file @context/history.md -->
