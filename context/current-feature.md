# collection-header-actions

# Current Feature

<!-- Implement Collection Header Actions: edit, favorite, delete -->

## Status

In Progress

## Goals

- **Editar colección**: abrir diálogo de edición (reutilizar `CreateCollectionDialog` con prop `mode`), precargar título/descripción, guardar vía Server Action, refrescar UI.
- **Favorito**: toggle optimista del estado `isFavorite`, estrella amarilla/neutra, rollback en caso de error.
- **Eliminar colección**: diálogo de confirmación irreversible, desasignar items (no borrarlos), eliminar colección en transacción, redirigir a página anterior.
- Crear 3 Server Actions en `actions/collections/`: `updateCollection`, `toggleCollectionFavorite`, `deleteCollection`.
- Cada acción: auth check, ownership check, userId desde sesión (no cliente), `revalidatePath`.
- Textos en español. Estilo shadcn consistente. Accesibilidad (aria-labels).
- Pasar lint, typecheck, build.

## Notes

- `isFavorite` ya existe en el modelo `Collection` (`Boolean @default(false)`).
- Reutilizar `CreateCollectionDialog` con prop `mode: "create" | "edit"`.
- Destructive styling en botón eliminar.
- Spanish: "Editar colección", "Guardar", "Cancelar", "Colección actualizada correctamente.", "Marcar/Quitar colección de favoritas", "Eliminar colección", "Esta acción es irreversible...".

## History

<!-- refers to the file @context/history.md -->
