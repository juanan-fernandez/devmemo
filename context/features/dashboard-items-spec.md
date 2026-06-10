# Dashboard Collections Spec

## Overview

Replace the mock data related to items displayed in the main area of the dashboard (right side), with actual data from the database. If there is no pinned items it should show the 6 last recent added items. In this case the title must be "ÚLTIMOS ITEMS". In case there are pinned items the screen must show all the pinned items. You must keep the current design.
Instead of using data from @lib/mock-data.ts, it should be from our Supabase database using Prisma.

## Requirements

- Create lib/db/items.ts with data fetching functions
- Fetch collections directly in server component
- Keep the current design. You can reference the screenshot
- Update items stats display

## References

Check the `@context/stich/screens/mainScren.png` screenshot if needed.
