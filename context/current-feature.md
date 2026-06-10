# Current Feature

Dashboard Sidebar User Information from Database

## Status

Completed

## Goals

- Replace the mock data used for the user info at the bottom of the sidebar with real data from the Supabase database via Prisma.
- Create `lib/db/user.ts` with the required data fetching functions.
- Fetch user data directly in the server component.
- Keep the current design unchanged.

## Notes

- Reference spec: `@context/features/dashboard-userdata-spec.md`
- Screenshot reference: `@context/stich/screens/mainScren.png`
- Data must come from Supabase through Prisma, not from `@lib/mockdata.ts`.
- The sidear user section shows avatar, email, and name.

## History

Complete the `@context/history.md` file when the feature is done.
