# global-search-spec

# Current Feature

<!-- Global search for items and collections via shadcn Command -->

## Status

In Progress

## Goals

- Implementar búsqueda global desde el input del dashboard en `dashboard-layout-shell.tsx`.
- Usar shadcn `Command` component para la UI de búsqueda.
- Click en el input → abre el Command. Atajo: `Cmd+B` (macOS) / `Ctrl+B` (Windows/Linux).
- Placeholder: `Buscar items o colecciones... Cmd+B / Ctrl+B`.
- Precargar índice compacto de items y colecciones del usuario autenticado al cargar el dashboard.
- Resultados agrupados en `Items` y `Colecciones`.
- Orden inicial: más recientes primero (`createdAt` descendente).
- Búsqueda fuzzy client-side: items por título, descripción, tipo y tags; colecciones por nombre.
- Cada resultado de item muestra: título, icono del tipo, color del tipo, descripción opcional.
- Cada resultado de colección muestra: icono de carpeta, nombre, contador de items `(12)`.
- Seleccionar item → abre el Sheet de detalle existente.
- Seleccionar colección → navega a la página de detalle de colección.
- Tecla Escape cierra el Command. Seleccionar un resultado cierra el Command.
- Empty state en español: `No se encontraron resultados.`
- Solo datos del usuario autenticado. La navegación sigue usando rutas protegidas.
- Pasar lint, typecheck y build.

## Notes

- Search input en `@components/dashboard/dashboard-layout-shell.tsx`.
- Usar `@lib/item-types.ts` para iconos y colores de tipos (fuente canónica).
- Reutilizar funciones de BD existentes si es posible. Datos cargados server-side, búsqueda client-side.
- Índice compacto: solo metadata (título, descripción, tipo, tags, icono, color, fecha). No incluir contenido grande de items.
- Al seleccionar un item, si se necesita contenido completo → fetch bajo demanda (como ya hace el Sheet).
- Colecciones: incluir id, nombre, contador, fecha.
- shadcn Command ya está instalado en el proyecto o debe añadirse. Usar filtrado integrado de Command o fuzzy search ligero.
- Reutilizar `useItemRow` hook y `ItemDetailSheet` existentes para abrir el Sheet.
- El dashboard layout ya es server component que pasa datos al shell cliente — precargar ahí los datos de búsqueda.

## History

<!-- refers to the file @context/history.md -->
