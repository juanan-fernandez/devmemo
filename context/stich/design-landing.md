---
name: Stash
colors:
   surface: '#121317'
   surface-dim: '#121317'
   surface-bright: '#38393d'
   surface-container-lowest: '#0d0e12'
   surface-container-low: '#1a1b1f'
   surface-container: '#1e1f23'
   surface-container-high: '#292a2e'
   surface-container-highest: '#343539'
   on-surface: '#e3e2e7'
   on-surface-variant: '#c8c5ca'
   inverse-surface: '#e3e2e7'
   inverse-on-surface: '#2f3034'
   outline: '#919095'
   outline-variant: '#47464a'
   surface-tint: '#c8c6c8'
   primary: '#c8c6c8'
   on-primary: '#313032'
   primary-container: '#0d0d0f'
   on-primary-container: '#7c7a7d'
   inverse-primary: '#5f5e60'
   secondary: '#c6c6c7'
   on-secondary: '#2f3131'
   secondary-container: '#454747'
   on-secondary-container: '#b4b5b5'
   tertiary: '#c8c5cb'
   on-tertiary: '#303034'
   tertiary-container: '#0d0d11'
   on-tertiary-container: '#7b7a7f'
   error: '#ffb4ab'
   on-error: '#690005'
   error-container: '#93000a'
   on-error-container: '#ffdad6'
   primary-fixed: '#e5e1e4'
   primary-fixed-dim: '#c8c6c8'
   on-primary-fixed: '#1b1b1d'
   on-primary-fixed-variant: '#474649'
   secondary-fixed: '#e2e2e2'
   secondary-fixed-dim: '#c6c6c7'
   on-secondary-fixed: '#1a1c1c'
   on-secondary-fixed-variant: '#454747'
   tertiary-fixed: '#e4e1e7'
   tertiary-fixed-dim: '#c8c5cb'
   on-tertiary-fixed: '#1b1b1f'
   on-tertiary-fixed-variant: '#47464b'
   background: '#121317'
   on-background: '#e3e2e7'
   surface-variant: '#343539'
   link: '#3B82F6'
   snippet: '#84CC16'
   command: '#F97316'
   image: '#EC4899'
   document: '#F59E0B'
   prompt: '#8B5CF6'
   note: '#06B6D4'
   border-subtle: '#262626'
typography:
   display-xl:
      fontFamily: Syne
      fontSize: 64px
      fontWeight: '800'
      lineHeight: '1.1'
      letterSpacing: -0.04em
   headline-lg:
      fontFamily: Syne
      fontSize: 32px
      fontWeight: '700'
      lineHeight: '1.2'
   headline-lg-mobile:
      fontFamily: Syne
      fontSize: 28px
      fontWeight: '700'
      lineHeight: '1.2'
   headline-md:
      fontFamily: Syne
      fontSize: 24px
      fontWeight: '600'
      lineHeight: '1.3'
   body-lg:
      fontFamily: Hanken Grotesk
      fontSize: 18px
      fontWeight: '400'
      lineHeight: '1.6'
   body-md:
      fontFamily: Hanken Grotesk
      fontSize: 16px
      fontWeight: '400'
      lineHeight: '1.5'
   body-sm:
      fontFamily: Hanken Grotesk
      fontSize: 14px
      fontWeight: '400'
      lineHeight: '1.4'
   label-mono:
      fontFamily: JetBrains Mono
      fontSize: 12px
      fontWeight: '500'
      lineHeight: '1'
      letterSpacing: 0.05em
   label-caps:
      fontFamily: Hanken Grotesk
      fontSize: 11px
      fontWeight: '700'
      lineHeight: '1'
      letterSpacing: 0.1em
rounded:
   sm: 0.125rem
   DEFAULT: 0.25rem
   md: 0.375rem
   lg: 0.5rem
   xl: 0.75rem
   full: 9999px
spacing:
   sidebar-width: 240px
   sidebar-collapsed: 72px
   container-max-width: 1280px
   gutter: 24px
   stack-sm: 8px
   stack-md: 16px
   stack-lg: 32px
   section-gap: 64px
---

## Brand & Style

The design system follows a **Developer Tool meets Editorial Magazine** aesthetic. It targets power users, developers, and knowledge workers who value both high-density utility and sophisticated visual presentation.

The personality is intellectual, precise, and premium. It avoids generic SaaS gradients in favor of deep obsidian surfaces, stark typography, and high-chroma functional accents.

### Design Principles

- **Editorial Precision:** Use intentional whitespace and dramatic typographic scales to create a sense of importance for stored knowledge.
- **Developer Utility:** Functional elements (search, shortcuts, syntax) use monospaced nuances and sharp execution.
- **Chromatic Indexing:** Color is never decorative; it is a primary navigational tool used to categorize content types at a glance.
- **Obsidian Depth:** The dark mode uses a near-black base to minimize eye strain and maximize the "pop" of the vivid accent colors.

## Colors

The palette is anchored by an "Obsidian" background (`#0D0D0F`), providing a high-contrast foundation for "Paper White" typography.

### Functional Accents

Each item type is strictly mapped to a specific hex code. These colors should be used for:

- Left-side card accents (4px border).
- Active state indicators in the sidebar.
- Hover glows (low opacity shadows).
- Command palette icons.

### Surface Tiers

- **Tier 1 (Base):** `#0D0D0F` (Main background).
- **Tier 2 (Surface):** `#161618` (Sidebar, cards, modals).
- **Tier 3 (Overlay):** `#1E1E20` (Hover states, input fields).

## Typography

The typography strategy pairs the avant-garde, expressive nature of **Syne** for headlines with the technical precision of **Hanken Grotesk** for UI and body text.

**JetBrains Mono** is used sparingly for metadata, keyboard shortcuts (⌘K), and code-related snippets to reinforce the "developer tool" persona.

Maintain high contrast between display sizes and body text. Use `label-caps` for section headers in the sidebar and dashboard to create an editorial structure.

## Layout & Spacing

The layout uses a **Fixed-Fluid Hybrid** model. The sidebar remains fixed (with a toggle to collapse), while the main content area utilizes a fluid grid that maximizes at 1280px to maintain readability.

### Grid & Margins

- **Desktop:** 12-column grid, 24px gutters, 40px outer margins.
- **Tablet:** 8-column grid, 20px gutters, 24px outer margins.
- **Mobile:** 4-column grid, 16px gutters, 16px outer margins.

### Vertical Rhythm

Use a baseline power-of-two scale (8px, 16px, 32px, 64px). Larger gaps (64px+) should be used between major editorial sections (Hero vs. Features) to create the "magazine" feel.

## Elevation & Depth

This design system uses **Tonal Layering** combined with **Subtle Color Glows** rather than traditional heavy shadows.

- **Level 0 (Base):** `#0D0D0F`.
- **Level 1 (Cards/Sidebar):** `#161618` with a 1px solid border of `#262626`.
- **Level 2 (Modals/Popovers):** `#1E1E20` with a soft 20% opacity shadow tinted by the primary brand color.
- **Active State:** When a card is hovered, apply a 2px outer glow (`box-shadow`) using the item's specific accent color at 30% opacity. This creates a "neon rail" effect that highlights the content type.

## Shapes

The shape language is "Soft-Technical." Elements are predominantly rectangular with subtle 4px (0.25rem) rounding to maintain a professional, sharp appearance.

- **Buttons & Inputs:** 4px radius.
- **Cards:** 8px radius.
- **Status Pills:** Fully rounded (pill-shaped) to provide visual contrast against the structured grid.
- **Selection Brackets:** Use sharp corners for active state indicators in the sidebar to mimic a code editor's cursor.

## Components

### Item Cards

- **Structure:** 1px `#262626` border, 4px solid left-border using the Item Type Color.
- **Content:** Title in `body-md` (bold), preview text in `body-sm` (muted).
- **States:** Hover triggers a subtle background lift to `#1E1E20` and the type-specific glow.

### Command Search (⌘K)

- **Style:** Large modal, centered. Uses a monospaced prompt character `>` in the primary accent color.
- **Input:** No border, transparent background, uses `headline-md` size for the search query.

### Buttons

- **Primary:** Solid White background, Black text. High contrast, sharp corners (4px).
- **Secondary:** Transparent background, 1px `#262626` border, White text.
- **Type-Specific:** Ghost buttons that use the item color only on hover for the text and icon.

### Sidebar

- **Navigation:** Vertical list with 12px vertical spacing.
- **Active Item:** Indicator is a vertical bar on the left and a 10% opacity background fill of the item's color.

### Chips & Tags

- Small, uppercase monospaced text.
- Background is always a 10% tint of the category color with a 100% opaque border of the same color at 0.5px width.
