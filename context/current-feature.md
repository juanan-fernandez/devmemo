# Current Feature

Dashboard Sidebar from Database

## Status

Completed

## Goals

- Replace the mock data used in the sidebar item types section with real data from the Supabase database via Prisma.
- Show the number of items for each item type on the left side of the type display.
- List the default system item types first, then user-created item types if any exist.
- Make each item type link to `/items/[typename]`.
- Under the `COLECCIONES` menu, show these sections in this order:
  - first, a link to favorite collections
  - second, a `Ver todas` link to the full collections list, with a bullet on the left
  - third, a list of the 6 most recently added collections, each with a bullet colored by the collection's predominant item type
- Replace the mock collections data in the sidebar with real data from Prisma/Supabase.
- Add the needed data access functions in `lib/db/items.ts` for item types.
- Add the needed data access functions in `lib/db/collections.ts` for sidebar collections.
- Fetch data directly in the server component.
- Keep the current design unchanged.

## Notes

- Reference spec: `@context/features/dashboard-stats-spec.md`
- Reference file: `@lib/db/collections.ts`
- Screenshot reference: `@context/stich/screens/mainScren.png`
- Data must come from Supabase through Prisma, not from `@lib/mock-data.ts`.

## History

Complete the `@context/history.md` file when the feature is done.
