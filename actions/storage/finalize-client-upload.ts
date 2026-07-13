'use server'

import type { PutBlobResult } from '@vercel/blob'

import { auth } from '@/auth/auth'
import { finalizeUploadRecord } from '@/lib/storage/file-uploads'
import { logServerError } from '@/lib/logger'

export type FinalizeClientUploadState = {
	successful: boolean
	error: string | null
}

export async function finalizeClientUploadAction(params: {
	blobUrl: string
	downloadUrl: string | null
	pathname: string
	contentType: string
	size: number
	uploadId: string
}): Promise<FinalizeClientUploadState> {
	const session = await auth()

	if (!session?.user?.id) {
		return {
			successful: false,
			error: 'Debes iniciar sesión para subir archivos.'
		}
	}

	try {
		// finalizeUploadRecord only reads blob.url, blob.downloadUrl, and blob.pathname.
		// We construct the minimum shape it needs; unused PutBlobResult fields are stubbed.
		const blob: PutBlobResult = {
			url: params.blobUrl,
			downloadUrl: params.downloadUrl ?? params.blobUrl,
			pathname: params.pathname,
			contentType: params.contentType,
			contentDisposition: '',
			etag: ''
		}

		await finalizeUploadRecord({
			blob,
			contentType: params.contentType,
			size: params.size,
			uploadId: params.uploadId,
			userId: session.user.id
		})

		return { successful: true, error: null }
	} catch (error) {
		logServerError('finalizeClientUpload', error)
		return {
			successful: false,
			error: 'No se ha podido finalizar la subida del archivo.'
		}
	}
}