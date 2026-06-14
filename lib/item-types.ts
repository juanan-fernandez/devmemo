export type SystemItemTypeKey =
	| 'snippet'
	| 'prompt'
	| 'command'
	| 'note'
	| 'file'
	| 'image'
	| 'url'

export type CanonicalSystemItemType = {
	mockId: string
	name: string
	icon: string
	color: string
	isSystem: true
	userId: null
	key: SystemItemTypeKey
	dbName: string
	singularLabel: string
	href: string
}

type ItemTypeSource = {
	id: string
	name: string
	icon: string | null
	color: string | null
	isSystem: boolean
	userId: string | null
}

export type AppItemType = ItemTypeSource & {
	label: string
	href: string
}

export type SidebarAppItemType = AppItemType & {
	itemCount: number
}

function createCanonicalSystemItemType(
	key: SystemItemTypeKey,
	definition: Omit<CanonicalSystemItemType, 'key' | 'dbName' | 'singularLabel' | 'href'>,
	dbName: string,
	singularLabel: string
): CanonicalSystemItemType {
	return {
		...definition,
		key,
		dbName,
		singularLabel,
		href: getItemTypeHref(definition.name)
	}
}

export const CANONICAL_SYSTEM_ITEM_TYPES = [
	createCanonicalSystemItemType(
		'snippet',
		{
			mockId: 'type_snippets',
			name: 'Snippets',
			icon: 'code-2',
			color: '#84CC16',
			isSystem: true,
			userId: null
		},
		'Snippet',
		'Snippet'
	),
	createCanonicalSystemItemType(
		'prompt',
		{
			mockId: 'type_prompts',
			name: 'Prompts',
			icon: 'sparkles',
			color: '#8B5CF6',
			isSystem: true,
			userId: null
		},
		'Prompt',
		'Prompt'
	),
	createCanonicalSystemItemType(
		'command',
		{
			mockId: 'type_comandos',
			name: 'Comandos',
			icon: 'terminal-square',
			color: '#F97316',
			isSystem: true,
			userId: null
		},
		'Command',
		'Comando'
	),
	createCanonicalSystemItemType(
		'note',
		{
			mockId: 'type_notas',
			name: 'Notas',
			icon: 'notebook-pen',
			color: '#06B6D4',
			isSystem: true,
			userId: null
		},
		'Note',
		'Nota'
	),
	createCanonicalSystemItemType(
		'file',
		{
			mockId: 'type_archivos',
			name: 'Archivos',
			icon: 'file-text',
			color: '#F59E0B',
			isSystem: true,
			userId: null
		},
		'File',
		'Archivo'
	),
	createCanonicalSystemItemType(
		'image',
		{
			mockId: 'type_imagenes',
			name: 'Imágenes',
			icon: 'image',
			color: '#EC4899',
			isSystem: true,
			userId: null
		},
		'Image',
		'Imagen'
	),
	createCanonicalSystemItemType(
		'url',
		{
			mockId: 'type_enlaces',
			name: 'Enlaces',
			icon: 'link',
			color: '#3B82F6',
			isSystem: true,
			userId: null
		},
		'URL',
		'Enlace'
	)
] as const satisfies readonly CanonicalSystemItemType[]

const CANONICAL_ITEM_TYPES_BY_DB_NAME = new Map(
	CANONICAL_SYSTEM_ITEM_TYPES.map(itemType => [itemType.dbName, itemType])
)

const CANONICAL_ITEM_TYPES_BY_MOCK_ID = new Map(
	CANONICAL_SYSTEM_ITEM_TYPES.map(itemType => [itemType.mockId, itemType])
)

export const MOCK_ITEM_TYPES = CANONICAL_SYSTEM_ITEM_TYPES.map(itemType => ({
	id: itemType.mockId,
	name: itemType.name,
	icon: itemType.icon,
	color: itemType.color,
	isSystem: itemType.isSystem,
	userId: itemType.userId
}))

export function getItemTypeHref(name: string) {
	const slug = name
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')

	return `/items/${slug}`
}

export function getCanonicalItemType(name: string) {
	return CANONICAL_ITEM_TYPES_BY_DB_NAME.get(name) ?? null
}

export function getCanonicalItemTypeByMockId(mockId: string) {
	return CANONICAL_ITEM_TYPES_BY_MOCK_ID.get(mockId) ?? null
}

export function toAppItemType(source: ItemTypeSource): AppItemType {
	const canonical = getCanonicalItemType(source.name)

	if (!canonical) {
		return {
			...source,
			label: source.name,
			href: getItemTypeHref(source.name)
		}
	}

	return {
		id: source.id,
		name: canonical.name,
		icon: source.icon ?? canonical.icon,
		color: source.color ?? canonical.color,
		isSystem: source.isSystem,
		userId: source.userId,
		label: canonical.singularLabel,
		href: canonical.href
	}
}
