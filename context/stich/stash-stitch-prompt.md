# Prompt para Google Stitch — Stash App

---

**App Name:** Stash — Personal Knowledge Vault  
**Language / Locale:** Spanish (ES), dark theme preferred

---

## 🎯 Objetivo general

Diseña una aplicación web llamada **DevMemo** que permite a los usuarios guardar y organizar distintos tipos de ítems de conocimiento personal (links, snippets de código, comandos, imágenes, documentos, prompts, notas, etc.) de forma similar a Notion. Cada tipo de ítem tiene un color identificador único. Los usuarios pueden agrupar ítems en colecciones.

---

## 🎨 Dirección estética

- **Estilo:** Dark mode. Refinado, moderno, tipo "developer tool meets editorial magazine". Sin gradientes de colores genéricos.
- **Tipografía:** Display font con personalidad (no Inter, no Roboto). Cuerpo legible y elegante.
- **Color base:** Fondo muy oscuro (`#0D0D0F` o similar), texto casi blanco, acentos de color vivos y específicos por tipo de ítem.
- **Colores por tipo de ítem** (cada tipo va etiquetado con su color asociado, ya sea pill, subrayado o borde lateral):

| Tipo | Icono | Color | Hex |
|------|-------|-------|-----|
| Link | 🔗 | Azul eléctrico | `#3B82F6` |
| Snippet de código | 💻 | Verde lima | `#84CC16` |
| Comando | ⌨️ | Naranja | `#F97316` |
| Imagen | 🖼️ | Rosa | `#EC4899` |
| Documento | 📄 | Amarillo ámbar | `#F59E0B` |
| Prompt | 💬 | Violeta | `#8B5CF6` |
| Nota | 📝 | Cian | `#06B6D4` |
| Empate / indefinido | ⬜ | Blanco | `#FFFFFF` |

---

## 📄 PANTALLA 1 — Landing Page (usuario no autenticado)

### Sección Hero (parte superior, full-width)

- Logotipo/nombre "Stash" en display font grande, alineado a la izquierda o centrado.
- **Headline:** Algo como *"Tu segundo cerebro. Todo en un lugar."*
- **Subheadline:** Breve descripción: *"Guarda links, código, comandos, prompts, imágenes y documentos. Organízalos en colecciones. Encuéntralo todo al instante."*
- CTA primario: botón **"Empezar gratis"**
- Visual decorativo: grid de cards flotantes con distintos tipos de ítem, cada una con su color asociado, con efecto de profundidad o parallax sutil.

### Sección Login / Registro (debajo del hero o en modal al pulsar CTA)

- Tabs: **Iniciar sesión** / **Crear cuenta**
- Campos: Email + Contraseña
- Opción de login con Google (botón secundario)
- Diseño compacto, centrado, con el mismo lenguaje visual oscuro.

---

## 📄 PANTALLA 2 — Dashboard principal (usuario autenticado)

### Layout general

- **Sidebar izquierdo** (ocultable con toggle, ancho ~240px):
  - Logo / nombre de la app arriba
  - Botón de colapso (icono hamburger o flecha)
  - Sección **"Tipos de ítem"**: lista de todos los tipos con su punto de color. Botón `+ Nuevo tipo` al final.
  - Sección **"Mis Colecciones"**: lista de colecciones creadas, cada una con el color del tipo predominante. Botón `+ Nueva colección` al final.
  - Avatar + nombre de usuario abajo del todo con opción de logout.

- **Área principal derecha** (scrollable):

#### Barra superior

- Input de búsqueda ancho, estilo prominente: *"Buscar ítems y colecciones…"* con icono de lupa y shortcut hint (ej. `⌘K`).

#### Mini Dashboard — fila de 5 stat cards

Diseño horizontal en cards compactas:

1. 📦 **Total de ítems guardados** — número grande + etiqueta
2. 🗂️ **Total de colecciones** — número grande + etiqueta
3. ⭐ **Ítems favoritos** — número grande + etiqueta
4. 💛 **Colecciones favoritas** — número grande + etiqueta
5. 🕐 **Último ítem añadido** — timestamp relativo (ej. "hace 3 min")

#### Sección "Últimas colecciones"

- Título de sección: *"Colecciones recientes"*
- 3 cards horizontales o en grid 3 columnas.
- Cada card muestra: nombre de la colección, color del tipo predominante (borde superior o fondo tintado), número de ítems dentro, fecha de creación, icono de favorito (estrella toggle).

#### Sección "Últimos favoritos"

- Título de sección: *"Añadidos a favoritos recientemente"*
- 3 cards con los últimos ítems marcados como favoritos.
- Cada card muestra: tipo de ítem (con su color), título/preview del contenido, fecha, botón de acción rápida (copiar / abrir / ver).

---

## 🃏 Anatomía de una Item Card

- Borde izquierdo o pill superior con el color del tipo.
- Icono del tipo (pequeño, monocromático).
- Título del ítem (truncado si largo).
- Preview de contenido (1-2 líneas, opaco).
- Tags opcionales.
- Fecha de creación (relativa).
- Icono de estrella para favorito (toggle).
- Hover state: ligero glow o elevación con sombra del color del tipo.

---

## 📐 Notas adicionales de diseño

- El sidebar colapsado debe mostrar solo iconos (sin labels), con tooltips al hover.
- Las secciones del dashboard deben tener scroll suave. El sidebar es sticky.
- Las cards deben tener animaciones de entrada sutiles (fade + slide up en stagger).
- El input de búsqueda puede abrir un modal tipo "command palette" (estilo Raycast/Linear) al escribir.
- Responsive mínimo: tablet (768px). Mobile es secundario.
- Todos los estados vacíos (sin colecciones, sin ítems) deben tener un empty state ilustrado o con icono + texto de ayuda.

---

> **Nota para Stitch:** Si ofrece variantes, priorizar la versión **dark** con **tipografía de display** y **cards con borde de color lateral**.
