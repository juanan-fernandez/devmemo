import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'

import { auth } from '@/auth/auth'
import { prisma } from '@/lib/db/prisma'
import { createUploadDraft, finalizeClientUpload } from '@/lib/storage/file-uploads'
import {
	getFileValidationConfig,
	isUploadItemTypeKey,
	validateFileUploadSelection
} from '@/lib/storage/file-validation'

type ClientPayload = {
	contentType: string
	fileName: string
	size: number
	type: string
	uploadId?: string
}

export async function POST(request: Request) {
	const session = await auth()

	if (!session?.user?.id) {
		return NextResponse.json({ error: 'Debes iniciar sesión.' }, { status: 401 })
	}

	const body = (await request.json()) as HandleUploadBody

	try {
		const jsonResponse = await handleUpload({
			body,
			request,
			onBeforeGenerateToken: async (_pathname, clientPayload) => {
				const payload = parseClientPayload(clientPayload)

				if (!payload || !isUploadItemTypeKey(payload.type)) {
					throw new Error('Tipo de archivo no válido.')
				}

				const validation = validateFileUploadSelection({
					name: payload.fileName,
					size: payload.size,
					type: payload.contentType,
					typeKey: payload.type
				})

				if (!validation.success) {
					throw new Error(validation.error)
				}

				let uploadId: string

				if (payload.uploadId) {
					// Draft was pre-created by client — validate it exists and belongs to user
					const existing = await prisma.fileUpload.findFirst({
						where: {
							id: payload.uploadId,
							userId: session.user.id,
							status: 'pending'
						},
						select: { id: true }
					})

					if (!existing) {
						throw new Error('Archivo no encontrado o ya procesado.')
					}

					uploadId = existing.id
				} else {
					// No pre-created draft — create one (backward compat)
					const draft = await createUploadDraft({
						contentType: payload.contentType,
						fileName: payload.fileName,
						size: payload.size,
						typeKey: payload.type,
						userId: session.user.id,
						source: 'client'
					})

					uploadId = draft.id
				}

				const config = getFileValidationConfig(payload.type)

				return {
					addRandomSuffix: true,
					allowedContentTypes: [...config.allowedContentTypes],
					maximumSizeInBytes: 10 * 1024 * 1024,
					tokenPayload: JSON.stringify({
						contentType: payload.contentType,
						size: payload.size,
						uploadId,
						userId: session.user.id
					})
				}
			},
			onUploadCompleted: async ({ blob, tokenPayload }) => {
				const payload = parseTokenPayload(tokenPayload)

				if (!payload) {
					throw new Error('No se ha podido finalizar la subida.')
				}

				await finalizeClientUpload({
					blob,
					contentType: payload.contentType,
					size: payload.size,
					uploadId: payload.uploadId,
					userId: payload.userId
				})
			}
		})

		return NextResponse.json(jsonResponse)
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'No se ha podido subir el archivo.' },
			{ status: 400 }
		)
	}
}

function parseClientPayload(clientPayload: string | null): ClientPayload | null {
	if (!clientPayload) {
		return null
	}

	try {
		const parsedPayload = JSON.parse(clientPayload) as ClientPayload
		return parsedPayload
	} catch {
		return null
	}
}

function parseTokenPayload(tokenPayload: string | null | undefined) {
	if (!tokenPayload) {
		return null
	}

	try {
		const parsedPayload = JSON.parse(tokenPayload) as {
			contentType: string
			size: number
			uploadId: string
			userId: string
		}

		if (!parsedPayload.uploadId || !parsedPayload.contentType || typeof parsedPayload.size !== 'number') {
			return null
		}

		return parsedPayload
	} catch {
		return null
	}
}
