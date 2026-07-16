# items-favs-list

# Current Feature

<!-- Página /items/favorites con listado de items favoritos e infinite scroll -->

## Status

Not Started

## Goals

- Hacer clicable la card de "favorite items" del dashboard para navegar a `/items/favorites`.
- Crear la nueva ruta protegida `/items/favorites` dentro del layout actual del dashboard, reutilizando shell, header, contenedor y patrones visuales de `/items`.
- Listar solo los items favoritos del usuario autenticado con infinite scroll en lotes de 9.
- Reutilizar `@/lib/hooks/use-infinite-scroll` y evitar reimplementar la lógica de scroll infinito.
- Reutilizar la lógica ya creada para `/items` y factorizar donde tenga sentido en vez de duplicar implementación.
- Implementar fetching con Server Actions, preferiblemente extendiendo la query/acción actual con un filtro `favoritesOnly`.
- Garantizar a nivel de query/server-action que solo se devuelven items del usuario autenticado y además marcados como favoritos.
- Ordenación con Select usando: Más recientes primero, Más antiguos primero, Nombre A-Z, Nombre Z-A.
- Orden por defecto: más recientes primero (`createdAt desc`).
- Al cambiar el sort: resetear la lista, recargar los primeros 9 favoritos y continuar el infinite scroll con ese orden.
- Mostrar loading indicator al cargar más resultados.
- Mostrar fin de lista cuando no haya más items favoritos.
- Si no hay favoritos, mostrar exactamente: "No tienes items favoritos todavía.".

## Notes

- La card del dashboard de items favoritos debe navegar a `/items/favorites`.
- Reutilizar los componentes/patrones de `/items` siempre que sea razonable; si hace falta, extraer lógica compartida en vez de duplicar markup.
- Batch size fijo: 9 items por carga inicial y por cada carga adicional.
- Mapeo de sort:
  - Más recientes primero → `createdAt desc`
  - Más antiguos primero → `createdAt asc`
  - Nombre A-Z → `title asc`
  - Nombre Z-A → `title desc`
- La spec menciona "collections" al describir el reset del sort, pero se refiere a items; aplicar la misma lógica que en `/items`.
- Constraint clave: nunca mostrar items de otros usuarios ni items no favoritos.

## History

<!-- refers to the file @context/history.md -->
