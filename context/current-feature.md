# items-page

# Current Feature

<!-- Página /items con listado completo, sort e infinite scroll -->

## Status

Not Started

## Goals

- Hacer clicable la card de "total items" del dashboard para navegar a `/items`.
- Crear la nueva ruta protegida `/items` dentro del layout actual del dashboard, reutilizando shell, header y contenedor existente.
- Listar todos los items del usuario autenticado con infinite scroll en lotes de 9.
- Reutilizar `@/lib/hooks/use-infinite-scroll` y seguir el patrón visual/estructural de listados existentes (`/collections`, etc.).
- Implementar fetching con Server Actions, nunca con API routes salvo bloqueo real.
- Garantizar que solo se devuelven items del usuario autenticado a nivel de query/server-action.
- Ordenación con Select usando estas opciones: Más recientes primero, Más antiguas primero, Nombre A-Z, Nombre Z-A.
- Orden por defecto: más recientes primero (`createdAt desc`).
- Al cambiar el sort: resetear la lista, volver a cargar los primeros 9 items y continuar el infinite scroll con ese orden.
- Mostrar loading indicator al cargar más resultados.
- Mostrar fin de lista con mensaje: "No hay más items".
- Si no hay items, mostrar exactamente: "No tienes items todavía.".
- Pasar lint, typecheck y build.

## Notes

- La card del dashboard que muestra el total de items debe convertirse en link/botón hacia `/items`.
- El listado debe seguir el estilo actual de la app; reutilizar componentes, clases y patrones ya existentes.
- Batch size fijo: 9 items por carga inicial y por cada carga adicional.
- Mapeo de sort:
   - Más recientes primero → `createdAt desc`
   - Más antiguas primero → `createdAt asc`
   - Nombre A-Z → `title asc`
   - Nombre Z-A → `title desc`
- La spec menciona "collections" en un punto del reset del sort, pero el objetivo es `/items`; aplicar la misma lógica a items.
- Revisar y reutilizar los patrones de `/collections` para paginación, end state, spinner y Select.

## History

<!-- refers to the file @context/history.md -->
