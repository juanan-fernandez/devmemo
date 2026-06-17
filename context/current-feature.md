# collection-detail-page

# Current Feature

<!-- Collection Detail Page with item list and filtering -->

## Status

In Progress

## Goals

- Crear la ruta protegida `/collections/[id]` dentro del dashboard layout.
- Validar que la colección pertenece al usuario autenticado (si no → notFound).
- Header: `{nombreColección} ({totalItems})` + iconos placeholder (editar, favorito, eliminar) sin funcionalidad.
- Descripción de la colección (fallback: "Sin descripción").
- Filtro por tipo de item con icono + color, opción "Todos los tipos" y contador de items filtrados.
- Lista de items con `ItemCard` reutilizable.
- Infinite scroll con lotes de 12 para colecciones con >12 items.
- Al cambiar el filtro, resetear la lista y recargar.
- Al crear un item asignado a la colección actual, refrescar la vista.
- Spanish labels: "Editar colección", "Marcar colección como favorita", "Eliminar colección", "Todos los tipos", "Filtrar por tipo", "Sin descripción", "Cargando más items...", "No hay más items.", "No hay items en esta colección.", "No hay items de este tipo en esta colección."
- Pasar lint, typecheck y build.

## Notes

- Fetch params: `{ collectionId, limit: 12, cursor?, itemType? }`.
- Response shape: `{ items: Item[], nextCursor: string | null, totalCount: number, filteredCount: number }`.
- Reutilizar `ItemCard` existente.
- Reutilizar `useInfiniteScroll` hook existente para el infinite scroll.
- Usar `CANONICAL_SYSTEM_ITEM_TYPES` de `lib/item-types.ts` para el filtro de tipos.
- Los iconos de acción (editar, favorito, eliminar) son placeholder — no implementar lógica.

## History

<!-- refers to the file @context/history.md -->
