import { prisma } from '@/lib/db/prisma'
import { toAppItemType, type AppItemType, type SidebarAppItemType } from '@/lib/item-types'

export type DashboardItem = {
	id: string
	title: string
	description: string | null
	isFavorite: boolean
	isPinned: boolean
	language: string | null
	createdAt: Date
	type: AppItemType
}

export type DashboardItemsSection = {
	title: 'EN TU TABLERO' | 'ÚLTIMOS ITEMS'
	items: DashboardItem[]
	mode: 'pinned' | 'recent'
}

export type SidebarItemType = SidebarAppItemType

function mapDashboardItem(item: {
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
		icon: string | null
		color: string | null
		isSystem: boolean
		userId: string | null
	}
}): DashboardItem {
	return {
		id: item.id,
		title: item.title,
		description: item.description,
		isFavorite: item.isFavorite,
		isPinned: item.isPinned,
		language: item.language,
		createdAt: item.createdAt,
			type: toAppItemType({
			id: item.type.id,
			name: item.type.name,
			icon: item.type.icon,
			color: item.type.color,
			isSystem: item.type.isSystem,
			userId: item.type.userId
		})
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
		...toAppItemType({
			id: type.id,
			name: type.name,
			icon: type.icon,
			color: type.color,
			isSystem: type.isSystem,
			userId: type.userId
		}),
		itemCount: type._count.items,
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
