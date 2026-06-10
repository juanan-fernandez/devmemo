### History Instructions

- This file is append-only. The file will log the code changes and the features added to the application.
- You must create a title with the date in format year-month-day and hour of the edit in format 24 hours. Next to the date add a title with no more than 10 words.
- Under the title line a summary of what has been changed.
- You can use the first in the history section as a reference.
- The history starts under the title History

## History

<!-- Keep this updated. Earliest to latest -->

## 2026-06-09 :: 17:53 - Dashboard fase 1

- dashboard fase 1: creada la ruta `/dashboard`, top bar con búsqueda y placeholders de `Menu` y `Main`.

## 2026-06-09 :: 17:55 - Dashboard fase 2

- Dashboard fase 2: se implementó un layout con sidebar colapsable, drawer para mobile, listado de tipos de item con icono y color, sección desplegable de colecciones con las 3 más recientes, enlace a favoritas y “Ver todas”, además del usuario activo al pie del menú.

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
