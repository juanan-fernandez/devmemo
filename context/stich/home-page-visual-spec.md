# Code Agent Instructions: Build Home Page from Visual Reference

## Goal

Create the application root home page at:

```text
/
```

The implementation must closely match the visual reference `home-screen.png`, but the coding agent cannot interpret images. Use this document as the textual specification of the design.

The product name is:

```text
DevMemo
```

The home page is a dark, editorial, developer-focused landing page with a top navigation bar, a centered hero section, floating item preview cards, item-type pills, an auth card, and a footer.

## Visual Style Summary

Overall style:

- Dark theme.
- Editorial / premium developer tool feeling.
- Minimal, high-contrast UI.
- Large bold display typography.
- Soft borders.
- Subtle shadows.
- Neon accent colors for item types.
- Centered layout.
- Generous vertical spacing.

Approximate page background:

```css
background: #09090b or #0a0a0c;
color: #f4f4f5;
```

Use the project’s existing Tailwind/shadcn design system where possible.

## Page Structure

The page should be built in this vertical order:

1. Top navigation bar
2. Hero section
3. Three item preview cards
4. Main CTA button
5. Item-type pill row
6. Auth card with login/register tabs
7. Footer

## 1. Top Navigation Bar

Create a full-width top bar.

Layout:

| Left | Right |
|---|---|
| DevMemo logo/text | LOGIN + EMPEZAR GRATIS button |

Details:

- Height: around `56px`.
- Full width.
- Bottom border: subtle, dark gray.
- Horizontal padding: around `24px`.
- Background same as page or slightly darker.
- Left logo text: `DevMemo`.
- Logo style:
  - large enough to be clearly visible
  - white/light gray
  - bold, rounded/futuristic if existing typography supports it
- Right side:
  - small text link: `LOGIN`
  - small light button: `EMPEZAR GRATIS`
- `LOGIN` should link to `/login`.
- `EMPEZAR GRATIS` should link to the registration flow or `/register` if that route exists. If registration is handled inside `/login`, link there and activate the register tab only if the current app supports it.

Suggested Tailwind direction:

```text
h-14 border-b border-zinc-800 bg-zinc-950/95 px-6 flex items-center justify-between
```

## 2. Hero Section

The hero section is centered and starts well below the navbar.

Approximate spacing:

- Top margin from navbar: `140px` on desktop.
- Center aligned.
- Max width around `900px`.

Main headline:

```text
Tu segundo cerebro.
Todo en un lugar.
```

Important:

- This headline is two lines.
- Very large font.
- Strong weight.
- Tight line height.
- Light gray/white color.
- Centered.

Approximate desktop typography:

```text
font-size: 64px to 76px
line-height: 0.95 to 1.05
font-weight: 700 or 800
letter-spacing: -0.04em
```

Mobile typography should scale down.

Subtitle under headline:

```text
Guarda links, código, comandos, prompts, imágenes y documentos en una bóveda
digital diseñada para la velocidad y la precisión editorial.
```

Details:

- Two lines on desktop.
- Centered.
- Muted light gray.
- Width around `720px`.
- Top margin around `24px`.
- Font size around `16px`.

## 3. Item Preview Cards

Below the subtitle, show three horizontal preview cards.

Layout:

| Card 1 | Card 2 | Card 3 |
|---|---|---|
| Snippet | Link | Prompt |

Desktop:

- Centered row.
- Gap around `32px`.
- Top margin around `36px`.
- Each card width around `250px`.
- Height around `120px` to `145px`.

On mobile:

- Stack vertically or use a responsive grid.

### Shared Card Style

Each card:

- Dark card background: `#151518` or similar.
- Thin colored border.
- Slight rounded corners.
- Subtle shadow.
- Padding around `16px`.
- Has a small uppercase type label at top-left.
- Has a small icon at top-right.
- Has a title/content preview.

### Card 1: Snippet

Accent color: green / lime.

Type label:

```text
SNIPPET
```

Title:

```text
Tailwind Config
```

Inside the card, show a small code block preview:

```text
module.exports = {
  theme: { ... },
  plugins: [],
}
```

Visual notes:

- Left colored vertical accent bar in green.
- Border green.
- Small code icon top-right.

### Card 2: Link

Accent color: blue.

Type label:

```text
LINK
```

Title:

```text
Aesthetic UI References
```

Description:

```text
Curated list of premium design
patterns for modern SaaS apps...
```

Top-right icon: link icon.

### Card 3: Prompt

Accent color: purple.

Type label:

```text
PROMPT
```

Title:

```text
Midjourney Editorial
```

Description:

```text
"/imagine prompt: minimalist
obsidian texture..."
```

Top-right icon: lightning/spark icon.

## 4. Main CTA Button

Under the preview cards, centered.

Text:

```text
Empezar gratis
```

Style:

- Light button on dark background.
- Large rectangle.
- Width around `180px`.
- Height around `64px`.
- Border radius around `6px`.
- Shadow/glow below.
- Top margin around `42px`.

Link target:

- Registration route if available.
- Otherwise `/login`.

## 5. Item-Type Pill Row

Further down, centered horizontally.

Approximate top spacing from CTA: large, around `220px`.

Create six small rounded pills:

```text
SNIPPETS
LINKS
PROMPTS
DOCS
COMMANDS
ASSETS
```

Each pill has:

- Uppercase monospace/small text.
- Transparent/dark background.
- Thin colored border.
- Matching colored text.
- Rounded-full shape.
- Small horizontal padding.

Colors:

| Pill | Color |
|---|---|
| SNIPPETS | lime/green |
| LINKS | blue |
| PROMPTS | purple |
| DOCS | yellow/amber |
| COMMANDS | orange |
| ASSETS | pink |

Use existing item type colors from the project if available.

## 6. Auth Card

Below the pill row, show a centered auth card.

Approximate spacing:

- Top margin from pills: `90px`.

Card dimensions:

- Width around `500px`.
- Dark surface background: `#18181b` or similar.
- Border: subtle `#27272a`.
- Rounded corners.
- Shadow.
- Padding around `32px`.

The card visually resembles the login/register form from the existing login page. Reuse components/styles from:

```text
@app/login/page.tsx
```

### Auth Tabs

At the top of the card:

| Left tab | Right tab |
|---|---|
| Iniciar sesión | Crear cuenta |

Details:

- Large tab labels.
- Active tab is `Iniciar sesión`.
- Active tab has underline.
- Horizontal divider underneath.

### Login Form Preview

Fields:

1. Email
2. Contraseña

Labels:

```text
EMAIL
CONTRASEÑA
```

Input example values / placeholders:

```text
dev@stash.io
••••••••
```

Primary button:

```text
Acceder al Hub
```

Below it, separator:

```text
O CONTINUA CON
```

Then GitHub button:

```text
GitHub Account
```

with GitHub icon.

Important:

- If the current project already has real login/register forms, reuse them.
- If the root page should be public marketing only, this card can link users to `/login` rather than submitting directly.
- Prefer reusing the real auth components if they can be embedded safely.

## 7. Footer

Footer at the bottom after a large vertical gap.

Layout:

| Left | Center | Right |
|---|---|---|
| DevMemo + subtitle | PRIVACIDAD | © 2024 DEVMEMO CORE |

Details:

- Top border subtle dark gray.
- Padding: around `28px 24px`.
- Left:
  - `DevMemo` logo/text
  - subtitle: `The Editorial Hub for Developers & Thinkers.`
- Center:
  - `PRIVACIDAD`
- Right:
  - `© 2024 DEVMEMO CORE`
- Use small uppercase/monospace styling for center/right.

## Responsive Behavior

Desktop:

- Hero cards are in a row.
- Auth card centered with fixed max width.
- Footer in three columns.

Tablet/mobile:

- Reduce hero title size.
- Stack preview cards vertically or in a single column.
- Auth card width should be `100%` with max width.
- Footer should stack vertically with spacing.
- Top nav should remain usable.

## Implementation Notes

- Create or update `app/page.tsx`.
- Reuse existing components from the login page when possible.
- Use existing shadcn components:
  - Button
  - Card
  - Input
  - Tabs if already used
- Use existing icon library for:
  - code/snippet
  - link
  - lightning/prompt
  - GitHub
- Do not add new dependencies unless necessary.
- Keep text in Spanish except footer tagline, which should match the reference.

## Suggested Component Breakdown

If helpful, create small local components:

```text
HomeNavbar
HeroPreviewCard
ItemTypePill
HomeAuthCard
HomeFooter
```

Keep them in the same file if the project prefers simpler pages, or extract them if the file becomes too large.

## Exact Text Content

Use this visible copy:

```text
DevMemo
LOGIN
EMPEZAR GRATIS

Tu segundo cerebro.
Todo en un lugar.

Guarda links, código, comandos, prompts, imágenes y documentos en una bóveda
digital diseñada para la velocidad y la precisión editorial.

SNIPPET
Tailwind Config

LINK
Aesthetic UI References
Curated list of premium design patterns for modern SaaS apps...

PROMPT
Midjourney Editorial
"/imagine prompt: minimalist obsidian texture..."

Empezar gratis

SNIPPETS
LINKS
PROMPTS
DOCS
COMMANDS
ASSETS

Iniciar sesión
Crear cuenta
EMAIL
CONTRASEÑA
Acceder al Hub
O CONTINUA CON
GitHub Account

The Editorial Hub for Developers & Thinkers.
PRIVACIDAD
© 2024 DEVMEMO CORE
```

## Acceptance Criteria

- `/` renders a complete home page.
- The page closely follows the provided screenshot through this textual spec.
- The UI uses the same dark visual language as the app.
- The navbar, hero, preview cards, CTA, pill row, auth card, and footer are present.
- Existing login page components/styles are reused where possible.
- Links to login/register work.
- The page is responsive.
- The implementation passes lint, typecheck, and build.
