# Current Feature: Items Listing Page (`/items`)

## Summary

On the dashboard home screen there is a card showing the total count of created items. Clicking that card must navigate the user to a new `/items` page listing **all** items belonging to the authenticated user, paginated via infinite scroll.

## Goal

Implement a full listing page reachable from the "Total items" dashboard card, consistent with the rest of the app's listings (layout, styling, patterns), using lazy-loaded infinite scroll in batches of 9.

## Requirements

### Navigation

- The dashboard card that shows the total number of created items must become clickable (link or button navigating to `/items`).
- Clicking it routes to the new `/items` page.

### Route & layout

- Create a new route: `/items`.
- The page must render **inside the current dashboard layout** — same shell, nav, header, and container structure used by the other listing pages in the app. Do not create a new layout or a separate visual structure.
- Match the existing visual style of the app exactly (spacing, cards, typography, colors, empty states, etc.) — reuse existing UI components/classes wherever the other listings already do.

### Data & pagination

- Priority: implement data fetching with **Server Actions** (per project conventions — avoid API routes unless a server action genuinely cannot cover the case).
- **Must only return items owned by the authenticated user.** Never expose or leak items belonging to other users. Enforce this filter at the query/server-action level, not just in the UI.
- First render: load and show the first **9** items.
- Infinite scroll: as the user scrolls near the bottom of the list, fetch and append the next batch of **9** items.
- Keep loading in batches of 9 until there are no more items to load.
- Reuse the existing hook: `@/lib/hooks/use-infinite-scroll` — do not reimplement infinite scroll logic from scratch.

### Sorting

At the top of the items list, show a Select dropdown with sorting options.

Use the project's existing Select component. If the project uses shadcn UI, use the shadcn Select component.

Sorting options:

```text
Más recientes primero
Más antiguos primero
Nombre A-Z
Nombre Z-A
```

Mapping:

- `Más recientes primero` -> `createdAt desc`
- `Más antiguos primero` -> `createdAt asc`
- `Nombre A-Z` -> `title asc`
- `Nombre Z-A` -> `title desc`

Default selected option:

```text
Más recientes primero
```

When the user changes the sort option:

- Reset the list.
- Load the first 9 collections again using the selected order.
- Continue lazy loading with the new sorting mode.

### Loading & end states

- While fetching the next batch, show a spinner or other loading indicator consistent with the app's existing loading UI.
- When there are no more items left to load, show an "No hay más items message.
- When the user has **zero items total**, show this exact message in Spanish:
   > No tienes items todavía.

## Non-goals / constraints

- Do not build a new layout or duplicate the dashboard shell — reuse the existing one.
- Do not fetch or display items from other users under any circumstance.
- Do not switch away from Server Actions unless there's a concrete technical blocker (explain it if so).

## Acceptance checklist

- [ ] Dashboard "total items" card is clickable and navigates to `/items`.
- [ ] `/items` renders inside the existing dashboard layout, matching app styling.
- [ ] Initial load shows exactly 9 items, newest first (by `createdAt`).
- [ ] Scrolling near the bottom loads the next 9 items automatically, repeating until exhausted.
- [ ] A loading indicator appears while each batch loads.
- [ ] An "No hay más items" message appears once all items are loaded.
- [ ] Sort dropdown works for all 4 combinations (`createdAt`/`title` × asc/desc) and resets pagination on change.
- [ ] Only the authenticated user's items are ever returned or rendered — verified at the server-action layer.
- [ ] Empty state shows: "No tienes items todavía."
- [ ] Data fetching uses Server Actions.
- [ ] Reuses `@/lib/hooks/use-infinite-scroll` instead of a new implementation.
- [ ] Code passes lint, typecheck, and build.
