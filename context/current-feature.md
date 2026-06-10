# Current Feature

Dashboard Collections from Database

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

- Replace mock data for collections in the main dashboard area with real data from the Supabase DB using Prisma.
- Show 6 cards of recent collections (no items underneath yet).
- Create `lib/db/collections.ts` with data fetching functions.
- Fetch collections directly in a server component.
- Derive each collection card's border color from the most-used content type in that collection.
- Show small icons of all content types present in each collection.
- Update collection stats display.
- Keep the current design (reference screenshot if needed).

## Notes

- References:
   - `@context/features/dashboard-collections-spec.md`
   - `@context/stich/screens/mainScreen.png`
- Do not add items underneath the collections yet.
- After implementing, run `npm run build` to verify everything compiles.
