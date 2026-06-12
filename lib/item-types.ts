import { mockItemTypes, type MockItemType } from '@/lib/mockdata'

type SystemItemTypeKey =
	| 'snippet'
	| 'prompt'
	| 'command'
	| 'note'
	| 'file'
	| 'image'
	| 'url'

type CanonicalSystemItemType = MockItemType & {
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
	definition: MockItemType,
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

const [snippets, prompts, commands, notes, files, images, links] = mockItemTypes

const CANONICAL_SYSTEM_ITEM_TYPES = [
	createCanonicalSystemItemType('snippet', snippets, 'Snippet', 'Snippet'),
	createCanonicalSystemItemType('prompt', prompts, 'Prompt', 'Prompt'),
	createCanonicalSystemItemType('command', commands, 'Command', 'Comando'),
	createCanonicalSystemItemType('note', notes, 'Note', 'Nota'),
	createCanonicalSystemItemType('file', files, 'File', 'Archivo'),
	createCanonicalSystemItemType('image', images, 'Image', 'Imagen'),
	createCanonicalSystemItemType('url', links, 'URL', 'Enlace')
] as const satisfies readonly CanonicalSystemItemType[]

const CANONICAL_ITEM_TYPES_BY_DB_NAME = new Map(
	CANONICAL_SYSTEM_ITEM_TYPES.map(itemType => [itemType.dbName, itemType])
)

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
