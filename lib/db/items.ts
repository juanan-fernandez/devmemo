import { prisma } from '@/lib/db/prisma'

export type DashboardItem = {
	id: string
	title: string
	description: string | null
	isFavorite: boolean
	isPinned: boolean
	language: string | null
	createdAt: Date
	type: {
		id: string
		name: string
		label: string
		icon: string | null
		color: string | null
	}
}

export type DashboardItemsSection = {
	title: 'EN TU TABLERO' | 'ÚLTIMOS ITEMS'
	items: DashboardItem[]
	mode: 'pinned' | 'recent'
}

export type SidebarItemType = {
	id: string
	name: string
	label: string
	icon: string | null
	color: string | null
	itemCount: number
	isSystem: boolean
	href: string
}

const ITEM_TYPE_LABELS: Record<string, string> = {
	Snippet: 'Snippet',
	Prompt: 'Prompt',
	Note: 'Nota',
	Command: 'Comando',
	File: 'Archivo',
	Image: 'Imagen',
	URL: 'Enlace'
}

const SIDEBAR_ITEM_TYPE_LABELS: Record<string, string> = {
	Snippet: 'Snippets',
	Prompt: 'Prompts',
	Note: 'Notas',
	Command: 'Comandos',
	File: 'Archivos',
	Image: 'Imágenes',
	URL: 'Enlaces'
}

function getItemTypeHref(name: string) {
	const slug = name
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')

	return `/items/${slug}`
}

function mapDashboardItem(item: {
	id: string
	title: string
	description: string | null
	isFavorite: boolean
	isPinned: boolean
	language: string | null
	createdAt: Date
	type: { id: string; name: string; icon: string | null; color: string | null }
}): DashboardItem {
	return {
		id: item.id,
		title: item.title,
		description: item.description,
		isFavorite: item.isFavorite,
		isPinned: item.isPinned,
		language: item.language,
		createdAt: item.createdAt,
		type: {
			id: item.type.id,
			name: item.type.name,
			label: ITEM_TYPE_LABELS[item.type.name] ?? item.type.name,
			icon: item.type.icon,
			color: item.type.color
		}
	}
}

export async function getSidebarItemTypes(): Promise<SidebarItemType[]> {
	const itemTypes = await prisma.itemType.findMany({
		orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
		include: {
			_count: {
				select: {
					items: true
				}
			}
		}
	})

	return itemTypes.map(type => ({
		id: type.id,
		name: type.name,
		label: SIDEBAR_ITEM_TYPE_LABELS[type.name] ?? type.name,
		icon: type.icon,
		color: type.color,
		itemCount: type._count.items,
		isSystem: type.isSystem,
		href: getItemTypeHref(type.name)
	}))
}

export async function getDashboardItemsSection(): Promise<DashboardItemsSection> {
	const pinnedItems = await prisma.item.findMany({
		where: { isPinned: true },
		orderBy: { createdAt: 'desc' },
		include: { type: true }
	})

	if (pinnedItems.length > 0) {
		return {
			title: 'EN TU TABLERO',
			mode: 'pinned',
			items: pinnedItems.map(mapDashboardItem)
		}
	}

	const recentItems = await prisma.item.findMany({
		orderBy: { createdAt: 'desc' },
		take: 6,
		include: { type: true }
	})

	return {
		title: 'ÚLTIMOS ITEMS',
		mode: 'recent',
		items: recentItems.map(mapDashboardItem)
	}
}
