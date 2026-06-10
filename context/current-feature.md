# Current Feature

Dashboard Items from Database

## Status

Completed

## Goals

- Replace the mock data used for the items shown in the main dashboard area with real data from the Supabase database via Prisma.
- If there are pinned items, show all pinned items.
- If there are no pinned items, show the 6 most recently added items.
- When showing recent items, the section title must be `ÚLTIMOS ITEMS`.
- Keep the current design unchanged.
- Create `lib/db/items.ts` with the required data fetching functions.
- Fetch items directly in the server component.
- Update the item stats display.

## Notes

- Reference spec: `@context/features/dashboard-items-spec.md`
- Screenshot reference: `@context/stich/screens/mainScren.png`
- Data source must come from Supabase through Prisma, not from `@lib/mockdata.ts`.

## History

Complete the `@context/history.md` file when the feature is done.

## Completion Notes

- Dashboard items now load from Prisma/Supabase through `lib/db/items.ts`.
- The dashboard shows all pinned items when any exist, otherwise it falls back to the 6 most recent items with the title `ÚLTIMOS ITEMS`.
- The pinned/recent section keeps the existing layout while using database-backed item stats and Spanish labels.
