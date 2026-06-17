# collections-page-infinite-scroll

# Current Feature

<!-- Collections Page with Infinite Scroll -->

## Status

In Progress

## Goals

- Crear la página protegida `/collections` dentro del dashboard layout existente.
- Cargar las primeras 9 colecciones del usuario autenticado (orden: `createdAt desc`).
- Implementar infinite scroll: cargar lotes de 9 al acercarse al final de la lista.
- Mostrar estado de carga `Cargando más colecciones...` y estado final `No hay más colecciones.`.
- Select de ordenación con opciones: `Más recientes primero`, `Más antiguas primero`, `Nombre A-Z`, `Nombre Z-A`.
- Cambiar el orden reinicia la lista y vuelve a cargar la primera página.
- Componente de infinite scroll aislado para reutilización en otras listas.
- Usar cursor-based pagination si ya existe en el proyecto; offset si no.
- Empty state: `No tienes colecciones todavía.` con botón de crear colección.
- Seguridad: siempre usar el userId de la sesión, nunca del cliente.
- Pasar lint, typecheck y build.

## Notes

- Fetch function shape: `{ limit: 9, cursor?: string | null, sort: "createdAt-desc" | "createdAt-asc" | "name-asc" | "name-desc" }`.
- Response shape: `{ collections: Collection[], nextCursor: string | null }`.
- Usar `LatestCollectionCard` existente si es reutilizable como card de colección.
- Reutilizar `CreateCollectionDialog` para el empty state.
- Labels en español: `Colecciones`, `Ordenar por`, `Sin descripción`, `Cargando más colecciones...`, `No hay más colecciones.`.
- El spec pide aislar el infinite scroll en un componente reutilizable.

## History

<!-- refers to the file @context/history.md -->
