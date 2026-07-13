'use server'

import { auth } from '@/auth/auth'
import { deleteUploadById } from '@/lib/storage/file-uploads'
import { logServerError } from '@/lib/logger'

export type DeleteFileState = {
	successful: boolean
	error: string | null
	success?: string
}

export async function deleteFileAction(uploadId: string): Promise<DeleteFileState> {
	const session = await auth()

	if (!session?.user?.id) {
		return {
			successful: false,
			error: 'Debes iniciar sesión para eliminar archivos.'
		}
	}

	if (!uploadId) {
		return {
			successful: false,
			error: 'ID de archivo no válido.'
		}
	}

	try {
		await deleteUploadById({
			uploadId,
			userId: session.user.id
		})

		return {
			successful: true,
			error: null,
			success: 'Archivo eliminado correctamente.'
		}
	} catch (error) {
		logServerError('deleteFile', error)
		return {
			successful: false,
			error: 'No se ha podido eliminar el archivo.'
		}
	}
}
