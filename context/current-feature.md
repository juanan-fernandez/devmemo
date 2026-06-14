# item-detail-spec

# Current Feature

<!-- Feature Name -->

## Status

In Progress

## Goals

- Use the Shadcn **Sheet** component to create a right-side slide-in drawer for item details
- Open the Sheet when clicking an item card or item list entry
- Treat the Sheet as the item detail view — there is no separate item page
- Fetch full item detail on click through `/api/items/[id]`
- Implement a query function in `lib/db/items.ts` used by the API route with auth checks
- Show a skeleton/loading state while full item data is loading inside the Sheet
- Display item details according to item type, rendering only fields that exist for that type
- Reuse existing item type metadata (icons, colors, labels, helpers) from `lib/item-types.ts`
- Include `ItemActions` icons in the Sheet detail UI
- Keep the Sheet responsive, accessible, and visually consistent with the rest of the app
- Support Escape and outside click to close the Sheet
- Use Spanish copy for all user-facing labels
- Ensure long content is scrollable inside the Sheet

## Notes

- The spec requires **Sheet**, not Dialog or modal
- The UI is a **right-side slide-in drawer**
- The full detail should include: title, type, type icon/color, ItemActions, description/content preview, full content when applicable, URL when applicable, file/image metadata when applicable, tags if available, collection if available, created date, updated date if available, and related tags
- Card/list data continues to be fetched by the existing server components; the extra detail is fetched lazily on click via API route
- The API route should live at `/api/items/[id]`
- The trigger should be attached to item card/list UI, likely `ItemCard` and any future list/detail triggers
- The extras like code editor and deeper item-specific behavior come later; this feature focuses on the drawer detail display only
- Suggested Spanish UI copy: "Detalles del item", "Tipo", "Colección", "Etiquetas", "Creado", "Actualizado", "Abrir enlace", "Cerrar"
- Empty or missing fields must not render empty sections
- Acceptance criteria require lint, typecheck, and build to pass

## History

<!-- refers to the file @context/history.md -->
