# Code Agent Instructions: Create Root Home Page

## Goal

Create the root page of the application:

```text
/
```

The page must follow the existing application UI and use the provided design references.

## References

Review these files before implementing:

```text
@context/stich/home-design.md
@context/stich/screens/home-screen.png
@context/stich/screens/home-code.html
@context/stich/home-page-visual-spec.md
```

Use the screenshot as the visual reference for layout, spacing, hierarchy, and style.

## Files to Review

Reuse existing UI patterns and components from:

```text
@app/login/page.tsx
```

Also review any shared components used by the login page, such as:

- buttons
- cards
- layout wrappers
- logo/brand components
- typography styles
- background/gradient styles

## Requirements

### 1. Create Root Page

Implement the root page at:

```text
app/page.tsx
```

or the equivalent location if the project uses a different app structure.

### 2. Respect Existing UI

The new home page must visually match the application.

Requirements:

- Reuse existing design tokens, Tailwind classes, and shadcn components where possible.
- Reuse components already used in `@app/login/page.tsx` when appropriate.
- Keep spacing, colors, borders, shadows, and typography consistent with the login page.
- Do not introduce a new visual style.

### 3. Match the Reference Design

Use the reference screenshot:

```text
@context/stich/screens/home-screen.png
```

and the design notes:

```text
@context/stich/home-design.md
```

as the source of truth for the page layout.

If there is a conflict between the screenshot and current app UI, prefer consistency with the existing app UI while staying close to the screenshot.

### 4. Navigation / CTAs

The page should include clear navigation actions.

At minimum, include links/buttons for:

```text
Iniciar sesión
Registrarse
```

Use the existing auth routes already present in the project.

Do not invent routes. Verify the current login/register paths before linking.

### 5. Authentication-Aware Behavior

If the project already has an easy server-side `auth()` utility available:

- If the user is authenticated, route or offer navigation to `/dashboard`.
- If the user is not authenticated, show the public home page.

Do not block implementation if auth-aware behavior is not already straightforward.

### 6. Accessibility

- Use semantic HTML.
- Use accessible links and buttons.
- Ensure heading hierarchy is correct.
- Ensure images have useful `alt` text or are decorative when appropriate.
- Keep contrast readable.

### 7. Constraints

- Do not modify authentication logic.
- Do not change database schema.
- Do not redesign the login page unless strictly needed for shared components.
- Do not add new dependencies unless necessary.
- Keep the implementation simple and maintainable.

## Acceptance Criteria

- The application has a working root page at `/`.
- The page follows the provided screenshot and design notes.
- The page reuses UI/components/styles from `@app/login/page.tsx` where possible.
- The page includes working navigation to login and registration.
- Authenticated users have an obvious path to `/dashboard`.
- The page is responsive.
- The page is accessible.
- Code passes lint, typecheck, and build.
