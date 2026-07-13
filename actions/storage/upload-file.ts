'use server'

import { auth } from '@/auth/auth'
import { uploadFileToBlob } from '@/lib/storage/file-uploads'
import {
	isUploadItemTypeKey,
	shouldUseClientUpload,
	type UploadItemTypeKey
} from '@/lib/storage/file-validation'
import { logServerError } from '@/lib/logger'

export type UploadFileState = {
	successful: boolean
	error: string | null
	upload?: {
		id: string
		url: string
		name: string
		size: number
		contentType: string
		pathname: string
	}
	strategy?: 'server' | 'client'
}

export async function uploadFileAction(formData: FormData): Promise<UploadFileState> {
	const session = await auth()

	if (!session?.user?.id) {
		return {
			successful: false,
			error: 'Debes iniciar sesión para subir archivos.'
		}
	}

	const type = formData.get('type')
	const file = formData.get('file')

	if (typeof type !== 'string' || !isUploadItemTypeKey(type)) {
		return {
			successful: false,
			error: 'Selecciona un tipo de item válido.'
		}
	}

	if (!(file instanceof File)) {
		return {
			successful: false,
			error: 'Selecciona un archivo antes de continuar.'
		}
	}

	if (shouldUseClientUpload(file.size)) {
		return {
			successful: false,
			error: 'Este archivo debe subirse directamente desde el navegador.',
			strategy: 'client'
		}
	}

	try {
		const upload = await uploadFileToBlob({
			file,
			typeKey: type as UploadItemTypeKey,
			userId: session.user.id,
			source: 'server'
		})

		return {
			successful: true,
			error: null,
			strategy: 'server',
			upload: {
				id: upload.id,
				url: upload.blobUrl,
				name: upload.originalName,
				size: upload.size,
				contentType: upload.contentType,
				pathname: upload.pathname
			}
		}
	} catch (error) {
		logServerError('uploadFile', error)
		return {
			successful: false,
			error: 'No se ha podido subir el archivo.',
			strategy: 'server'
		}
	}
}
