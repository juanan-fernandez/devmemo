'use server'

import { revalidateCollectionPaths } from '@/lib/revalidation'
import { z } from 'zod'

import { auth } from '@/auth/auth'
import { prisma } from '@/lib/db/prisma'
import { logServerError } from '@/lib/logger'

const updateCollectionSchema = z.object({
	collectionId: z.string().trim().min(1),
	name: z.string().trim().min(1, 'El nombre de la colección es obligatorio.'),
	description: z
		.string()
		.trim()
		.transform(value => (value === '' ? null : value))
		.nullable()
		.optional()
})

export type UpdateCollectionField = 'name' | 'description'

export type UpdateCollectionState = {
	success?: string
	error?: string | null
	successful?: boolean
	fieldErrors?: Partial<Record<UpdateCollectionField, string>>
}

export async function updateCollection(
	_prevState: UpdateCollectionState,
	formData: FormData
): Promise<UpdateCollectionState> {
	void _prevState

	const session = await auth()

	if (!session?.user?.id) {
		return { error: 'Debes iniciar sesión para editar colecciones.', successful: false }
	}

	const parsedInput = updateCollectionSchema.safeParse({
		collectionId: formData.get('collectionId'),
		name: formData.get('name'),
		description: formData.get('description')
	})

	if (!parsedInput.success) {
		const fieldErrors: Partial<Record<UpdateCollectionField, string>> = {}

		for (const issue of parsedInput.error.issues) {
			const field = issue.path[0]

			if (field === 'name' || field === 'description') {
				fieldErrors[field] = issue.message
			}
		}

		return {
			error: 'Revisa los campos del formulario.',
			fieldErrors,
			successful: false
		}
	}

	const { collectionId, name, description } = parsedInput.data

	const collection = await prisma.collection.findFirst({
		where: { id: collectionId, userId: session.user.id },
		select: { id: true }
	})

	if (!collection) {
		return { error: 'Colección no encontrada.', successful: false }
	}

	try {
		await prisma.collection.update({
			where: { id: collectionId },
			data: { name, description }
		})
	} catch (error) {
		logServerError('updateCollection', error)
		return {
			error: 'No se ha podido actualizar la colección.',
			successful: false
		}
	}

	revalidateCollectionPaths()

	return {
		success: 'Colección actualizada correctamente.',
		error: null,
		successful: true,
		fieldErrors: {}
	}
}
