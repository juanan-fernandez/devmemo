# Code Agent Instructions: File and Image Actions in Item Detail Sheet

## Goal

Update the item detail Sheet so `file` and `image` items support downloading their associated file URL.

For `image` items, also show an image preview inside the Sheet.

## Requirements

### 1. Download Button for File and Image Items

In the item detail Sheet, when the item type is:

- `file`
- `image`

show a download button with an icon.

Behavior:

- The button must download or open the file from the item file URL.
- Use the existing icon library if available.
- Keep the button visually consistent with the current Sheet actions.
- Add an accessible label.

Suggested Spanish labels:

```text
Descargar archivo
Descargar imagen
```

Implementation notes:

- Use the existing item URL/file URL field.
- If the URL is missing, do not show the button or show a disabled state with a clear reason.
- Prefer a safe external link pattern if the file is hosted remotely.
- Use `target="_blank"` and `rel="noopener noreferrer"` if opening the URL in a new tab.
- Use the `download` attribute only if it works with the current file storage setup.

### 2. Image Preview for Image Items

For `image` items, show the image preview in the Sheet.

Requirements:

- Display the image in addition to the file metadata.
- The image must occupy the full available width of the Sheet.
- Add light padding around the image.
- Keep the image responsive.
- Preserve aspect ratio.
- Use rounded corners if consistent with the current UI.
- Add useful `alt` text, preferably based on the item title.

Suggested layout:

```text
[Image preview: full width, slight padding]

[Existing file/image metadata]

[Existing Sheet content/actions]
```

### 3. File Item Behavior

For `file` items:

- Show file metadata as currently done.
- Add the download button.
- Do not show an image preview.

### 4. General Constraints

- Do not change the database schema.
- Do not break existing Sheet actions.
- Do not change edit mode unless required to keep layout consistent.
- Keep all user-facing labels in Spanish.
- Keep the UI accessible and responsive.

## Acceptance Criteria

- `file` items show a download button with an icon.
- `image` items show a download button with an icon.
- `image` items show a full-width image preview with light padding.
- The image preview preserves aspect ratio.
- The download button uses the item file URL.
- The download button is hidden or disabled when no file URL exists.
- Existing item detail Sheet behavior still works.
- Code passes lint, typecheck, and build.
