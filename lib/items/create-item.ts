import { z } from 'zod'

import {
	EDITABLE_ITEM_LANGUAGE_OPTIONS,
	isAllowedItemLanguage,
	normalizeNullableText,
	normalizeTags,
	supportsContent,
	supportsFileUpload,
	supportsLanguage,
	supportsUrl
} from '@/lib/items/shared'
import type { EditableItemField } from '@/lib/items/editable-item'
import type { CanonicalSystemItemType, SystemItemTypeKey } from '@/lib/item-types'

const CREATE_ITEM_TYPE_VALUES = ['snippet', 'prompt', 'command', 'note', 'file', 'image', 'url'] as const satisfies readonly SystemItemTypeKey[]

const optionalTextSchema = z
	.union([z.string(), z.null(), z.undefined()])
	.transform(value => normalizeNullableText(value))

const optionalCollectionIdSchema = z
	.union([z.string(), z.null(), z.undefined()])
	.transform(value => {
		const normalizedValue = normalizeNullableText(value)
		return normalizedValue === 'none' ? null : normalizedValue
	})

const optionalFileUploadIdSchema = z
	.union([z.string(), z.null(), z.undefined()])
	.optional()
	.transform(value => normalizeNullableText(value))

export type CreateItemField = EditableItemField | 'type' | 'collectionId' | 'fileUploadId'

export const createItemInputSchema = z
	.object({
		type: z.enum(CREATE_ITEM_TYPE_VALUES, {
			message: 'Selecciona un tipo de item válido.'
		}),
		title: z.string().trim().min(1, { message: 'El título es obligatorio.' }),
		description: optionalTextSchema,
		content: optionalTextSchema,
		language: optionalTextSchema,
		fileUploadId: optionalFileUploadIdSchema,
		url: optionalTextSchema,
		collectionId: optionalCollectionIdSchema,
		tags: z.array(z.string()).default([]).transform(values => normalizeTags(values))
	})
	.superRefine((value, ctx) => {
		if (supportsContent(value.type)) {
			return
		}

		if (value.content) {
			ctx.addIssue({
				code: 'custom',
				path: ['content'],
				message: 'El contenido no aplica a este tipo de item.'
			})
		}
	})
	.superRefine((value, ctx) => {
		if (supportsLanguage(value.type)) {
			if (value.language && !isAllowedItemLanguage(value.language)) {
				ctx.addIssue({
					code: 'custom',
					path: ['language'],
					message: 'Selecciona un lenguaje válido.'
				})
			}

			return
		}

		if (value.language) {
			ctx.addIssue({
				code: 'custom',
				path: ['language'],
				message: 'El lenguaje no aplica a este tipo de item.'
			})
		}
	})
	.superRefine((value, ctx) => {
		if (supportsUrl(value.type)) {
			if (!value.url) {
				ctx.addIssue({
					code: 'custom',
					path: ['url'],
					message: 'La URL es obligatoria.'
				})
				return
			}

			const urlValidation = z.string().url({ message: 'La URL no es válida.' }).safeParse(value.url)

			if (!urlValidation.success) {
				ctx.addIssue({
					code: 'custom',
					path: ['url'],
					message: 'La URL no es válida.'
				})
			}

			return
		}

		if (value.url) {
			ctx.addIssue({
				code: 'custom',
				path: ['url'],
				message: 'La URL no aplica a este tipo de item.'
			})
		}
	})
	.superRefine((value, ctx) => {
		if (supportsFileUpload(value.type)) {
			if (!value.fileUploadId) {
				ctx.addIssue({
					code: 'custom',
					path: ['fileUploadId'],
					message: 'Debes subir un archivo antes de guardar.'
				})
			}

			return
		}

		if (value.fileUploadId) {
			ctx.addIssue({
				code: 'custom',
				path: ['fileUploadId'],
				message: 'El archivo no aplica a este tipo de item.'
			})
		}
	})

export type CreateItemInput = z.infer<typeof createItemInputSchema>

export const CREATE_ITEM_LANGUAGE_OPTIONS = EDITABLE_ITEM_LANGUAGE_OPTIONS

export function parseCreateItemTagsInput(value: string) {
	return normalizeTags(value.split(','))
}

export function getCreateItemCapabilities(typeKey: SystemItemTypeKey) {
	return {
		canCreateContent: supportsContent(typeKey),
		canCreateFile: supportsFileUpload(typeKey),
		canCreateLanguage: supportsLanguage(typeKey),
		canCreateUrl: supportsUrl(typeKey)
	}
}

export function mapCreateItemSchemaErrors(error: z.ZodError<CreateItemInput>): Partial<Record<CreateItemField, string>> {
	const fieldErrors = error.flatten().fieldErrors

	return {
		type: fieldErrors.type?.[0],
		title: fieldErrors.title?.[0],
		description: fieldErrors.description?.[0],
		content: fieldErrors.content?.[0],
		language: fieldErrors.language?.[0],
		fileUploadId: fieldErrors.fileUploadId?.[0],
		url: fieldErrors.url?.[0],
		collectionId: fieldErrors.collectionId?.[0],
		tags: fieldErrors.tags?.[0]
	}
}

export function getCreateLabel(canonicalType: CanonicalSystemItemType) {
	return `Nuev${canonicalType.gender === 'feminine' ? 'a' : 'o'} ${canonicalType.singularLabel}`
}
