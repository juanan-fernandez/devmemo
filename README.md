# DevMemo

Tu centro de conocimiento para desarrolladores. Guarda, organiza y recupera snippets, prompts, notas, comandos, archivos, imágenes y enlaces desde un único lugar.

---

## Resumen

DevMemo resuelve el problema del conocimiento técnico disperso: snippets en VS Code, prompts en chats, comandos en archivos `.txt`, enlaces en marcadores, y documentos en carpetas aleatorias. Proporciona un hub unificado con búsqueda global, tipos de contenido predefinidos, colecciones, favoritos y autenticación segura.

La interfaz está completamente en español y sigue un diseño editorial oscuro pensado para desarrolladores.

---

## Funcionalidades implementadas

### MVP actual

| Funcionalidad | Descripción |
|---|---|
| **Dashboard** | Vista principal con resumen de actividad, últimos items, colecciones recientes y acceso rápido |
| **Tipos de item** | 7 tipos predefinidos con iconos, colores y campos específicos por tipo |
| **Items CRUD** | Crear, leer, editar y eliminar items. Vista en grid, detalle en Sheet lateral |
| **Colecciones** | Agrupar items de cualquier tipo. CRUD completo, favoritas, infinite scroll |
| **Búsqueda global** | Buscar items y colecciones desde cualquier página. Atajo `Cmd+B` / `Ctrl+B`. Filtrado client-side |
| **Favoritos y fijados** | Marcar items y colecciones como favoritos. Fijar items en el dashboard |
| **Editor Markdown** | Soporte Markdown con vista previa para items de tipo prompt |
| **Subida de archivos** | Soporte para archivos e imágenes con Vercel Blob. Drag & drop, preview y descarga |
| **Autenticación** | Email/contraseña + GitHub OAuth. Registro, login, verificación de email, reset de contraseña |
| **Perfil de usuario** | Página de perfil con estadísticas, cambio de contraseña y eliminación de cuenta |
| **Rate limiting** | Protección contra abusos en auth con Upstash Redis |
| **Landing page** | Página raíz `/` con diseño editorial, preview de funcionalidades y formulario de login/registro funcional |
| **Rutas protegidas** | Redirección a login para usuarios no autenticados en `/dashboard`, `/items/*`, `/profile`, `/collections/*` |

---

## Tipos de item

Cada tipo tiene un icono, color de acento y campos específicos:

| Tipo | Color | Campos |
|---|---|---|
| **Snippet** | Verde | Título, descripción, lenguaje, código, tags |
| **Prompt** | Púrpura | Título, descripción, contenido Markdown, tags |
| **Nota** | Cian | Título, descripción, contenido, tags |
| **Comando** | Naranja | Título, descripción, lenguaje, comando, tags |
| **Archivo** | Ámbar | Título, descripción, archivo, tags |
| **Imagen** | Rosa | Título, descripción, imagen, tags |
| **Enlace** | Azul | Título, descripción, URL, tags |

---

## Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, React 19, Turbopack) |
| Lenguaje | TypeScript (strict) |
| ORM | Prisma |
| Base de datos | Supabase PostgreSQL |
| Autenticación | Auth.js v5 (NextAuth) — email/contraseña + GitHub OAuth |
| UI | Tailwind CSS v4 + shadcn/ui |
| Email | Resend |
| Almacenamiento | Vercel Blob |
| Rate limiting | Upstash Redis |
| Testing | Vitest |
| Despliegue | Vercel |

---

## Primeros pasos

### 1. Clonar el repositorio

```bash
git clone https://github.com/juanan-fernandez/devmemo.git
cd devmemo
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia `.env.example` a `.env.local` y completa las variables:

```bash
cp .env.example .env.local
```

### 4. Ejecutar migraciones

```bash
npx prisma migrate dev
```

### 5. Poblar la base de datos (seed)

```bash
npm run prisma:seed
```

Esto crea los 7 tipos de sistema y un usuario demo.

### 6. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DATABASE_URL` | Sí | Conexión pooled a PostgreSQL (PgBouncer) |
| `DIRECT_URL` | Sí | Conexión directa para migraciones |
| `AUTH_SECRET` | Sí | Secreto de Auth.js |
| `AUTH_GITHUB_ID` | No | Client ID de GitHub OAuth |
| `AUTH_GITHUB_SECRET` | No | Client Secret de GitHub OAuth |
| `RESEND_API_KEY` | No | API key de Resend para emails |
| `EMAIL_FROM` | No | Dirección remitente de emails |
| `APP_URL` | No | URL pública de la app (para links de verificación) |
| `EMAIL_VERIFICATION` | No | Activar verificación de email (`true`/`false`) |
| `BLOB_STORE_ID` | No | ID del store de Vercel Blob |
| `BLOB_READ_WRITE_TOKEN` | No | Token de lectura/escritura de Vercel Blob |
| `UPSTASH_REDIS_REST_URL` | No | URL de Upstash Redis para rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | No | Token de Upstash Redis |

---

## Base de datos

DevMemo usa **Prisma ORM** sobre **Supabase PostgreSQL**. El esquema incluye los modelos `User`, `Item`, `ItemType`, `Collection`, `Tag`, `ItemTag`, `FileUpload`, `VerificationToken` y `PasswordResetToken`.

El seed crea:
- 7 tipos de sistema (Snippet, Prompt, Nota, Comando, Archivo, Imagen, Enlace)
- Usuario demo: `demo@devmemo.com`
- 5 colecciones, 8 tags y 10 items de ejemplo

---

## Autenticación

- **Registro** con email y contraseña (POST `/api/auth/register`)
- **Login** con credenciales o GitHub OAuth
- **Verificación de email** vía Resend (opcional, controlado por `EMAIL_VERIFICATION`)
- **Reset de contraseña** con tokens de un solo uso
- **Rutas protegidas**: redirección automática a `/login` para visitantes sin sesión
- La landing page (`/`) redirige a `/dashboard` si el usuario ya está autenticado

---

## Búsqueda global

La búsqueda se activa desde la barra superior del dashboard:

- **Click** en el input de búsqueda o atajo `Cmd+B` / `Ctrl+B`
- Interfaz basada en shadcn Command (`cmdk`)
- Resultados agrupados en **Items** y **Colecciones**
- Filtrado client-side case-insensitive por título, descripción, tipo y tags
- Seleccionar un item abre el Sheet de detalle
- Seleccionar una colección navega a su página
- El índice se precarga en el servidor al cargar el layout del dashboard

---

## Subida de archivos

Los items de tipo **Archivo** e **Imagen** usan **Vercel Blob**:

- Subida server-side para archivos pequeños (< 4.5 MB)
- Subida client-side directa para archivos grandes (hasta 10 MB)
- Drag & drop en el formulario de creación
- Vista previa de imágenes en el Sheet de detalle
- Descarga de archivos desde el Sheet

---

## Scripts del proyecto

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Build de producción |
| `npm start` | Iniciar servidor de producción |
| `npm run lint` | ESLint |
| `npm test` | Vitest (tests unitarios) |
| `npm run prisma:generate` | Generar cliente Prisma |
| `npm run prisma:migrate` | Ejecutar migraciones |
| `npm run prisma:studio` | Abrir Prisma Studio |
| `npm run prisma:seed` | Poblar base de datos |
| `npm run scripts:test-db` | Verificar conexión a BD |

---

## Roadmap

### ✅ Implementado (MVP)

Dashboard, 7 tipos de item, CRUD de items, colecciones, búsqueda global, favoritos/fijados, autenticación completa (email, GitHub, verificación, reset), perfil de usuario, subida de archivos, landing page editorial.

### 🔜 Próximas mejoras

- Exportación de datos (JSON / ZIP)
- Importación desde archivos
- Editor de código con syntax highlighting
- Modo claro (actualmente solo oscuro)

### 🔮 Futuro

- Tipos de item personalizados
- Colecciones compartidas
- Planes de equipo/organización
- Extensión VS Code
- API pública y CLI

---

## Notas de desarrollo

- La UI está completamente en español
- Se usan **Server Actions** para mutaciones de datos
- Los helpers compartidos están en `lib/` (validación, tipos, reglas de items)
- `history.md` registra el histórico completo de cambios
- Los tests cubren server actions y utilidades (Vitest, sin tests de UI)
- El proyecto no está marcado como production-ready — está en fase MVP activa
