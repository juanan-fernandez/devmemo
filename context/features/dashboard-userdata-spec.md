# Dashboard Sidebar User information Spec

## Overview

- In the sidebar, replace the mock data related to the user data at the bottom of the sidebar.
  Instead of using data from @lib/mock-data.ts, it should be from our Supabase database using Prisma.

## Requirements

- add the needed functions in lib/db/user.ts to retrive the information about the user.
- Fetch data directly in server component
- Keep the current design. You can reference the screenshot

## References

Check the `@context/stich/screens/mainScren.png` screenshot if needed.
