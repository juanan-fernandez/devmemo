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

const ITEM_TYPE_LABELS: Record<string, string> = {
	Snippet: 'Snippet',
	Prompt: 'Prompt',
	Note: 'Nota',
	Command: 'Comando',
	File: 'Archivo',
	Image: 'Imagen',
	URL: 'Enlace'
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
