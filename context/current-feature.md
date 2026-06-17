# favorite-collections-page

# Current Feature

<!-- Favorite Collections Page via query param + sidebar/summary links -->

## Status

In Progress

## Goals

- Reutilizar `/collections` con query param `?filter=favorites` para mostrar solo colecciones favoritas.
- Añadir `favoritesOnly?: boolean` a `getCollectionsPaginated()` y al server action.
- Actualizar sidebar: "Ver Favoritas" navega a `/collections?filter=favorites`.
- Actualizar `DashboardSummaryCard` de colecciones favoritas para navegar a la misma vista.
- Mismo layout, cards, sort, infinite scroll y paginación (lotes de 9).
- Empty state específico: "No tienes colecciones favoritas todavía. Marca una colección como favorita para verla aquí."
- Pasar lint, typecheck y build.

## Notes

- Query param `filter=favorites` — la página `/collections` lo lee y pasa `favoritesOnly: true`.
- `getCollectionsPaginated` ya usa `prisma.collection.findMany({ where: { userId } })` — añadir `isFavorite: true` cuando `favoritesOnly`.
- El sidebar ya tiene `favoriteCollectionsCount` y un enlace "Ver todas" (actualmente `/collections`).
- `DashboardSummaryCard` de colecciones favoritas ya existe, solo necesita el href correcto.

## History

<!-- refers to the file @context/history.md -->
