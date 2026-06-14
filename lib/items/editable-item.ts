import { z } from 'zod'

import type { SystemItemTypeKey } from '@/lib/item-types'

export type EditableItemField = 'title' | 'description' | 'tags' | 'content' | 'language' | 'url'

export const EDITABLE_ITEM_LANGUAGE_OPTIONS = [
	{ value: 'Texto plano', label: 'Texto plano' },
	{ value: 'TypeScript', label: 'TypeScript' },
	{ value: 'JavaScript', label: 'JavaScript' },
	{ value: 'Bash', label: 'Bash' },
	{ value: 'SQL', label: 'SQL' },
	{ value: 'JSON', label: 'JSON' },
	{ value: 'Markdown', label: 'Markdown' },
	{ value: 'Python', label: 'Python' }
] as const

const EDITABLE_ITEM_LANGUAGE_VALUES = new Set<string>(EDITABLE_ITEM_LANGUAGE_OPTIONS.map(option => option.value))

const CONTENT_EDITABLE_TYPE_KEYS = new Set<SystemItemTypeKey>(['snippet', 'prompt', 'command', 'note'])
const LANGUAGE_EDITABLE_TYPE_KEYS = new Set<SystemItemTypeKey>(['snippet', 'command'])
const URL_EDITABLE_TYPE_KEYS = new Set<SystemItemTypeKey>(['url'])

const optionalTextSchema = z
	.union([z.string(), z.null(), z.undefined()])
	.transform(value => normalizeOptionalText(value))

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

export function normalizeOptionalText(value: string | null | undefined) {
	if (typeof value !== 'string') {
		return null
	}

	const trimmedValue = value.trim()
	return trimmedValue.length > 0 ? trimmedValue : null
}

export function normalizeTags(values: string[]) {
	const seenTags = new Set<string>()

	return values.reduce<string[]>((tags, value) => {
		const trimmedValue = value.trim()

		if (!trimmedValue || seenTags.has(trimmedValue)) {
			return tags
		}

		seenTags.add(trimmedValue)
		tags.push(trimmedValue)
		return tags
	}, [])
}

export function parseTagsInput(value: string) {
	return normalizeTags(value.split(','))
}

export function getEditableItemCapabilities(typeKey: SystemItemTypeKey | null) {
	return {
		canEditContent: typeKey ? CONTENT_EDITABLE_TYPE_KEYS.has(typeKey) : false,
		canEditLanguage: typeKey ? LANGUAGE_EDITABLE_TYPE_KEYS.has(typeKey) : false,
		canEditUrl: typeKey ? URL_EDITABLE_TYPE_KEYS.has(typeKey) : false
	}
}

export function isAllowedItemLanguage(value: string) {
	return EDITABLE_ITEM_LANGUAGE_VALUES.has(value)
}
