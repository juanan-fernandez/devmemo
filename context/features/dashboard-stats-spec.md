# Dashboard Sidebar Spec

## Overview

- In the sidebar, replace the mock data related to item types with actual data from the database.
- At the RIGHT of the item type display the number of items for the type.
- First of all create the list with the default types, then if neccessary the user created types.
- the item types must contain a Link to linking to /items/[typename]
- Under the "COLECCIONES' menu must appear 3 sections:
   - First a link to faved collections. (is now showing in the second place)
   - On the second row the "Ver todas" option. Wich will be a link to see a list of all collections. Put a bullet at the left of the option.
   - Then a list of the 6 last added collections with a bullet. The color of the bullet must be the predominant type in the collection.

Instead of using data from @lib/mock-data.ts, it should be from our Supabase database using Prisma.

## Requirements

- add the needed functions in lib/db/items.ts to retrive the information about itemTypes.
- add the needed functions in lib/db/collections.ts to retrive the information about collections.
- Fetch data directly in server component
- Keep the current design. You can reference the screenshot

## References

@lib/db/collections.ts
Check the `@context/stich/screens/mainScren.png` screenshot if needed.
