import { z } from 'zod'

import {
	EDITABLE_ITEM_LANGUAGE_OPTIONS,
	isAllowedItemLanguage,
	normalizeNullableText,
	normalizeTags,
	supportsContent,
	supportsLanguage,
	supportsUrl
} from '@/lib/items/shared'
import type { SystemItemTypeKey } from '@/lib/item-types'

export type EditableItemField = 'title' | 'description' | 'tags' | 'content' | 'language' | 'url'

export { EDITABLE_ITEM_LANGUAGE_OPTIONS, isAllowedItemLanguage }

const optionalTextSchema = z
	.union([z.string(), z.null(), z.undefined()])
	.transform(value => normalizeNullableText(value))

export const updateItemInputSchema = z.object({
	itemId: z.string().trim().min(1, { message: 'ID de item no válido.' }),
	title: z.string().trim().min(1, { message: 'El título es obligatorio.' }),
	description: optionalTextSchema,
	content: optionalTextSchema,
	url: optionalTextSchema,
	language: optionalTextSchema,
	tags: z.array(z.string()).default([]).transform(values => normalizeTags(values))
})

export type UpdateItemInput = z.infer<typeof updateItemInputSchema>

export function parseTagsInput(value: string) {
	return normalizeTags(value.split(','))
}

export function getEditableItemCapabilities(typeKey: SystemItemTypeKey | null) {
	return {
		canEditContent: supportsContent(typeKey),
		canEditLanguage: supportsLanguage(typeKey),
		canEditUrl: supportsUrl(typeKey)
	}
}
