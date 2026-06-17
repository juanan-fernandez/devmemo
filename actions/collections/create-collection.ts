'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { auth } from '@/auth/auth'
import { prisma } from '@/lib/db/prisma'

const createCollectionSchema = z.object({
	name: z.string().trim().min(1, 'El nombre de la colección es obligatorio.'),
	description: z
		.string()
		.trim()
		.transform(value => (value === '' ? null : value))
		.nullable()
		.optional()
})

export type CreateCollectionField = 'name' | 'description'

export type CreateCollectionState = {
	success?: string
	error?: string | null
	successful?: boolean
	fieldErrors?: Partial<Record<CreateCollectionField, string>>
}

export async function createCollection(
	_prevState: CreateCollectionState,
	formData: FormData
): Promise<CreateCollectionState> {
	void _prevState

	const session = await auth()

	if (!session?.user?.id) {
		return { error: 'Debes iniciar sesión para crear colecciones.', successful: false }
	}

	const parsedInput = createCollectionSchema.safeParse({
		name: formData.get('name'),
		description: formData.get('description')
	})

	if (!parsedInput.success) {
		const fieldErrors: Partial<Record<CreateCollectionField, string>> = {}

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

	const { name, description } = parsedInput.data

	try {
		await prisma.collection.create({
			data: {
				name,
				description,
				userId: session.user.id
			}
		})
	} catch {
		return {
			error: 'No se ha podido crear la colección.',
			successful: false
		}
	}

	revalidatePath('/dashboard')
	revalidatePath('/collections')

	return {
		success: 'Colección creada correctamente.',
		error: null,
		successful: true,
		fieldErrors: {}
	}
}
