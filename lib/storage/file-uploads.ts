import { del, put, type PutBlobResult } from '@vercel/blob'

import { prisma } from '@/lib/db/prisma'
import {
	buildUploadPathname,
	getUploadIdFromPathname,
	type UploadItemTypeKey,
	validateFileUploadSelection
} from '@/lib/storage/file-validation'

type FinalizedUpload = {
	id: string
	originalName: string
	pathname: string
	blobUrl: string
	downloadUrl: string | null
	contentType: string
	size: number
	kind: string
}

export async function uploadFileToBlob(params: {
	file: File
	typeKey: UploadItemTypeKey
	userId: string
	source: 'server' | 'client'
}): Promise<FinalizedUpload> {
	const validation = validateFileUploadSelection({
		name: params.file.name,
		size: params.file.size,
		type: params.file.type,
		typeKey: params.typeKey
	})

	if (!validation.success) {
		throw new Error(validation.error)
	}

	const draft = await createUploadDraft({
		contentType: params.file.type,
		fileName: params.file.name,
		size: params.file.size,
		typeKey: params.typeKey,
		userId: params.userId,
		source: params.source
	})

	try {
		const blob = await put(draft.pathname, params.file, {
			access: 'public',
			addRandomSuffix: true,
			contentType: params.file.type
		})

		return await finalizeUploadRecord({
			blob,
			contentType: params.file.type,
			size: params.file.size,
			uploadId: draft.id,
			userId: params.userId
		})
	} catch (error) {
		await prisma.fileUpload.delete({
			where: { id: draft.id }
		}).catch(() => undefined)

		throw error
	}
}

export async function createUploadDraft(params: {
	contentType: string
	fileName: string
	size: number
	typeKey: UploadItemTypeKey
	userId: string
	source: 'server' | 'client'
}) {
	const draft = await prisma.fileUpload.create({
		data: {
			contentType: params.contentType,
			kind: params.typeKey,
			originalName: params.fileName,
			pathname: 'pending',
			size: params.size,
			source: params.source,
			status: 'pending',
			userId: params.userId
		},
		select: {
			id: true
		}
	})

	const pathname = buildUploadPathname({
		fileName: params.fileName,
		typeKey: params.typeKey,
		uploadId: draft.id,
		userId: params.userId
	})

	return prisma.fileUpload.update({
		where: { id: draft.id },
		data: { pathname },
		select: {
			id: true,
			pathname: true
		}
	})
}

export async function finalizeUploadRecord(params: {
	blob: PutBlobResult
	contentType: string
	size: number
	uploadId: string
	userId: string
}) {
	const existingUpload = await prisma.fileUpload.findFirst({
		where: {
			id: params.uploadId,
			userId: params.userId
		},
		select: {
			id: true
		}
	})

	if (!existingUpload) {
		throw new Error('Archivo no encontrado.')
	}

	const upload = await prisma.fileUpload.update({
		where: {
			id: existingUpload.id
		},
		data: {
			blobUrl: params.blob.url,
			downloadUrl: params.blob.downloadUrl,
			pathname: params.blob.pathname,
			contentType: params.contentType,
			size: params.size,
			status: 'uploaded'
		},
		select: {
			id: true,
			originalName: true,
			pathname: true,
			blobUrl: true,
			downloadUrl: true,
			contentType: true,
			size: true,
			kind: true
		}
	})

	if (!upload.blobUrl) {
		throw new Error('No se ha podido finalizar la subida del archivo.')
	}

	return {
		...upload,
		blobUrl: upload.blobUrl,
		downloadUrl: upload.downloadUrl
	} satisfies FinalizedUpload
}

export async function finalizeClientUpload(params: {
	blob: PutBlobResult
	contentType: string
	size: number
	uploadId: string
	userId: string
}) {
	return finalizeUploadRecord(params)
}

export async function deleteUploadById(params: { uploadId: string; userId: string }) {
	const upload = await prisma.fileUpload.findFirst({
		where: {
			id: params.uploadId,
			userId: params.userId
		},
		select: {
			blobUrl: true,
			id: true,
			itemId: true
		}
	})

	if (!upload) {
		throw new Error('Archivo no encontrado.')
	}

	if (upload.itemId) {
		throw new Error('El archivo ya está asociado a un item.')
	}

	if (upload.blobUrl) {
		await del(upload.blobUrl)
	}

	await prisma.fileUpload.delete({
		where: { id: upload.id }
	})
}

export async function deleteUploadForItem(params: { itemId: string; userId: string }) {
	const upload = await prisma.fileUpload.findFirst({
		where: {
			itemId: params.itemId,
			userId: params.userId
		},
		select: {
			blobUrl: true,
			id: true
		}
	})

	if (!upload) {
		return
	}

	if (upload.blobUrl) {
		await del(upload.blobUrl)
	}

	await prisma.fileUpload.delete({
		where: { id: upload.id }
	})
}

export function resolveUploadIdFromCompletedPathname(pathname: string) {
	return getUploadIdFromPathname(pathname)
}
