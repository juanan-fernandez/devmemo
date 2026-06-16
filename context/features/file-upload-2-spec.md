# Code Agent Instructions: Improve FileUploadField with Drag and Drop

## Goal

Improve the existing `FileUploadField` component to support drag-and-drop file input for item types:

- `file`
- `image`

Target file:

```text
@components/items/file-upload-field.tsx
```

The component must support both:

- clicking the drop zone to open the native file picker
- dragging and dropping a file into the drop zone

Use the standard HTML pattern where a hidden `<input type="file">` is linked to a styled `<label>` used as the drop zone.

Reference documentation:

```text
https://developer.mozilla.org/es/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
```

## Requirements

### 1. Drag and Drop Pattern

Implement drag-and-drop using:

- a hidden file input
- a visible styled `<label>` as the drop zone
- JavaScript drag events:
  - `dragover`
  - `dragleave`
  - `drop`

The hidden input must remain accessible through the label.

Suggested structure:

```tsx
<label htmlFor={inputId}>
  Drop file here or click to upload
</label>

<input
  id={inputId}
  type="file"
  className="sr-only"
  onChange={...}
/>
```

Do not use a non-accessible div-only file picker.

### 2. Supported Item Types

Only enable this upload field for:

```text
file
image
```

Behavior:

- For `image`, accept image file types.
- For `file`, accept general file types according to the existing project rules.

If the component already receives an `accept` prop, preserve and reuse it.

Suggested accept values:

```text
image/*   for image items
*/*       or existing accepted file list for file items
```

Do not break existing create/edit item forms.

### 3. Drag State UI

Add a visual state when the user drags a file over the drop zone.

Example states:

- default
- drag active / file over zone
- file selected
- error

Use the project's existing styling conventions.

Suggested Spanish copy:

```text
Arrastra y suelta un archivo aquí o haz clic para seleccionarlo.
Suelta el archivo para cargarlo.
Archivo seleccionado:
```

For image items:

```text
Arrastra y suelta una imagen aquí o haz clic para seleccionarla.
```

### 4. File Handling

When a file is selected through either click or drop:

- Extract the first file from the input/drop event.
- Validate it using existing validation logic if present.
- Update the component state or call the existing `onChange` handler.
- Preserve the existing form integration.
- Show the selected file name.
- For image files, show a preview if the component already supports previews or if it can be added safely.

Multiple files are not supported, ignore additional files and only use the first one.

### 5. Event Handling

Implement event handlers safely:

- `onDragOver`: call `event.preventDefault()` and set active drag state.
- `onDragLeave`: clear active drag state.
- `onDrop`: call `event.preventDefault()`, clear active drag state, read `event.dataTransfer.files`.

Also handle invalid or empty drops gracefully.

### 6. Accessibility

The upload field must be accessible.

Requirements:

- The label must be associated with the hidden input using `htmlFor`.
- The hidden input must not be removed from the accessibility tree if the project expects keyboard access.
- The drop zone must have clear text instructions.
- Error messages must be readable by screen readers if the project has an error pattern.
- Preserve keyboard-based file selection through the label/input.

### 7. Validation

Reuse existing validation rules if present.

If no validation exists, add basic client-side validation:

- image item: file MIME type must start with `image/`
- file item: allow files according to current project rules
- respect any existing max file size if present
- only one file or image is allowed to upload.

Return or display Spanish validation messages.

Suggested messages:

```text
El archivo seleccionado no es válido.
El tipo de archivo no está permitido.
El archivo es demasiado grande.
```

Do not rely only on client-side validation if the project uploads files to the server. Keep or add server-side validation where appropriate.

### 8. Integration

Review where `FileUploadField` is used, especially:

- create item dialog
- edit item form
- item detail sheet if applicable

Ensure the updated component does not break existing props or behavior.

Prefer backwards-compatible changes.

### 9. Acceptance Criteria

- `FileUploadField` supports clicking to select a file.
- `FileUploadField` supports dragging and dropping a file.
- Drag-over state is visually clear.
- The component works for `file` item types.
- The component works for `image` item types.
- Image item uploads restrict files to images.
- Selected file name is displayed.
- Existing form integration still works.
- The hidden input remains associated with a visible label.
- The implementation follows the MDN drag-and-drop file input pattern.
- Code passes lint, typecheck, and build.
