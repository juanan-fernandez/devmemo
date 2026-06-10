# Dashboard Collections Spec

## Overview

Replace the mock data related to collections displayed in the main area of the dashboard (right side), with actual data from the database. It should look with the 6 cards of recent collections, but instead of using data from @lib/mock-data.ts, it should be from our Supabase database using Prisma.

Do not add the items underneath yet. We will do that later.

## Requirements

- Create lib/db/collections.ts with data fetching functions
- Fetch collections directly in server component
- Collection card border color derived from most-used content type in that collection
- Show small icons of all types in that collection
- Keep the current design. You can ference the screenshot
- Update collection stats display

## References

Check the `@context/stich/screens/mainScren.png` screenshot if needed.
