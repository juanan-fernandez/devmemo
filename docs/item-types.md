# Item Types

DevMemo ships with 7 built-in system item types. They all use the same underlying `Item` record shape, but each type emphasizes a different set of fields and is presented with its own icon, color, and label.

Source references:
- [`lib/item-types.ts`](../lib/item-types.ts)
- [`prisma/schema.prisma`](../prisma/schema.prisma)
- [`prisma/seed.ts`](../prisma/seed.ts)

## Quick Reference

| Type key | App name | DB name | Icon | Color | Main classification |
|---|---|---|---|---|---|
| `snippet` | Snippets | `Snippet` | `code-2` | `#84CC16` | Text-backed |
| `prompt` | Prompts | `Prompt` | `sparkles` | `#8B5CF6` | Text-backed |
| `command` | Comandos | `Command` | `terminal-square` | `#F97316` | Text-backed |
| `note` | Notas | `Note` | `notebook-pen` | `#06B6D4` | Text-backed |
| `file` | Archivos | `File` | `file-text` | `#F59E0B` | File-backed |
| `image` | Imágenes | `Image` | `image` | `#EC4899` | File-backed |
| `url` | Enlaces | `URL` | `link` | `#3B82F6` | URL-backed |

## Per-Type Details

### Snippets

| Property | Value |
|---|---|
| Name | `Snippets` |
| Icon | `code-2` |
| Hex color | `#84CC16` |
| Purpose | Store reusable code examples and implementation fragments. |
| Key fields used | `title`, `content`, `description`, `language`, `typeId` |

Notes:
- The canonical database name is `Snippet`.
- This is a text-backed item type.

### Prompts

| Property | Value |
|---|---|
| Name | `Prompts` |
| Icon | `sparkles` |
| Hex color | `#8B5CF6` |
| Purpose | Store reusable AI prompts and prompt workflows. |
| Key fields used | `title`, `content`, `description`, `typeId` |

Notes:
- The canonical database name is `Prompt`.
- This is a text-backed item type.

### Comandos

| Property | Value |
|---|---|
| Name | `Comandos` |
| Icon | `terminal-square` |
| Hex color | `#F97316` |
| Purpose | Store terminal commands and CLI shortcuts. |
| Key fields used | `title`, `content`, `description`, `language`, `typeId` |

Notes:
- The canonical database name is `Command`.
- This is a text-backed item type.
- Demo data uses `language: "bash"` for command examples.

### Notas

| Property | Value |
|---|---|
| Name | `Notas` |
| Icon | `notebook-pen` |
| Hex color | `#06B6D4` |
| Purpose | Store general written notes, summaries, and documentation fragments. |
| Key fields used | `title`, `content`, `description`, `typeId` |

Notes:
- The canonical database name is `Note`.
- This is a text-backed item type.

### Archivos

| Property | Value |
|---|---|
| Name | `Archivos` |
| Icon | `file-text` |
| Hex color | `#F59E0B` |
| Purpose | Store uploaded files and reusable document assets. |
| Key fields used | `title`, `fileUrl`, `fileName`, `fileSize`, `description`, `language`, `typeId` |

Notes:
- The canonical database name is `File`.
- This is a file-backed item type.
- Demo data shows a Markdown file example, so `language` may be used for some files.

### Imágenes

| Property | Value |
|---|---|
| Name | `Imágenes` |
| Icon | `image` |
| Hex color | `#EC4899` |
| Purpose | Store image assets and visual references. |
| Key fields used | `title`, `fileUrl`, `fileName`, `fileSize`, `description`, `typeId` |

Notes:
- The canonical database name is `Image`.
- This is a file-backed item type.

### Enlaces

| Property | Value |
|---|---|
| Name | `Enlaces` |
| Icon | `link` |
| Hex color | `#3B82F6` |
| Purpose | Store external documentation, references, and web resources. |
| Key fields used | `title`, `url`, `description`, `typeId` |

Notes:
- The canonical database name is `URL`.
- This is the URL-backed system type.
- In current demo data, link items use `contentType: "text"` and keep the destination in `url`.

## Classification Summary

### Text-backed types

These types primarily store their main payload in `Item.content`:

- Snippets
- Prompts
- Comandos
- Notas

Common supporting fields:
- `title`
- `description`
- `language` (when relevant)
- `isFavorite`
- `isPinned`

### File-backed types

These types primarily store their main payload through file metadata:

- Archivos
- Imágenes

Key file-related fields:
- `fileUrl`
- `fileName`
- `fileSize`

Supporting fields that may still appear:
- `title`
- `description`
- `language`

### URL-backed type

The URL-backed system type is:

- Enlaces

Key URL-related field:
- `url`

Project-specific note:
- The Prisma schema does not define a dedicated enum or dedicated content type for links.
- In the current demo dataset, link items are stored with `contentType: "text"` and `content: null`, while the real destination lives in `url`.

## Shared Item Properties

All item types share the same persisted `Item` model in [`prisma/schema.prisma`](../prisma/schema.prisma).

Fields shared across all types:
- `id`
- `title`
- `description`
- `isFavorite`
- `isPinned`
- `typeId`
- `userId`
- `collectionId`
- `createdAt`
- `updatedAt`

Optional content-bearing fields available on the shared model:
- `content`
- `fileUrl`
- `fileName`
- `fileSize`
- `url`
- `language`

Important implication:
- Type-specific behavior is currently driven by conventions and populated fields, not by different database tables or separate Prisma models.

## Display Differences

### Verified current differences

From the reviewed code, the currently verified UI differences between item types are:

- Each type has its own icon.
- Each type has its own hex color.
- Each type has a plural app-facing name for navigation.
- Each type has a singular label used in item metadata.
- Sidebar entries show per-type item counts.
- Dashboard cards and rows optionally show `language` when it exists.

Relevant files:
- [`lib/item-types.ts`](../lib/item-types.ts)
- [`components/dashboard/sidebar.tsx`](../components/dashboard/sidebar.tsx)
- [`components/dashboard/pinned-item-card.tsx`](../components/dashboard/pinned-item-card.tsx)
- [`components/dashboard/pinned-item-row.tsx`](../components/dashboard/pinned-item-row.tsx)

### Not verified in the reviewed sources

The reviewed sources do **not** prove distinct item-detail layouts for:
- code rendering vs note rendering
- file preview vs image preview
- external link preview behavior

Treat those as implementation TODOs unless verified elsewhere.
