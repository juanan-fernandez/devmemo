'use server'

import { auth } from '@/auth/auth'
import { createUploadDraft } from '@/lib/storage/file-uploads'
import { isUploadItemTypeKey, type UploadItemTypeKey } from '@/lib/storage/file-validation'

export type CreateUploadDraftState = {
	successful: boolean
	error: string | null
	uploadId?: string
	pathname?: string
}

export async function createUploadDraftAction(
	typeKey: string,
	fileName: string,
	contentType: string,
	size: number
): Promise<CreateUploadDraftState> {
	const session = await auth()

	if (!session?.user?.id) {
		return {
			successful: false,
			error: 'Debes iniciar sesión para subir archivos.'
		}
	}

	if (!isUploadItemTypeKey(typeKey)) {
		return {
			successful: false,
			error: 'Selecciona un tipo de item válido.'
		}
	}

	try {
		const draft = await createUploadDraft({
			contentType,
			fileName,
			size,
			typeKey: typeKey as UploadItemTypeKey,
			userId: session.user.id,
			source: 'client'
		})

		return {
			successful: true,
			error: null,
			uploadId: draft.id,
			pathname: draft.pathname
		}
	} catch (error) {
		return {
			successful: false,
			error: error instanceof Error ? error.message : 'No se ha podido preparar la subida del archivo.'
		}
	}
}
