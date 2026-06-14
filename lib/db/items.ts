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

export type ItemDetail = DashboardItem & {
	contentType: string
	content: string | null
	fileUrl: string | null
	fileName: string | null
	fileSize: number | null
	url: string | null
	collection: {
		id: string
		name: string
	} | null
	tags: {
		id: string
		name: string
	}[]
	updatedAt: Date
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

function mapItemDetail(item: {
	id: string
	title: string
	description: string | null
	isFavorite: boolean
	isPinned: boolean
	language: string | null
	createdAt: Date
	updatedAt: Date
	contentType: string
	content: string | null
	fileUrl: string | null
	fileName: string | null
	fileSize: number | null
	url: string | null
	type: {
		id: string
		name: string
		icon: string | null
		color: string | null
		isSystem: boolean
		userId: string | null
	}
	collection: {
		id: string
		name: string
	} | null
	tags: {
		tag: {
			id: string
			name: string
		}
	}[]
}): ItemDetail {
	return {
		...mapDashboardItem(item),
		updatedAt: item.updatedAt,
		contentType: item.contentType,
		content: item.content,
		fileUrl: item.fileUrl,
		fileName: item.fileName,
		fileSize: item.fileSize,
		url: item.url,
		collection: item.collection,
		tags: item.tags.map(itemTag => itemTag.tag)
	}
}

export async function getSidebarItemTypes(userId: string): Promise<SidebarItemType[]> {
	const itemTypes = await prisma.itemType.findMany({
		orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
		where: {
			OR: [{ isSystem: true }, { userId }]
		},
		include: {
			_count: {
				select: {
					items: {
						where: { userId }
					}
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

export type ItemsByTypePage = {
	items: DashboardItem[]
	totalCount: number
}

export async function getItemsByTypeName(
	userId: string,
	typeName: string
): Promise<ItemsByTypePage> {
	const [items, totalCount] = await Promise.all([
		prisma.item.findMany({
			where: { userId, type: { name: typeName } },
			orderBy: { createdAt: 'desc' },
			include: { type: true }
		}),
		prisma.item.count({
			where: { userId, type: { name: typeName } }
		})
	])

	return {
		items: items.map(mapDashboardItem),
		totalCount
	}
}

export async function getItemDetailById(userId: string, itemId: string): Promise<ItemDetail | null> {
	const item = await prisma.item.findFirst({
		where: {
			id: itemId,
			userId
		},
		include: {
			type: true,
			collection: {
				select: {
					id: true,
					name: true
				}
			},
			tags: {
				include: {
					tag: {
						select: {
							id: true,
							name: true
						}
					}
				}
			}
		}
	})

	return item ? mapItemDetail(item) : null
}

export async function getDashboardItemsSection(userId: string): Promise<DashboardItemsSection> {
	const pinnedItems = await prisma.item.findMany({
		where: { userId, isPinned: true },
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
		where: { userId },
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
