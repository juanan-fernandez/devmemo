# Task: Implement File Storage with Vercel Blob

## Stack context

- **Framework:** Next.js (App Router)
- **Auth:** NextAuth v5
- **ORM:** Prisma + Supabase
- **Storage:** Vercel Blob (`@vercel/blob`)
- **Deployment:** Vercel

## Reference documentation

Read before writing any code:

- Vercel Blob overview: https://vercel.com/docs/vercel-blob
- Server uploads: https://vercel.com/docs/vercel-blob/server-upload
- Client uploads (files > 4.5 MB): https://vercel.com/docs/vercel-blob/client-upload
- SDK reference: https://vercel.com/docs/vercel-blob/using-blob-sdk

---

## ⚠️ Critical considerations before writing any code

### 1. Two upload strategies — choose based on file size

| Strategy | Max file size | When to use |
|----------|--------------|-------------|
| **Server upload** (via Server Action or API Route) | 4.5 MB | Images, documents, small files |
| **Client upload** (direct browser → Vercel Blob) | 10 MB | Large files, videos |

Implement **server upload** as the default. It is simpler and covers the majority of use cases (images, documents, snippets, prompts). Add client upload only if the app needs to handle files larger than 4.5 MB.

### 2. File size limits on this application

The file size will be limited to 10 mb. The logic of the file size and other checks must be isolated. Consider create a FileUpload component to reuse in any form.

### 3. Blob URLs are permanent and public by default

By default, uploaded blobs get a public URL (`access: 'public'`). Anyone with the URL can access the file. For user-private files (documents, personal images), either:

- Use `access: 'public'` but store URLs in the DB scoped to the user (security through obscurity — acceptable for non-sensitive files).
- Use the client upload flow with `access: 'private'` for sensitive content that requires signed URLs to access.

For this app (images, documents), **`access: 'public'` with DB-scoped access is sufficient** unless the content is sensitive.

### 4. Filenames — always use `addRandomSuffix: true`

Vercel Blob throws an error if you try to upload a blob with a path that already exists. Always pass `addRandomSuffix: true` to `put()` to prevent collisions. The returned `blob.url` and `blob.pathname` reflect the final name with the suffix.

### 5. Store the blob URL in your database, not the file itself

Vercel Blob stores the binary. Your Prisma schema should store only the returned URL (and optionally the pathname for deletion). The file content itself never goes into PostgreSQL.

### 6. Deleting a blob requires the URL, not the path

The `del()` function from `@vercel/blob` takes the full blob URL as returned by `put()`. Store this URL in the database on upload so you can delete it later.

---

## Step 1 — Create the Blob store in Vercel

1. Add the file type input to the create-item form allocated in components/items/create-item-dialog.tsx
2. The control only appears if the item type is "Archivos" o "Imagenes".
3. The Vercel env variables are created in env.local yet.
3. Name it (e.g. `app-uploads`) and confirm.
---

## Step 2 — Install the SDK

Check `package.json` first. If `@vercel/blob` is not present:

```bash
npm install @vercel/blob
```

---

## Step 3 — Prisma schema

Add a `FileUpload` model to `prisma/schema.prisma` to track uploaded files. Add it after existing models — do not modify them:

```prisma
model FileUpload {
  id          String   @id @default(cuid())
  userId      String
  url         String   // Full Vercel Blob URL (used for display and deletion)
  pathname    String   // Blob pathname (e.g. "userId/timestamp-filename.jpg")
  contentType String   // MIME type (e.g. "image/png")
  size        Int      // File size in bytes
  createdAt   DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

> If the existing `User` model does not already have a `fileUploads` relation field, add it:
> ```prisma
> fileUploads FileUpload[]
> ```

Run the migration:

```bash
npx prisma migrate dev --name add-file-upload
```

---

## Step 4 — Upload Server Action

Create `actions/storage/upload-file.ts`:

```ts
'use server'

import { put } from '@vercel/blob'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'text/plain',
  'text/markdown',
]

const MAX_SIZE_BYTES = 4 * 1024 * 1024 // 4 MB (safely under the 4.5 MB Vercel limit)

export async function uploadFile(formData: FormData) {
  // 1. Auth check — always first
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Unauthorized.' }
  }

  const file = formData.get('file') as File | null
  if (!file || file.size === 0) {
    return { error: 'No file provided.' }
  }

  // 2. Validate content type
  if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
    return { error: `File type not allowed: ${file.type}` }
  }

  // 3. Validate size
  if (file.size > MAX_SIZE_BYTES) {
    return { error: 'File exceeds the 4 MB limit.' }
  }

  // 4. Build a namespaced path: userId/timestamp-filename
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
  const pathname = `${session.user.id}/${Date.now()}-${safeName}`

  // 5. Upload to Vercel Blob
  const blob = await put(pathname, file, {
    access: 'public',
    addRandomSuffix: false, // pathname already unique via timestamp
    contentType: file.type,
  })

  // 6. Persist metadata in the database
  const record = await prisma.fileUpload.create({
    data: {
      userId: session.user.id,
      url: blob.url,
      pathname: blob.pathname,
      contentType: file.type,
      size: file.size,
    },
  })

  return { success: true, url: blob.url, id: record.id }
}
```

---

## Step 5 — Delete Server Action

Create `actions/storage/delete-file.ts`:

```ts
'use server'

import { del } from '@vercel/blob'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function deleteFile(fileId: string) {
  // 1. Auth check
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Unauthorized.' }
  }

  // 2. Fetch record — verify ownership before deleting
  const record = await prisma.fileUpload.findUnique({
    where: { id: fileId },
    select: { url: true, userId: true },
  })

  if (!record) {
    return { error: 'File not found.' }
  }

  // 3. Ownership check — user can only delete their own files
  if (record.userId !== session.user.id) {
    return { error: 'Forbidden.' }
  }

  // 4. Delete from Vercel Blob (del() accepts the full URL)
  await del(record.url)

  // 5. Delete DB record
  await prisma.fileUpload.delete({ where: { id: fileId } })

  return { success: true }
}
```

---

## Step 6 — Configure `next.config.ts` for `next/image`

If the app renders uploaded images with `next/image`, add the Vercel Blob hostname to the allowed remote patterns. Open `next.config.ts` and add:

```ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  // ...rest of existing config
}
```

> Do not remove existing `remotePatterns` entries — append to the array.

---

## Step 7 — Environment variables checklist

| Variable | Where | Notes |
|----------|-------|-------|
| `BLOB_READ_WRITE_TOKEN` | `.env.local` + Vercel | Auto-added by Vercel when Blob store is created |

Do NOT prefix this variable with `NEXT_PUBLIC_` — it must stay server-side only.

---

## Step 8 — Manual test checklist

After implementation:

- [ ] Upload a JPEG image → confirm `blob.url` is returned and accessible in the browser.
- [ ] Upload a PDF → confirm it works.
- [ ] Upload a file type not in the allowed list → confirm the action returns an error.
- [ ] Upload a file larger than 4 MB → confirm the action returns an error.
- [ ] Delete an uploaded file → confirm the blob URL returns 404 and the DB record is gone.
- [ ] Attempt to delete another user's file → confirm it returns `{ error: 'Forbidden.' }`.
- [ ] Check the **Storage** tab in the Vercel dashboard → confirm uploaded blobs appear there.

---

## Common pitfalls to avoid

| Pitfall | Fix |
|---------|-----|
| Uploading without auth check | Always call `auth()` at the very top of the Server Action |
| Storing file contents in Postgres | Store only the `blob.url` and metadata — never the binary |
| Forgetting to delete the blob when deleting the DB record | Always call `del(url)` before or after `prisma.fileUpload.delete()` |
| Using the same pathname twice without `addRandomSuffix` | Vercel Blob throws on duplicate pathnames — use timestamp prefix |
| Prefixing `BLOB_READ_WRITE_TOKEN` with `NEXT_PUBLIC_` | Exposes the write token to the browser — keep it server-only |
| Skipping ownership check on delete | Any authenticated user could delete any file by guessing an ID |
