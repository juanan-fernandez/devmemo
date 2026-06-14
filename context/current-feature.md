# item-card-actions-spec

# Current Feature

<!-- Feature Name -->

## Status

Completed

## Goals

- Implement delete item action with confirmation dialog, server-side auth check, and UI removal after deletion
- Implement toggle favorite action (server-side) that persists `isFavorite` and reflects yellow/muted icon state
- Implement toggle pinned action (server-side) that persists `isPinned` and reflects PinOff/Pin icon state
- All three actions must be reusable across UI screens (item card, item detail modal, etc.)
- Each action must verify authentication and item ownership server-side — never trust client-sent user IDs
- Revalidate affected paths (`/dashboard`, `/profile`, `/items/[type]`) after each action
- Add accessible labels (aria-label) to all icon buttons in Spanish
- Use existing dialog/modal component for delete confirmation

## Notes

- The `Item` model already has `isFavorite` and `isPinned` boolean fields in the Prisma schema — no migration needed
- `ItemActions` component already exists at `components/items/item-actions.tsx` with Star, Pin/PinOff, Trash2 icons
- `ItemCard` and `PinnedItemRow` already render `ItemActions` with correct props
- Server Actions pattern is already used in `actions/auth/` and `actions/profile/`
- Existing dialog pattern: `components/profile/delete-account-dialog.tsx` uses AlertDialog from shadcn
- Suggested server action files: `actions/items/delete-item.ts`, `actions/items/toggle-favorite.ts`, `actions/items/toggle-pinned.ts`
- Spanish copy for delete dialog: "Eliminar item", "¿Seguro que quieres eliminar este item? Esta acción no se puede deshacer.", "Cancelar", "Eliminar"
- Spanish aria-labels: "Marcar como favorito" / "Quitar de favoritos", "Fijar item" / "Quitar item fijado"

## History

<!-- refers to the file @context/history.md -->