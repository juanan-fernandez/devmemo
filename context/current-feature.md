# file-upload-spec

# Current Feature

<!-- Implement file storage with Vercel Blob -->

## Status

In Progress

## Goals

- Add file upload support using Vercel Blob for the item creation flow.
- Show a file input in `components/items/create-item-dialog.tsx` only when the item type is `Archivos` or `Imágenes`.
- Implement server upload as the default strategy.
- Enforce a 10 MB max file size, with validation and file checks isolated in reusable logic.
- Consider creating a reusable `FileUpload` component for forms.
- Use Vercel Blob public uploads with database-scoped access for this app.
- Persist only Blob metadata and URLs in the database, not file binaries.
- Add a Prisma `FileUpload` model and the corresponding relation on `User` if missing.
- Create `actions/storage/upload-file.ts` to upload files with authentication, content-type validation, size validation, Blob upload, and DB persistence.
- Create `actions/storage/delete-file.ts` to delete uploaded files with authentication, ownership checks, Blob deletion, and DB record deletion.
- Configure `next.config.ts` to allow Vercel Blob remote images if uploaded images are rendered with `next/image`.
- Keep sensitive credentials server-side only; `BLOB_READ_WRITE_TOKEN` must not be public.
- Acceptance should include successful upload flow and the project remaining healthy after changes.

## Notes

- Read before coding:
  - Vercel Blob overview: `https://vercel.com/docs/vercel-blob`
  - Server uploads: `https://vercel.com/docs/vercel-blob/server-upload`
  - Client uploads: `https://vercel.com/docs/vercel-blob/client-upload`
  - SDK reference: `https://vercel.com/docs/vercel-blob/using-blob-sdk`
- Server upload should be the default; client upload is only needed if files larger than 4.5 MB must be handled.
- The spec sets an application file size limit of 10 MB, but also says server upload is the default and references Vercel’s smaller server-side limit. This needs to be reconciled during implementation.
- The spec explicitly says to isolate file-size logic and related checks.
- Blob URLs are public by default; DB-scoped access is acceptable here unless content becomes sensitive.
- The spec recommends `addRandomSuffix: true`, but the sample code uses a timestamp-based unique pathname with `addRandomSuffix: false`; this is another implementation detail to decide consciously.
- `del()` requires the full blob URL, so the URL must be stored in the database.
- Expected touched files likely include:
  - `components/items/create-item-dialog.tsx`
  - `prisma/schema.prisma`
  - `actions/storage/upload-file.ts`
  - `actions/storage/delete-file.ts`
  - `next.config.ts`
  - any reusable upload component or validation helper introduced

## History

<!-- refers to the file @context/history.md -->
