# Current Feature: Favorite Items Listing Page (`/items/favorites`)

## Summary

On the dashboard home screen there is a card showing the total number of favorite items. Clicking that card must navigate the user to a new page listing **only the items marked as favorite** belonging to the authenticated user, paginated via infinite scroll.

This feature reuses the exact same logic, structure and UX as the "all items" listing (`/items`), scoped down to favorites only.

## Goal

Implement a favorites listing page reachable from the "Favorite items" dashboard card, consistent with the rest of the app's listings (layout, styling, patterns), using lazy-loaded infinite scroll in batches of 9.

## Requirements

### Navigation

- The dashboard card that shows the total number of favorite items must become clickable (link or button navigating to `/items/favorites`).
- Clicking it routes to the new `/items/favorites` page.

### Route & layout

- Create a new route: `/items/favorites`.
- The page must render **inside the current dashboard layout** — same shell, nav, header, and container structure used by the other listing pages in the app (including `/items`). Do not create a new layout or a separate visual structure.
- Match the existing visual style of the app exactly, and reuse the same components/patterns used to build `/items`. If it makes sense, extract/reuse shared UI (list, item card, sort dropdown, spinner, end-of-list message, empty state) rather than duplicating markup between `/items` and `/items/favorites`.

### Data & pagination

- Priority: implement data fetching with **Server Actions** (per project conventions), reusing the same server action used for `/items` where possible, extended with a `favoritesOnly` filter — or a dedicated server action if that fits the existing conventions better. Avoid duplicating query logic; prefer a single parameterized data-access function.
- **Must only return items owned by the authenticated user AND marked as favorite.** Never expose or leak items belonging to other users, and never include non-favorite items. Enforce both filters at the query/server-action level, not just in the UI.
- First render: load and show the first **9** favorite items.
- Infinite scroll: as the user scrolls near the bottom of the list, fetch and append the next batch of **9** favorite items.
- Keep loading in batches of 9 until there are no more favorite items to load.
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

- While fetching the next batch, show a spinner or other loading indicator consistent with the app's existing loading UI (same as `/items`).
- When there are no more favorite items left to load, show an "end of list" message.
- When the user has **zero favorite items total**, show this exact message in Spanish:
   > No tienes items favoritos todavía.

## Non-goals / constraints

- Do not build a new layout or duplicate the dashboard shell — reuse the existing one.
- Do not fetch or display items from other users under any circumstance.
- Do not fetch or display non-favorite items on this page under any circumstance.
- Do not duplicate the `/items` implementation wholesale — factor out shared logic/components where reasonable, and only branch on the "favorites only" filter.
- Do not switch away from Server Actions unless there's a concrete technical blocker (explain it if so).

## Acceptance checklist

- [ ] Dashboard "favorite items" card is clickable and navigates to `/items/favorites`.
- [ ] `/items/favorites` renders inside the existing dashboard layout, matching app styling and reusing shared components from `/items` where sensible.
- [ ] Initial load shows exactly 9 favorite items, newest first (by `createdAt`).
- [ ] Scrolling near the bottom loads the next 9 favorite items automatically, repeating until exhausted.
- [ ] A loading indicator appears while each batch loads.
- [ ] An "end of results" message appears once all favorite items are loaded.
- [ ] Sort dropdown works for all 4 combinations (`createdAt`/`title` × asc/desc) and resets pagination on change.
- [ ] Only the authenticated user's **favorite** items are ever returned or rendered — verified at the server-action layer (both ownership and favorite filters).
- [ ] Empty state shows: "No tienes items favoritos todavía."
- [ ] Data fetching uses Server Actions.
- [ ] Reuses `@/lib/hooks/use-infinite-scroll` instead of a new implementation.
