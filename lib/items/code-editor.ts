import type { SystemItemTypeKey } from '@/lib/item-types'

const CODE_EDITOR_TYPE_KEYS = new Set<SystemItemTypeKey>(['snippet', 'command'])

const MONACO_LANGUAGE_MAP: Record<string, string> = {
	'plain text': 'plaintext',
	plaintext: 'plaintext',
	'texto plano': 'plaintext',
	typescript: 'typescript',
	tsx: 'typescript',
	javascript: 'javascript',
	jsx: 'javascript',
	bash: 'shell',
	shell: 'shell',
	sh: 'shell',
	python: 'python',
	sql: 'sql',
	json: 'json',
	html: 'html',
	css: 'css',
	markdown: 'markdown'
}

export function supportsCodeEditor(typeKey: SystemItemTypeKey | null | undefined) {
	return typeKey ? CODE_EDITOR_TYPE_KEYS.has(typeKey) : false
}

export function getMonacoLanguage(language?: string | null) {
	if (!language) {
		return 'plaintext'
	}

	const normalizedLanguage = language.trim().toLowerCase()

	if (!normalizedLanguage) {
		return 'plaintext'
	}

	return MONACO_LANGUAGE_MAP[normalizedLanguage] ?? 'plaintext'
}
