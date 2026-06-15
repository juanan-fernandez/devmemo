# Code Agent Instructions: Integrate Monaco Editor for Snippet and Command Items

## Goal

Integrate `@monaco-editor/react` into the item detail Sheet, the item edit form, and the item creation form.

Monaco must replace the current `textarea` used for the `content` field only for these item types:

- `snippet`
- `command`

For all other item types, keep the existing controls.

## Files to Review

Start by reviewing:

```text
components/items/item-detail-sheet.tsx
components/items/create-item-dialog.tsx
```

Also review any existing item edit form components used by the Sheet.

## Dependency

Install the Monaco React package if it is not already installed:

```bash
npm install @monaco-editor/react
```

or use the project package manager if it uses `pnpm`, `yarn`, or `bun`.

## References

If needed, review:

- GitHub repo: `https://github.com/suren-atoyan/monaco-react`
- npm package: `https://www.npmjs.com/package/@monaco-editor/react`
- Context7 MCP documentation for `@monaco-editor/react`

## Requirements

### 1. Where Monaco Must Be Used

Use Monaco in:

1. `components/items/item-detail-sheet.tsx`
   - For viewing code content in the Sheet.
   - Must be read-only.

2. Item edit form
   - For editing `content`.
   - Must be editable.

3. `components/items/create-item-dialog.tsx`
   - For creating new snippet or command items.
   - Must be editable.

### 2. Item Types

Show Monaco only when the item type is:

```text
snippet
command
```

Do not show Monaco for:

```text
note
prompt
link
image
file
```

or any other non-code item type.

### 3. Content Field

Monaco must display and update the item `content` field.

- In the Sheet read-only view, Monaco displays `item.content`.
- In edit mode, Monaco edits the form `content` value.
- In create mode, Monaco edits the new item `content` value.
- On save/create, the value must be submitted as the existing `content` field.

Do not create a new database field.

### 4. Replace Textarea

For `snippet` and `command`, replace the existing `textarea` for `content` with Monaco.

For other item types that use content, keep the current textarea behavior.

### 5. Read-Only Monaco in Sheet

In the item detail Sheet viewer:

- Monaco must be read-only.
- It must not allow editing.
- It should still allow scrolling and selecting/copying code.
- Use a reasonable height, for example `240px` or `320px`, adapted to the Sheet layout.
- Use the item language if available to set Monaco language.
- If no language is available, use a safe fallback such as `plaintext`.

Suggested behavior:

```tsx
<Editor
  value={item.content ?? ""}
  language={monacoLanguage}
  options={{
    readOnly: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: "on",
  }}
/>
```

### 6. Editable Monaco in Edit and Create Forms

In edit and create forms:

- Monaco must be editable.
- Its value must be controlled by the form state.
- On change, update the form `content` value.
- Preserve existing validation and submit behavior.
- Keep Zod validation in the Server Action.

Suggested behavior:

```tsx
<Editor
  value={formContent}
  language={monacoLanguage}
  onChange={(value) => setFormContent(value ?? "")}
  options={{
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    wordWrap: "on",
  }}
/>
```

### 7. Language Mapping

Use the item `language` field when available.

Check the existing language options from:

```text
@lib/items/editable-item.ts
```

Specifically review:

```text
EDITABLE_ITEM_LANGUAGE_OPTIONS
```

Map the project language values to Monaco language IDs when needed.

Examples:

```text
javascript -> javascript
typescript -> typescript
tsx -> typescript
jsx -> javascript
shell/bash -> shell
python -> python
sql -> sql
json -> json
html -> html
css -> css
markdown -> markdown
```

If no mapping exists, create a small helper function, for example:

```text
getMonacoLanguage(language?: string | null): string
```

Fallback:

```text
plaintext
```

### 8. SSR / Next.js Compatibility

Monaco must run only on the client.

If needed, wrap Monaco in a client component, for example:

```text
components/items/code-editor.tsx
```

or dynamically import it with SSR disabled.

The wrapper should support:

```ts
type CodeEditorProps = {
  value: string
  language?: string | null
  readOnly?: boolean
  onChange?: (value: string) => void
}
```

Recommended:

- Create a reusable `CodeEditor` component.
- Use it in Sheet, edit form, and create dialog.
- Keep Monaco-specific configuration isolated in this component.

### 9. Styling

Keep the editor consistent with the project UI.

Requirements:

- Fit inside the shadcn Sheet/Dialog layout. 400 pixels max height.
- If scroll bar is needed put attention that matchaes the theme
- Do not overflow horizontally.
- Use a fixed or min height that works inside modals.
- dark theme by default.
- Add copy button in the editor header
- Move the field Languaje in editor header. Next to to Copy
- Disable minimap by default.
- Enable word wrap.
- Keep the editor readable.

### 10. Validation and Server Actions

Do not change the existing Zod validation rules except where needed to support the same `content` field.

Important:

- Validation remains server-side.
- The submitted value must still be `content`.
- The database write should not change except receiving Monaco content instead of textarea content.
- Do not bypass existing `createItem` or update item Server Actions.

### 11. Acceptance Criteria

- `@monaco-editor/react` is installed if missing.
- A reusable Monaco wrapper component exists or Monaco usage is cleanly isolated.
- The item detail Sheet uses Monaco in read-only mode for `snippet` and `command`.
- Edit form uses Monaco in editable mode for `snippet` and `command`.
- Create item dialog uses Monaco in editable mode for `snippet` and `command`.
- Textarea is replaced by Monaco only for `snippet` and `command`.
- Other item types keep their existing controls.
- Monaco displays and stores the existing `content` field.
- Language selection affects Monaco syntax highlighting when available.
- The implementation works in Next.js without SSR/window errors.
- Existing create and edit Server Actions still validate with Zod.
- Code passes lint, typecheck, and build.
