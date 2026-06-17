'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { auth } from '@/auth/auth'
import { prisma } from '@/lib/db/prisma'
import {
	getEditableItemCapabilities,
	isAllowedItemLanguage,
	type EditableItemField,
	type UpdateItemInput,
	updateItemInputSchema
} from '@/lib/items/editable-item'
import { getCanonicalItemType } from '@/lib/item-types'

type UpdateItemState = {
	success?: string
	error?: string | null
	successful?: boolean
	fieldErrors?: Partial<Record<EditableItemField, string>>
}

function mapSchemaErrors(error: z.ZodError<UpdateItemInput>): Partial<Record<EditableItemField, string>> {
	const fieldErrors = error.flatten().fieldErrors

	return {
		title: fieldErrors.title?.[0],
		description: fieldErrors.description?.[0],
		content: fieldErrors.content?.[0],
		url: fieldErrors.url?.[0],
		language: fieldErrors.language?.[0],
		tags: fieldErrors.tags?.[0],
		collectionId: fieldErrors.collectionId?.[0]
	}
}

export async function updateItemAction(input: UpdateItemInput): Promise<UpdateItemState> {
	const session = await auth()

	if (!session?.user?.id) {
		return { error: 'Debes iniciar sesión para editar items.' }
	}

	const parsedInput = updateItemInputSchema.safeParse(input)

	if (!parsedInput.success) {
		return {
			error: 'Revisa los campos del formulario.',
			fieldErrors: mapSchemaErrors(parsedInput.error),
			successful: false
		}
	}

	const { itemId, title, description, content, language, tags, url, collectionId } = parsedInput.data

	const item = await prisma.item.findUnique({
		where: { id: itemId },
		select: {
			userId: true,
			type: {
				select: {
					name: true
				}
			}
		}
	})

	if (!item) {
		return { error: 'Item no encontrado.' }
	}

	if (item.userId !== session.user.id) {
		return { error: 'No tienes permiso para modificar este item.' }
	}

	const typeKey = getCanonicalItemType(item.type.name)?.key ?? null
	const capabilities = getEditableItemCapabilities(typeKey)
	const fieldErrors: Partial<Record<EditableItemField, string>> = {}

	if (capabilities.canEditUrl && url) {
		const urlValidation = z.string().url({ message: 'La URL no es válida.' }).safeParse(url)

		if (!urlValidation.success) {
			fieldErrors.url = 'La URL no es válida.'
		}
	}

	if (capabilities.canEditLanguage && language && !isAllowedItemLanguage(language)) {
		fieldErrors.language = 'Selecciona un lenguaje válido.'
	}

	if (collectionId) {
		const collection = await prisma.collection.findFirst({
			where: { id: collectionId, userId: session.user.id },
			select: { id: true }
		})

		if (!collection) {
			fieldErrors.collectionId = 'La colección seleccionada no es válida.'
		}
	}

	if (Object.keys(fieldErrors).length > 0) {
		return {
			error: 'Revisa los campos del formulario.',
			fieldErrors,
			successful: false
		}
	}

	try {
		await prisma.$transaction(async tx => {
			await tx.item.update({
				where: { id: itemId },
				data: {
					title,
					description,
					...(capabilities.canEditContent ? { content } : {}),
					...(capabilities.canEditLanguage ? { language } : {}),
					...(capabilities.canEditUrl ? { url } : {}),
					collectionId
				}
			})

			await tx.itemTag.deleteMany({
				where: { itemId }
			})

			if (tags.length === 0) {
				return
			}

			const persistedTags = await Promise.all(
				tags.map(tagName =>
					tx.tag.upsert({
						where: {
							name_userId: {
								name: tagName,
								userId: session.user.id
							}
						},
						update: {},
						create: {
							name: tagName,
							userId: session.user.id
						},
						select: {
							id: true
						}
					})
				)
			)

			await tx.itemTag.createMany({
				data: persistedTags.map(tag => ({ itemId, tagId: tag.id })),
				skipDuplicates: true
			})
		})
	} catch {
		return {
			error: 'No se han podido guardar los cambios.',
			successful: false
		}
	}

	revalidatePath('/dashboard')
	revalidatePath('/profile')
	revalidatePath('/items', 'layout')

	return {
		success: 'Cambios guardados correctamente.',
		error: null,
		successful: true,
		fieldErrors: {}
	}
}
