# sheet-preview-download-spec

# Current Feature

<!-- File and Image Actions in Item Detail Sheet -->

## Status

In Progress

## Goals

- Update the item detail Sheet so `file` and `image` items support downloading their associated file URL.
- Add a download button with icon for `file` and `image` item types in the item detail Sheet.
- Make the download button use the existing item file URL field.
- Hide or disable the download button when no file URL exists.
- For `image` items, show a full-width image preview inside the Sheet with light padding, responsive behavior, preserved aspect ratio, and rounded corners.
- Keep the download/open behavior safe (external link pattern with `target="_blank"` and `rel="noopener noreferrer"`, or `download` attribute if storage supports it).
- Preserve existing Sheet actions and edit mode layout.
- Keep all user-facing labels in Spanish.
- Ensure the UI remains accessible and responsive.
- Code must pass lint, typecheck, and build.

## Notes

- Target component: `components/items/item-detail-sheet.tsx` (and related detail rendering).
- Spanish labels: `Descargar archivo` / `Descargar imagen`.
- Do not change the database schema.
- Do not break existing Sheet actions.
- Image preview should use the item title for `alt` text when possible.

## History

<!-- refers to the file @context/history.md -->
