# readme-generation-spec

# Current Feature

<!-- Crear README.md completo en español para el proyecto DevMemo -->

## Status

In Progress

## Goals

- Crear `README.md` raíz en español basado en `project-overview.md` y `history.md`.
- Estructura: descripción, features implementados, tipos de item, tech stack, getting started, env vars, database, auth, file uploads, search, scripts, status, roadmap.
- Separar features implementados (MVP) de futuros/planeados.
- Documentar setup práctico: clone, install, .env, migrations, seed, dev server.
- Listar variables de entorno desde `.env.example` (sin valores reales).
- Incluir scripts reales desde `package.json`.
- README conciso, técnico, en español. Sin marketing excesivo.
- Mencionar que la UI está en español.
- Sin badges, screenshots, ni features inventadas.
- Pasar lint, typecheck y build.

## Notes

- Fuentes: `@context/project-overview.md` (producto, features, stack, roadmap) y `@context/history.md` (implementación real).
- `history.md` tiene prioridad sobre `project-overview.md` para determinar qué está implementado.
- No inventar features, paquetes, comandos ni variables de entorno.
- `.env.example` contiene las variables reales a documentar.
- README debe estar en español (no inglés como dice equivocadamente la sección "Contributing").

## History

<!-- refers to the file @context/history.md -->
