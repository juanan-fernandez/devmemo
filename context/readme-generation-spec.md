# Code Agent Instructions: Create Project README.md

## Goal

Create a complete and useful root-level `README.md` for the DevMemo project.

Use the existing project documentation as the source of truth:

```text
project-overview.md
history.md
```

VERY IMPORTANT: **The README.md must be written in Spanish**

## Source Documents

Before writing the README, review:

```text
@context/project-overview.md
@context/history.md
```

If these files are located elsewhere in the repository, use the current project paths that contain the same content.

Use `project-overview.md` for:

- Product purpose
- Target users
- Core features
- Item types
- Collections
- Search
- Authentication
- Tech stack
- UI/UX principles
- Data model summary
- Roadmap

Use `history.md` for:

- Current implemented status
- Recent features
- Actual project evolution
- Implemented authentication, dashboard, items, collections, search, file upload, and home page capabilities

Do not invent features that are not described in these files or implemented in the project.

## README Location

Create or update:

```text
README.md
```

at the project root.

## README Structure

Use this structure:

```markdown
# DevMemo

Short product description.

## Overview

Explain what DevMemo is and the problem it solves.

## Features

List implemented features first, based on `history.md`.

Include, at minimum:

- Dashboard
- Built-in item types
- Items CRUD
- Collections
- Global search
- Favorites and pinned items
- Item detail Sheet
- Item creation and editing
- File and image uploads
- Authentication with email/password and GitHub
- Email verification
- Password reset
- Profile page
- Account deletion
- Protected routes
- Root landing page

Clearly separate planned/future features from implemented features.

## Item Types

Describe the built-in item types:

- Snippet
- Prompt
- Note
- Command
- File
- Image
- URL / Link

Mention that item types have icons, colors, and type-specific fields.

## Tech Stack

Create a concise table with:

- Next.js / React
- TypeScript
- Prisma
- Supabase PostgreSQL
- NextAuth/Auth.js v5
- Tailwind CSS v4
- shadcn/ui
- Resend
- Vercel Blob
- Vercel
- Upstash Redis, if present

Use only technologies that are present in the source docs or codebase.

## Getting Started

Add practical setup instructions.

Include:

1. Clone the repository.
2. Install dependencies.
3. Configure environment variables.
4. Run Prisma migrations.
5. Seed the database.
6. Run the development server.

Use generic package-manager examples unless the project clearly uses a specific one.

Example:

```bash
npm install
npm run dev
```

## Environment Variables

Document the variables that appear in the project history and overview.

Include likely required variables such as:

```env
DATABASE_URL=
DIRECT_URL=
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
APP_URL=
BLOB_READ_WRITE_TOKEN=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Important:

- Verify actual variable names from `.env.example`.
- Do not include real secrets.
- Mark optional variables as optional if the codebase treats them as optional.

## Database

Summarize:

- Prisma ORM
- Supabase PostgreSQL
- Seed process
- Demo user if documented

Mention the demo user only if it is intended for development/demo use:

```text
demo@devmemo.com
```

Do not include passwords in the README unless the project already explicitly documents them for local demo use.

## Authentication

Explain:

- Email/password registration and login
- GitHub OAuth
- Email verification
- Password reset
- Protected private routes

Mention that unauthenticated users are redirected to login for private areas.

## File Uploads

Summarize the file/image upload system:

- Vercel Blob
- File and image item types
- Drag and drop support
- Image previews
- Download support in item detail Sheet

## Search

Summarize global search:

- Search items and collections
- Client-side filtering over a server-loaded index
- Search by title, description, type, and tags
- shadcn Command UI
- Keyboard shortcuts

## Project Scripts

Inspect `package.json` and document the actual scripts.

At minimum, if present, include:

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm test
npm run prisma:seed
```

Only document scripts that exist.

## Project Status

Add a short section explaining that the project has moved beyond planning and includes implemented MVP functionality.

Use `history.md` to describe the current status accurately.

## Roadmap

Use the roadmap from `project-overview.md`, but update wording to avoid presenting already implemented features as future work.

Suggested sections:

- Implemented MVP
- Next improvements
- Future ideas

## Contributing / Development Notes

Add short notes:

- Keep UI copy in Spanish.
- Keep README in English.
- Prefer Server Actions where the project already uses them.
- Keep `history.md` updated with every meaningful change.
- Use existing shared helpers before adding duplicate logic.

## README Style Requirements

- Write in clear, concise English.
- Avoid excessive marketing language.
- Prefer practical developer documentation.
- Use Markdown headings and tables.
- Use short paragraphs.
- Use bullet lists where useful.
- Do not include large code blocks unless necessary.
- Do not include screenshots unless the files exist and paths are known.
- Do not add badges unless the project already has CI/license/package information.
- Do not claim the project is production-ready unless the source docs support that.

## Accuracy Rules

- Prefer the current implementation from `history.md` over older planning notes.
- If `project-overview.md` says a feature is planned but `history.md` says it is implemented, describe it as implemented.
- If a feature is only planned and not present in `history.md`, place it under Roadmap or Future Enhancements.
- If uncertain, write a neutral sentence or omit the claim.
- Do not invent package names, commands, deployment settings, or environment variables.

## Acceptance Criteria

- A root `README.md` is created or updated.
- The README is written in Spanish.
- The README accurately reflects the project overview and implementation history.
- Implemented features and roadmap items are clearly separated.
- Setup instructions are practical and based on the current codebase.
- Environment variables are documented without real secret values.
- Actual package scripts are documented.
- The README mentions that application UI text is Spanish.
- The README is concise, readable, and useful for a developer opening the repository for the first time.
