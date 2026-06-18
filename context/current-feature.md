# root-home-page-spec

# Current Feature

<!-- Rediseñar la root page (/) siguiendo el sistema de diseño editorial de DevMemo -->

## Status

In Progress

## Goals

- Rediseñar `app/page.tsx` para que coincida visualmente con el diseño definido en `context/stich/home-design.md`.
- Reutilizar patrones visuales del `AuthLayoutShell` de login (gradientes radiales, grid overlay, cards con backdrop-blur, badges).
- Hero section con headline grande (Syne, 64px desktop), descripción editorial, y CTAs `Iniciar sesión` / `Registrarse`.
- Usuario autenticado → navegación a `/dashboard`. No autenticado → CTAs visibles de login/registro.
- Secciones editoriales con espaciado vertical 64px+ siguiendo baseline 8/16/32/64.
- Colores de acento funcionales (snippet, prompt, command, note, file, image, url) como acentos en cards/features.
- Mantener el mensaje `accountDeleted=true`.
- Responsive: max-w-7xl desktop, adaptable tablet/mobile.
- Accesibilidad: HTML semántico, heading hierarchy, alt text, contraste.
- No modificar auth, esquema BD, ni añadir dependencias.
- Pasar lint, typecheck y build.

## Notes

- Referencia: `context/stich/home-design.md` (sistema de diseño completo) + `context/stich/screens/home-screen.png`.
- Login actual usa `AuthLayoutShell`: gradiente radial doble, grid overlay, 2-columnas, card backdrop-blur, badge dot verde.
- Home actual es un placeholder — reemplazar por completo.
- Fuentes: Syne (headlines), Hanken Grotesk (body), JetBrains Mono (metadata). Configuradas en `app/layout.tsx`.
- Paleta obsidian: #0D0D0F base, #161618 surface, #1E1E20 overlay, #e3e2e7 on-surface, #262626 border-subtle.
- Rutas: login → `/login`, register → `/register`, dashboard → `/dashboard`.
- Componentes reutilizables: `Button` (shadcn), `Link` (Next.js).

## History

<!-- refers to the file @context/history.md -->
