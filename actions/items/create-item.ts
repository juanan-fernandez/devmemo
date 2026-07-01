'use server'

import { revalidateItemPaths } from '@/lib/revalidation'

import { auth } from '@/auth/auth'
import { prisma } from '@/lib/db/prisma'
import { linkTagsToItem } from '@/lib/db/tags'
import {
	createItemInputSchema,
	getCreateItemCapabilities,
	mapCreateItemSchemaErrors,
	parseCreateItemTagsInput,
	type CreateItemField
} from '@/lib/items/create-item'
import { getCanonicalItemTypeByKey } from '@/lib/item-types'

export type CreateItemState = {
	success?: string
	error?: string | null
	successful?: boolean
	fieldErrors?: Partial<Record<CreateItemField, string>>
}

export async function createItem(
	_prevState: CreateItemState,
	formData: FormData
): Promise<CreateItemState> {
	void _prevState

	const session = await auth()

	if (!session?.user?.id) {
		return { error: 'Debes iniciar sesión para crear items.', successful: false }
	}

	const parsedInput = createItemInputSchema.safeParse({
		type: formData.get('type'),
		title: formData.get('title'),
		description: formData.get('description'),
		content: formData.get('content'),
		language: formData.get('language'),
		fileUploadId: formData.get('fileUploadId'),
		url: formData.get('url'),
		collectionId: formData.get('collectionId'),
		tags: parseCreateItemTagsInput(String(formData.get('tags') ?? ''))
	})

	if (!parsedInput.success) {
		return {
			error: 'Revisa los campos del formulario.',
			fieldErrors: mapCreateItemSchemaErrors(parsedInput.error),
			successful: false
		}
	}

	const { type, title, description, content, language, fileUploadId, url, collectionId, tags } = parsedInput.data
	const canonicalType = getCanonicalItemTypeByKey(type)

	const capabilities = getCreateItemCapabilities(type)

	if (!canonicalType) {
		return {
			error: 'No se ha podido crear el item.',
			fieldErrors: { type: 'Selecciona un tipo de item válido.' },
			successful: false
		}
	}

	const itemType = await prisma.itemType.findFirst({
		where: {
			name: canonicalType.dbName,
			OR: [{ isSystem: true }, { userId: session.user.id }]
		},
		select: {
			id: true
		}
	})

	if (!itemType) {
		return {
			error: 'No se ha podido crear el item.',
			successful: false
		}
	}

	if (collectionId) {
		const collection = await prisma.collection.findFirst({
			where: {
				id: collectionId,
				userId: session.user.id
			},
			select: {
				id: true
			}
		})

		if (!collection) {
			return {
				error: 'Revisa los campos del formulario.',
				fieldErrors: { collectionId: 'Selecciona una colección válida.' },
				successful: false
			}
		}
	}

	const upload = capabilities.canCreateFile && fileUploadId
		? await prisma.fileUpload.findFirst({
				where: {
					id: fileUploadId,
					itemId: null,
					status: 'uploaded',
					userId: session.user.id
				},
				select: {
					blobUrl: true,
					id: true,
					originalName: true,
					size: true
				}
			})
		: null

	if (capabilities.canCreateFile && !upload) {
		return {
			error: 'Revisa los campos del formulario.',
			fieldErrors: { fileUploadId: 'Debes subir un archivo válido antes de guardar.' },
			successful: false
		}
	}

	try {
		await prisma.$transaction(async tx => {
			const createdItem = await tx.item.create({
				data: {
					title,
					description,
					contentType: capabilities.canCreateFile ? 'file' : 'text',
					content: capabilities.canCreateContent ? content : null,
					fileName: upload?.originalName ?? null,
					fileSize: upload?.size ?? null,
					fileUrl: upload?.blobUrl ?? null,
					language: capabilities.canCreateLanguage ? language : null,
					url: capabilities.canCreateUrl ? url : null,
					collectionId,
					userId: session.user.id,
					typeId: itemType.id
				},
				select: {
					id: true
				}
			})

			if (upload) {
				await tx.fileUpload.update({
					where: { id: upload.id },
					data: {
						itemId: createdItem.id
					}
				})
			}

			await linkTagsToItem(tx, tags, createdItem.id, session.user.id)
		})
	} catch {
		return {
			error: 'No se ha podido crear el item.',
			successful: false
		}
	}

	revalidateItemPaths(canonicalType.href)

	return {
		success: 'Item creado correctamente.',
		error: null,
		successful: true,
		fieldErrors: {}
	}
}
