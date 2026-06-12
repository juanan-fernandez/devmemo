import { prisma } from '@/lib/db/prisma'
import { toAppItemType, type AppItemType } from '@/lib/item-types'

export type DashboardSummary = {
	totalItems: number
	totalCollections: number
	favoriteItems: number
	favoriteCollections: number
}

export type SidebarCollection = {
	id: string
	name: string
	predominantTypeColor: string | null
}

export type SidebarCollectionsData = {
	favoriteCollectionsCount: number
	recentCollections: SidebarCollection[]
}

export type DashboardCollection = {
	id: string
	name: string
	description: string | null
	isFavorite: boolean
	createdAt: Date
	itemCount: number
	predominantType: AppItemType | null
	typeIcons: AppItemType[]
}

type CollectionItemType = {
	id: string
	name: string
	icon: string | null
	color: string | null
	isSystem: boolean
	userId: string | null
}

function toCollectionAppItemType(type: CollectionItemType) {
	return toAppItemType({
		...type,
	})
}

function getPredominantType(items: { type: CollectionItemType }[]) {
	const typeCounts = new Map<
		string,
		{ count: number; type: CollectionItemType }
	>()

	for (const item of items) {
		const existing = typeCounts.get(item.type.id)
		if (existing) {
			existing.count++
		} else {
			typeCounts.set(item.type.id, { count: 1, type: item.type })
		}
	}

	let predominantType: CollectionItemType | null = null
	let maxCount = 0

	for (const [, entry] of typeCounts) {
		if (entry.count > maxCount) {
			maxCount = entry.count
			predominantType = entry.type
		}
	}

	return predominantType ? toCollectionAppItemType(predominantType) : null
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
	const [totalItems, totalCollections, favoriteItems, favoriteCollections] = await Promise.all([
		prisma.item.count(),
		prisma.collection.count(),
		prisma.item.count({ where: { isFavorite: true } }),
		prisma.collection.count({ where: { isFavorite: true } })
	])

	return { totalItems, totalCollections, favoriteItems, favoriteCollections }
}

export async function getSidebarCollections(): Promise<SidebarCollectionsData> {
	const [favoriteCollectionsCount, recentCollections] = await Promise.all([
		prisma.collection.count({ where: { isFavorite: true } }),
		prisma.collection.findMany({
			orderBy: { createdAt: 'desc' },
			take: 6,
			include: {
				items: {
					select: {
						type: true
					}
				}
			}
		})
	])

	return {
		favoriteCollectionsCount,
		recentCollections: recentCollections.map(collection => ({
			id: collection.id,
			name: collection.name,
			predominantTypeColor: getPredominantType(collection.items)?.color ?? null
		}))
	}
}

export async function getLatestCollections(): Promise<DashboardCollection[]> {
	const collections = await prisma.collection.findMany({
		orderBy: { createdAt: 'desc' },
		take: 6,
		include: {
			items: {
				include: {
					type: true
				}
			}
		}
	})

	return collections.map(collection => {
		const itemCount = collection.items.length

		const predominantType = getPredominantType(collection.items)

		const typeIcons: AppItemType[] = []
		const seenIds = new Set<string>()

		for (const item of collection.items) {
			if (!seenIds.has(item.type.id)) {
				seenIds.add(item.type.id)
				typeIcons.push(toCollectionAppItemType(item.type))
			}
		}

		return {
			id: collection.id,
			name: collection.name,
			description: collection.description,
			isFavorite: collection.isFavorite,
			createdAt: collection.createdAt,
			itemCount,
			predominantType,
			typeIcons
		}
	})
}
