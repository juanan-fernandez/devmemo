# file-upload-2-spec

# Current Feature

<!-- Improve FileUploadField with Drag and Drop -->

## Status

Completed

## Goals

- Improve the existing `FileUploadField` component (`components/items/file-upload-field.tsx`) to support drag-and-drop file input.
- Support clicking the drop zone to open the native file picker AND dragging and dropping a file into the drop zone.
- Use the standard HTML pattern: hidden `<input type="file">` linked to a styled `<label>` used as the drop zone.
- Implement drag events: `dragover`, `dragleave`, `drop`.
- Only enable the field for item types `file` and `image`; preserve existing `accept` prop behavior.
- Add visual drag state UI (default, drag active, file selected, error) using existing project styling conventions.
- Display Spanish copy for drop zone instructions and selected file feedback.
- Handle file selection from click or drop, validate with existing rules, update state/onChange, and show the selected file name.
- For image files, preserve or add a preview if possible.
- Keep validation rules consistent; return Spanish validation messages.
- Ensure backward-compatible integration in create item dialog, edit item form, and item detail sheet.
- Code must pass lint, typecheck, and build.

## Notes

- Reference documentation: https://developer.mozilla.org/es/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
- Target file: `components/items/file-upload-field.tsx`
- Multiple files are not supported; only the first file from click or drop is used.
- The hidden input must stay accessible and associated with the visible label via `htmlFor`.
- Image item uploads must restrict files to image MIME types.
- Do not rely only on client-side validation; preserve server-side validation.

## History

<!-- refers to the file @context/history.md -->
