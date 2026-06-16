### History Instructions

- This file is append-only. The file will log the code changes and the features added to the application.
- You must create a title with the date in format year-month-day and hour of the edit in format 24 hours. Next to the date add a title with no more than 10 words.
- Under the title line a summary of what has been changed.
- You can use the first in the history section as a reference.
- The history starts under the title History

## History

<!-- Mantener el history.md actualizado en orden cronológio ascendente. Earliest to latest -->

## 2026-06-09 :: 17:53 - Dashboard fase 1

- Dashboard fase 1: creada la ruta `/dashboard`, top bar con búsqueda y placeholders de `Menu` y `Main`.

## 2026-06-09 :: 17:55 - Dashboard fase 2

- Dashboard fase 2: se implementó un layout con sidebar colapsable, drawer para mobile, listado de tipos de item con icono y color, sección desplegable de colecciones con las 3 más recientes, enlace a favoritas y "Ver todas", además del usuario activo al pie del menú.

## 2026-06-09 :: 18:03 - Dashboard fase 3

- Dashboard fase 3 activada y marcada como `In Progress` usando `context/features/dashboard-3-spec.md` como referencia.
- Dashboard fase 3: se implementó la sección principal con cards resumen, últimas colecciones, items fijados con vista de tarjetas o lista, y se añadió más margen lateral en la sección main.

## 2026-06-09 :: 19:17 - Seed de system item types

- Prisma + Supabase completado: esquema completo de 10 modelos con migración inicial.
- Añadido `DIRECT_URL` a `.env.example` documentando la separación pooled vs directa.
- Creado `prisma/seed.ts` con los 7 tipos de sistema (Snippet, Prompt, Note, Command, File, Image, URL) — idempotente.
- Añadidos scripts `prisma:seed` y `prisma db seed` configurados.
- Instalado `tsx` como dependencia de desarrollo.
- Creado `scripts/test-db.ts` para probar conexión a BD.
- Añadido script `scripts:test-db` en `package.json`.

## 2026-06-10 :: 17:36 - Nueva feature seed demo

- Actualizado `context/current-feature.md` para activar la feature de seed de datos demo usando `context/features/seed-spec.md` como referencia.
- Definidos los objetivos para crear el usuario demo, reutilizar `@lib/mockdata.ts` y poblar las colecciones e items requeridos.

## 2026-06-10 :: 17:47 - Implementado seed demo

- Añadido el campo `password` al modelo `User` en Prisma y creada la migración `add_user_password`.
- Instalado `bcryptjs` para guardar la contraseña hasheada del usuario demo con 12 rounds.
- Reescrito `prisma/seed.ts` para asegurar los system item types y recrear el dataset demo desde `@lib/mockdata.ts` usando ids reales de la base.
- Verificado el seed: usuario `demo@devmemo.com` creado correctamente con 5 colecciones, 8 tags y 10 items.

## 2026-06-10 :: 17:58 - Verificación de lectura BD

- Actualizado `scripts/test-db.ts` para consultar una fila de cada tabla con Prisma y confirmar que las lecturas funcionan también cuando una tabla está vacía.

## 2026-06-10 :: 18:35 - Corregida ruta db collections

- Representación en el dashboard de los datos de colecciones leidos de la db
- Movido el módulo de colecciones del dashboard desde `src/lib/db/collections.ts` a `lib/db/collections.ts` para respetar la convención del proyecto.
- Actualizado `app/dashboard/page.tsx` para importar desde `@/lib/db/collections`.

## 2026-06-10 :: 18:45 - Migración global de lib

- Movido `src/lib/prisma.ts` a `lib/prisma.ts` y actualizados los imports para usar la convención raíz `lib/`.
- Reconfigurado Prisma para generar el cliente en `lib/generated/prisma` y ajustados `prisma/seed.ts` y `scripts/test-db.ts`.
- Eliminado el árbol obsoleto `src/lib/` tras completar la migración de rutas.

## 2026-06-10 :: 18:58 - Cleanup Prisma en lib/db

- Movido el singleton de Prisma a `lib/db/prisma.ts` para dejar toda la lógica de base de datos bajo `lib/db`.
- Actualizado `prisma/schema.prisma` para generar el cliente en `lib/db/generated/prisma` y ajustados los imports de runtime y scripts.
- Preparado el reemplazo del cliente generado obsoleto en `lib/db/prisma/` por la nueva salida en `lib/db/generated/prisma`.

## 2026-06-10 :: 19:20 - Dashboard items desde base de datos

- Creado `lib/db/items.ts` para obtener los items del dashboard desde Prisma/Supabase.
- Actualizado `app/dashboard/page.tsx` para cargar la sección de items directamente en el Server Component junto con el resumen y las colecciones.
- Adaptado `components/dashboard/pinned-section.tsx` para renderizar items reales de la base, mantener el diseño actual y mostrar tipos en español.
- La sección ahora muestra todos los items fijados si existen; si no, renderiza los 6 items más recientes con el título `ÚLTIMOS ITEMS`.

## 2026-06-10 :: 19:45 - Sidebar desde Prisma

- Reemplazados los mocks del sidebar por lecturas reales desde Prisma/Supabase para tipos de item y colecciones.
- Añadidas `getSidebarItemTypes` en `lib/db/items.ts` y `getSidebarCollections` en `lib/db/collections.ts`, con orden de tipos sistema primero, conteos por tipo y 6 colecciones recientes.
- Convertido `app/dashboard/layout.tsx` en Server Component para obtener los datos del sidebar en el servidor y pasarlos al shell cliente.
- Actualizado `components/dashboard/sidebar.tsx` para renderizar links reales, mostrar el contador a la izquierda y colorear los bullets de colecciones según el tipo predominante.

## 2026-06-10 :: 20:05 - Sidebar usuario desde base de datos

- Creado `lib/db/user.ts` para obtener los datos del usuario del sidebar desde Prisma/Supabase.
- Actualizado `app/dashboard/layout.tsx` para cargar los datos del usuario en el servidor junto con los del sidebar.
- Actualizado `components/dashboard/dashboard-layout-shell.tsx` y `components/dashboard/sidebar.tsx` para usar datos reales de base de datos (email, nombre, avatar).

## 2026-06-10 :: 20:35 - Cleanup dashboard y tipos

- Extraído el registro compartido de iconos de tipos a `lib/item-type-icons.tsx` para reutilizarlo en dashboard, sidebar y pinned items.
- Unificada la metadata de item types en `lib/item-types.ts`, tomando `lib/mockdata.ts` como referencia canónica para labels, iconos, colores y hrefs.
- Simplificados `lib/db/items.ts` y `lib/db/collections.ts` para reutilizar helpers compartidos y reducir shapes ad hoc.
- Divididos componentes grandes del dashboard en piezas presentacionales más pequeñas y limpiado el ruido de lint en `.agents/skills/tailwind-v4-shadcn/templates/theme-provider.tsx`.

## 2026-06-13 :: 13:23 - UI auth personalizada

- Feature auth-3-spec: reemplazadas las páginas por defecto de NextAuth con UI custom en español para `/login` y `/register`.
- Creados formularios de login y registro con validaciones, estados de carga, manejo de errores amigables y redirección de registro exitoso a `/login?registered=true`.
- Añadido perfil fijo en el sidebar con avatar por imagen o iniciales, link a `/profile` y acción visible de `Cerrar sesión` con redirección a `/`.
- Ajustado el wiring de auth para usar la página custom de login, soporte de imágenes remotas y datos reales del usuario autenticado en el sidebar.

## 2026-06-13 :: 15:50 - Verificación por e-mail

- Feature email-verification-spec: añadida verificación de e-mail con Resend para usuarios registrados por credentials.
- Creado flujo de tokens de verificación de un solo uso con hash, expiración e invalidación de tokens previos.
- Añadida página `/verify-email` para validar el enlace, marcar `User.emailVerified` y mostrar mensajes en español.
- Bloqueado el login por credentials cuando el e-mail no está verificado y añadido reenvío del enlace desde la experiencia de login.
- Actualizados Prisma, `.env.example` y utilidades server-only para soportar el envío y validación del flujo de verificación.

## 2026-06-13 :: 18:13 - Auth setup NextAuth GitHub

- Feature auth-1-spec: implementado NextAuth v5 con split config edge-safe.
- Creados `auth/auth.config.ts` (edge-safe, solo GitHub provider) y `auth/auth.ts` (PrismaAdapter + JWT + session.id).
- Creado `proxy.ts` para proteger `/dashboard/*` con redirect a sign-in.
- Creado `app/api/auth/[...nextauth]/route.ts` y `auth/next-auth.d.ts` (type augmentation).
- Instalados `next-auth@beta ^5.0.0-beta.31` y `@auth/prisma-adapter ^2.11.2`.
- Añadidas variables `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` a `.env` y `.env.example`.

## 2026-06-13 :: 20:30 - Credentials y registro

- Feature auth-2-spec: añadido Credentials provider con split pattern edge-safe.
- Actualizado `auth/auth.config.ts` con placeholder de Credentials.
- Actualizado `auth/auth.ts` con lógica real de authorize: validación email/password, bcrypt compare, normalización email, retorno NextAuth-compatible.
- Creado `app/api/auth/register/route.ts` para registro público con validación, password policy, 409 en duplicado, hash bcrypt (10 rounds) y 201 sin exponer hash.

## 2026-06-13 :: 22:25 - Reset de contraseña

- Feature password-reset-spec: implementado flujo completo de reset de contraseña con Resend, tokens seguros de un solo uso con hash y expiración de 1 hora.
- Creadas páginas `/forgot-password` y `/reset-password` con Server Actions, UI en español, campos con iconos de ojo y validación de contraseña.
- Añadido modelo `PasswordResetToken` en Prisma con migración, política de contraseñas centralizada en `lib/auth/password-policy.ts`, y mensajes de reset en español.
- Invalidados tokens previos del mismo email al crear uno nuevo; redirección a `/login?reset=true` tras éxito.
- Corregido error de Next.js 16: los archivos `use server` no pueden exportar valores no-funcionales.

## 2026-06-14 :: 00:20 - Página de perfil

- Feature profile-page-spec: añadida la página protegida `/profile` reutilizando el shell visual del dashboard.
- Creado componente reutilizable `Avatar` con fallback a iniciales o email cuando no hay imagen.
- Implementado cambio de contraseña para usuarios credentials mediante Server Action con validación de contraseña actual, política reutilizada y hash bcrypt.
- Añadida tarjeta de estadísticas con total de items, colecciones y desglose por tipo usando iconos y colores compartidos.
- Actualizado `proxy.ts` para proteger `/profile` y mantenido el botón de eliminar cuenta como placeholder sin funcionalidad.

## 2026-06-14 :: 10:45 - Rate limiting auth

- Feature rate-limiting-spec: añadido rate limiting server-side con Upstash Redis para login, registro, reset de contraseña, reenvío de verificación y cambio de contraseña.
- Creados `lib/rate-limit.ts` y `lib/get-ip.ts` para centralizar los limitadores sliding-window y la extracción compartida de IP en API Routes y Server Actions.
- Actualizado `auth/auth.ts` y `app/api/auth/register/route.ts` para bloquear intentos excedidos con mensajes en español y `Retry-After` en el registro.
- Adaptadas las Server Actions de auth para devolver errores estructurados con el tiempo exacto de espera antes del siguiente intento.
- Añadidas variables Upstash a `.env.example` y ajustada la UI de login para mostrar mensajes dinámicos como "Inténtalo de nuevo en 5 minutos".

## 2026-06-14 :: 11:26 - Borrado de cuenta

- Feature delete-account-spec: implementado el flujo de eliminación de cuenta dentro de `/profile` con confirmación explícita.
- Añadido un modal en español con advertencia irreversible, input obligatorio `BORRAR` y botón `Continuar` deshabilitado hasta validación exacta.
- Creada la Server Action `actions/profile/delete-account.ts` para borrar únicamente al usuario autenticado, limpiar datos relacionados y cerrar sesión antes de redirigir a `/`.
- Protegido el usuario demo `demo@devmemo.com`, mostrando el mensaje `El usuario demo no se puede eliminar` sin borrar datos.
- Actualizada la home (`app/page.tsx`) para mostrar el mensaje `Tu cuenta se ha eliminado correctamente.` tras el redirect de éxito.

## 2026-06-14 :: 11:39 - Linking GitHub por email

- Feature fix-account-linking: corregido el error `OAuthAccountNotLinked` para usuarios registrados con email/contraseña que luego inician sesión con GitHub usando el mismo correo.
- Actualizado `auth/auth.config.ts` para configurar el provider GitHub con `allowDangerousEmailAccountLinking: true`.
- Mantenido el alcance mínimo: sin cambios de UI, sin tocar otros providers y sin migraciones de base de datos.
- Añadido `context/features/fix-account-linking.md` al repo como spec de referencia para este ajuste puntual.

## 2026-06-14 :: 14:03 - Items list view por tipo

- Feature item-list-spec: creada la ruta dinámica `/items/[type]` para mostrar items filtrados por tipo.
- Añadido `getCanonicalItemTypeBySlug()` en `lib/item-types.ts` para resolver slugs a tipos canónicos, incluyendo campo `gender` para concordancia gramatical (Nueva Nota, Nuevo Snippet).
- Añadido `getItemsByTypeName()` en `lib/db/items.ts` para consultar items filtrados por tipo con conteo total.
- Creado `app/items/[type]/page.tsx` con grid responsive de ItemCard, empty state con botón "Nuevo/Nueva {tipo}", y notFound() para slugs inválidos.
- Ajustado margen y centrado del main del dashboard layout (max-w-5xl, padding progresivo).
- Renombrado PinnedItemCard a ItemCard y PinnedItemActions a ItemActions, movidos a `components/items/`.
- Añadido `isPinned` toggle al componente ItemActions (muestra Pin/PinOff según estado).

## 2026-06-14 :: 14:03 - Refactor componentes items

- Renombrado `PinnedItemCard` → `ItemCard` y movido de `components/dashboard/` a `components/items/`.
- Renombrado `PinnedItemActions` → `ItemActions`, movido a `components/items/`, añadida prop `isPinned` con toggle PinOff/Pin.
- Actualizado `pinned-section.tsx` e `item-card.tsx` para usar los nuevos nombres y pasar `isPinned`.

## 2026-06-14 :: 16:53 - Acciones server-side en item cards

- Feature item-card-actions-spec: implementadas acciones reales para eliminar items, marcar favoritos y fijar/desfijar desde `ItemCard` y `PinnedItemRow`.
- Creadas server actions en `actions/items/` con verificación de autenticación, ownership del item y revalidación de rutas afectadas.
- Añadido `components/items/delete-item-dialog.tsx` para confirmar la eliminación con UI accesible y copy en español.
- Actualizado `components/items/item-actions.tsx` para usar toggles optimistas de favorito/fijado y el flujo de borrado con confirmación.
- Actualizados `components/items/item-card.tsx` y `components/dashboard/pinned-item-row.tsx` para reemplazar el item borrado por un mensaje temporal de éxito antes de refrescar la UI.

## 2026-06-14 :: 18:08 - Sheet de detalle de items

- Feature item-detail-spec: añadida la vista de detalle de item en un Sheet lateral reutilizable, sin crear una página separada para el detalle.
- Creado `app/api/items/[id]/route.ts` y ampliado `lib/db/items.ts` con la consulta autenticada para cargar el detalle completo del item bajo demanda.
- Actualizados `components/items/item-card.tsx` y `components/dashboard/pinned-item-row.tsx` para abrir el Sheet al hacer click y reutilizar `ItemActions` dentro del detalle.
- Añadidos `components/ui/sheet.tsx` y `components/items/item-detail-sheet.tsx` con loading skeleton, copy en español, scroll interno y animación real basada en keyframes.
- Corregida la interacción por teclado para que los botones de acciones no abran el Sheet al pulsar `Enter` o `Space`.

## 2026-06-14 :: 19:18 - Edición de items en el Sheet

- Feature item-edit-spec: añadido modo edición al Sheet de detalle de items con formulario controlado por estado local.
- Creada la Server Action `actions/items/update-item.ts` con validación Zod, verificación de autenticación/ownership y whitelist de campos editables.
- Añadidos helpers en `lib/items/editable-item.ts` para capacidades por tipo de item, parseo de tags y lista mantenible de lenguajes.
- Creado el componente shadcn `components/ui/select.tsx` para el selector de lenguaje de snippets y commands.
- Actualizado `components/items/item-detail-sheet.tsx` con botón `Editar`, botones `Guardar`/`Cancelar`, errores de validación en español, mensaje de éxito visible y refresco de UI tras guardar.
- Corregida la animación del Sheet para que el panel entre y salga desde fuera de la pantalla y se eviten saltos visuales al cambiar de estado.
- Reorganizado el encabezado del Sheet en dos líneas para evitar que los iconos de acción se solapen con el botón de cierre.
- Añadidos tests en `__tests__/lib/editable-item.test.ts` para validar la lógica de parseo de tags y capacidades editables.

## 2026-06-15 :: 12:13 - Creación de items con Dialog

- Feature item-create-spec: añadido formulario de creación de items dentro de un shadcn Dialog, lanzado desde el botón "Nuevo/Nueva" en `/items/[type]`.
- Creada la Server Action `actions/items/create-item.ts` con validación Zod, verificación de autenticación, campos por tipo de item y asociación opcional a colección.
- Añadidos helpers en `lib/items/create-item.ts` para capacidades, validación de campos y opciones de lenguaje reutilizadas.
- Creado `components/items/create-item-dialog.tsx` con campos dinámicos por tipo, Select para lenguaje y colección, estado de éxito con auto-cierre y errores en español.
- Creado `components/ui/dialog.tsx` (shadcn Dialog) para el modal de creación.
- Ampliado `lib/db/collections.ts` con `getCollectionsForUserSelect()` y `lib/item-types.ts` con `getItemTypeIconComponent()`.
- Placeholder de tags movido al input ("react, nextjs, prisma (debes separar las etiquetas con comas)") eliminando el texto auxiliar debajo.
- Tests en `__tests__/lib/create-item.test.ts` para validación de campos, capacidades por tipo y parseo de tags.

## 2026-06-15 :: 13:50 - Ajustes Sheet detalle item

- Feature fix-item-detail-sheet-spec: corregido el refresco de la lista al cerrar el Sheet después de cambiar favorito o fijado desde el detalle.
- Actualizado `components/items/item-actions.tsx` para reutilizar el estado optimista y mantener la chincheta visible en ambos estados, coloreándola cuando el item está fijado.
- Reorganizado `components/items/item-detail-sheet.tsx` para mostrar la metadata en una sola card con `Creado`, `Colección`, `Actualizado` y una sección `Tags` a ancho completo.
- Añadido fallback `Sin colección`, mantenida la sección de tags visible aunque esté vacía, y preservada la animación de cierre del Sheet con refresh diferido.

## 2026-06-15 :: 21:30 - Markdown para prompts

- Feature markdown-editor-spec: añadido soporte Markdown solo para items de tipo `prompt` en la vista de detalle, edición y creación.
- Creado `components/items/markdown-editor.tsx` con renderizado mediante `react-markdown` + `remark-gfm`, botón de copiar y conmutador entre `Edición` y `Vista previa`.
- Actualizados `components/items/item-detail-sheet.tsx` y `components/items/create-item-dialog.tsx` para usar el nuevo flujo Markdown manteniendo el campo existente `content` y sin tocar las Server Actions ni el esquema.
- Corregido el envío del contenido al crear prompts también cuando el usuario guarda desde la pestaña `Vista previa`.

## 2026-06-16 :: 14:00 - Subida de archivos con Vercel Blob

- Feature file-upload-spec: añadida subida de archivos e imágenes usando Vercel Blob para items de tipo `file` e `image`.
- Creado modelo Prisma `FileUpload` con migración, campos `blobUrl`, `pathname`, `contentType`, `size`, `kind`, `source`, `status` y relaciones con `User` e `Item`.
- Implementada subida server-side por defecto y subida client-side para archivos >4.5 MB, con máximo 10 MB.
- Creadas Server Actions `actions/storage/upload-file.ts` y `actions/storage/delete-file.ts` con autenticación, validación de tipo/tamaño, subida a Blob y persistencia en BD.
- Creado route handler `app/api/storage/upload/route.ts` para el flujo de client upload con `handleUpload`, generación de tokens y callback `onUploadCompleted`.
- Creado `actions/storage/create-upload-draft.ts` para pre-crear drafts con pathname estructurado antes de la subida client-side.
- Creado `actions/storage/finalize-client-upload.ts` para finalizar el registro de subida client-side inmediatamente después de `upload()` (sin depender del webhook asíncrono de Vercel).
- Añadido `lib/storage/file-validation.ts` con validación de tipos/tamaños, `shouldUseClientUpload()`, `buildUploadPathname()`, `getUploadIdFromPathname()`, `sanitizeUploadFilename()`.
- Añadido `lib/storage/file-uploads.ts` con `uploadFileToBlob()`, `createUploadDraft()`, `finalizeUploadRecord()`, `finalizeClientUpload()`, `deleteUploadById()`, `deleteUploadForItem()`.
- Creado `components/items/file-upload-field.tsx` con flujo en tres fases para client upload (draft → upload → finalize) y preview de imagen/archivo.
- Actualizados `components/items/create-item-dialog.tsx` y `actions/items/create-item.ts` para integrar el campo `fileUploadId` en items de tipo archivo/imagen.
- Actualizado `actions/items/delete-item.ts` para eliminar el blob asociado al borrar un item.
- Configurado `next.config.ts` con `remotePatterns` para Vercel Blob en `next/image`.
- Corregido bug: client upload usaba `file.name` como pathname plano, impedía extraer el `uploadId` del draft. Solución: crear draft primero con pathname estructurado.
- Corregido bug: `onUploadCompleted` no se ejecuta en local (webhook de Vercel no alcanza localhost). Solución: finalizar registro vía Server Action tras `upload()`.

## 2026-06-16 :: 14:05 - Drag and drop en FileUploadField

- Feature file-upload-2-spec: añadido soporte de arrastrar y soltar en `components/items/file-upload-field.tsx` para items de tipo `file` e `image`.
- Reemplazado el input de archivo visible por un `<label>` estilizado como zona de drop, asociado a un `<input type="file" className="sr-only">`.
- Implementados manejadores `onDragOver`, `onDragEnter`, `onDragLeave` y `onDrop` con estado `isDragging` y feedback visual.
- Añadidos textos en español diferenciados para archivos e imágenes, y mensaje de estado activo "Suelta el archivo para cargarlo.".
- Extraída función `handleSelectedFile(file)` para compartir la lógica de validación y subida entre click y drop.
- Preservada la accesibilidad con `htmlFor`/`id`, `role="button"` en el label y `aria-live="polite"` para mensajes dinámicos.
- Mantenida toda la lógica de subida existente (server/client upload, preview, cambiar/eliminar archivo).
- Simplificado el mensaje de éxito a `Archivo subido correctamente.` sin distinguir estrategia de subida.

## 2026-06-16 :: 17:00 - Descarga y preview en Sheet

- Feature sheet-preview-download-spec: añadidos botón de descarga y preview de imagen en el Sheet de detalle para items de tipo `file` e `image`.
- Añadido botón `Descargar archivo` / `Descargar imagen` en el header del Sheet cuando existe `fileUrl`.
- Corregida la descarga de imágenes: el atributo `download` no funciona con URLs cross-origin (Vercel Blob), por lo que se implementó un helper `downloadFile()` que fetchea el blob y dispara la descarga via object URL.
- Añadida sección `Vista previa` con `next/image` a ancho completo, padding ligero y bordes redondeados para items de tipo `image`.
- Preservadas las acciones existentes del Sheet y el modo edición.

## 2026-06-16 :: 18:25 - Redirección en rutas protegidas

- Feature fix-protected-routes-redirect-spec: corregida la redirección de rutas protegidas para usuarios no autenticados.
- Añadida comprobación `if (!session?.user?.id) redirect('/login')` en `app/dashboard/layout.tsx`, `app/dashboard/page.tsx`, `app/items/[type]/page.tsx` y `app/profile/page.tsx`.
- Actualizado `proxy.ts` con matcher `/dashboard/:path*`, `/items/:path*` y `/profile` como defensa adicional.
- Eliminados estados vacíos o retornos `null` para visitantes sin sesión.
- Añadido spec de referencia en `context/features/fix-protected-routes-redirect-spec.md`.
- Lint, typecheck, build y tests pasan correctamente.

## 2026-06-16 :: 18:37 - Validación de email compartida

- Feature fix-extract-shared-email-validation: centralizada la validación y normalización de email en `lib/validation/email.ts`.
- Extraída función `isValidEmail(email)` para sustituir la regex duplicada en `components/auth/register-form.tsx`, `actions/auth/request-password-reset.ts`, `actions/auth/resend-verification.ts` y `app/api/auth/register/route.ts`.
- Extraída función `normalizeEmail(email)` (trim + lowercase) para centralizar la normalización.
- Creado spec de referencia en `context/features/fix-extract-shared-email-validation.md`.
- Lint, build y tests pasan correctamente.

## 2026-06-16 :: 18:55 - Reglas de item compartidas

- Feature fix-extract-shared-item-rules: centralizadas las reglas de capacidades y normalización de items en `lib/items/shared.ts`.
- Extraídas constantes `ITEM_TYPES_WITH_CONTENT`, `ITEM_TYPES_WITH_LANGUAGE`, `ITEM_TYPES_WITH_URL`, `ITEM_TYPES_WITH_FILE_UPLOAD` y `EDITABLE_ITEM_LANGUAGE_OPTIONS` a `shared.ts`.
- Extraídos helpers `supportsContent`, `supportsLanguage`, `supportsUrl`, `supportsFileUpload`, `normalizeNullableText`, `normalizeTags` e `isAllowedItemLanguage` a `shared.ts`.
- Refactorizados `lib/items/create-item.ts` y `lib/items/editable-item.ts` para importar desde el módulo compartido, eliminando la duplicación.
- Creado spec de referencia en `context/features/fix-extract-shared-item-rules.md`.
- Lint, build y tests pasan correctamente.
