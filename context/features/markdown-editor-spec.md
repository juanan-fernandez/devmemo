# Code Agent Instructions: Integrate react-markdown editor for Prompt Items

## Goal

Integrate `react-markdown` into the item detail Sheet, the item edit form, and the item creation form.

React-markdown must replace the current `textarea` used for the `content` field only for these item types:

- `prompt`


For all other item types, keep the existing controls.

## Files to Review

Start by reviewing:

```text
components/items/item-detail-sheet.tsx
components/items/create-item-dialog.tsx
```

Also review any existing item edit form components used by the Sheet.

## Dependency

Install the react-markdown package if it is not already installed:

```bash
npm install react-markdown
```

or use the project package manager if it uses `pnpm`, `yarn`, or `bun`.

## References

If needed, review:

- npm package: `https://www.npmjs.com/package/react-markdown`


## Requirements

### 1. Where react-markdown Must Be Used

Use react-markdown in:

1. `components/items/item-detail-sheet.tsx`
   - For viewing markdown content in the Sheet.
   - Must be read-only.

2. Item edit form
   - For editing `content`.
   - Must be editable.

3. `components/items/create-item-dialog.tsx`
   - For creating new prompt.
   - Must be editable.

### 2. Item Types

Show react-markdown only when the item type is:

```text
prompt
```

Do not show react-markdown for:

```text
note
snippet
command
link
image
file
```

or any other non-prompt item type.

### 3. Content Field

React-markdown must display and update the item `content` field.

- In the Sheet read-only view, react-markdown displays `item.content`.
- In edit mode, react-markdown edits the form `content` value.
- In create mode, react-markdown edits the new item `content` value.
- On save/create, the value must be submitted as the existing `content` field.

Do not create a new database field.

### 4. Replace Textarea

For `prompt` item type, replace the existing `textarea` for `content` with react-markdown.

For other item types that use content, keep the current textarea behavior.

### 5. Read-Only react-markdown in Sheet

In the item detail Sheet viewer:

- react-markdown must be read-only.
- It must not allow editing.
- It should still allow scrolling and selecting/copying code.
- Use a reasonable height, for example `220px` or `300px`, adapted to the Sheet layout.


### 6. Editable react-markdown in Edit and Create Forms

In edit and create forms:

- react-markdown must be editable.
- Its value must be controlled by the form state.
- On change, update the form `content` value.
- Preserve existing validation and submit behavior.
- Keep Zod validation in the Server Action.


### 8. SSR / Next.js Compatibility

react-markdown must run only on the client.

If needed, wrap react-markdown in a client component, for example:

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
- Keep react-markdown-specific configuration isolated in this component.

### 9. Styling

Keep the editor consistent with the project UI.

Requirements:

- Fit inside the shadcn Sheet/Dialog layout. 400 pixels max height.
- If scroll bar is needed put attention that matchaes the theme
- Do not overflow horizontally.
- Use a fixed or min height that works inside modals.
- dark theme by default.
- Add copy button in the editor headerreact-markdown
- Keep the editor readable.

### 10. Validation and Server Actions

Do not change the existing Zod validation rules except where needed to support the same `content` field.

Important:

- Validation remains server-side.
- The submitted value must still be `content`.
- The database write should not change except receiving react-markdown content instead of textarea content.
- Do not bypass existing `createItem` or update item Server Actions.

### 11. Acceptance Criteria

- `react-markdown` is installed if missing.
- A reusable react-markdown wrapper component exists or react-markdown usage is cleanly isolated.
- The item detail Sheet uses react-markdown in read-only mode for `prompt`.
- Edit form uses react-markdown in editable mode for `prompt`.
- Create item dialog uses react-markdown in editable mode for `prompt`.
- Textarea is replaced by react-markdown only for `prompt`.
- Other item types keep their existing controls.
- react-markdown displays and stores the existing `content` field.
- The implementation works in Next.js without SSR/window errors.
- Existing create and edit Server Actions still validate with Zod.
- Code passes lint, typecheck, and build.
