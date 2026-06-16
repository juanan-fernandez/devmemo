import type { SystemItemTypeKey } from '@/lib/item-types'

export const ITEM_TYPES_WITH_CONTENT = new Set<SystemItemTypeKey>(['snippet', 'prompt', 'command', 'note'])
export const ITEM_TYPES_WITH_LANGUAGE = new Set<SystemItemTypeKey>(['snippet', 'command'])
export const ITEM_TYPES_WITH_URL = new Set<SystemItemTypeKey>(['url'])
export const ITEM_TYPES_WITH_FILE_UPLOAD = new Set<SystemItemTypeKey>(['file', 'image'])

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

export function supportsContent(typeKey: SystemItemTypeKey | null | undefined): boolean {
	return typeKey ? ITEM_TYPES_WITH_CONTENT.has(typeKey) : false
}

export function supportsLanguage(typeKey: SystemItemTypeKey | null | undefined): boolean {
	return typeKey ? ITEM_TYPES_WITH_LANGUAGE.has(typeKey) : false
}

export function supportsUrl(typeKey: SystemItemTypeKey | null | undefined): boolean {
	return typeKey ? ITEM_TYPES_WITH_URL.has(typeKey) : false
}

export function supportsFileUpload(typeKey: SystemItemTypeKey | null | undefined): boolean {
	return typeKey ? ITEM_TYPES_WITH_FILE_UPLOAD.has(typeKey) : false
}

export function normalizeNullableText(value: string | null | undefined): string | null {
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

export function isAllowedItemLanguage(value: string) {
	return EDITABLE_ITEM_LANGUAGE_VALUES.has(value)
}
