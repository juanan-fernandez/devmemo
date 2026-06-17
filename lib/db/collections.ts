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

export type SelectableCollection = {
	id: string
	name: string
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

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
	const [totalItems, totalCollections, favoriteItems, favoriteCollections] = await Promise.all([
		prisma.item.count({ where: { userId } }),
		prisma.collection.count({ where: { userId } }),
		prisma.item.count({ where: { userId, isFavorite: true } }),
		prisma.collection.count({ where: { userId, isFavorite: true } })
	])

	return { totalItems, totalCollections, favoriteItems, favoriteCollections }
}

export async function getSidebarCollections(userId: string): Promise<SidebarCollectionsData> {
	const [favoriteCollectionsCount, recentCollections] = await Promise.all([
		prisma.collection.count({ where: { userId, isFavorite: true } }),
		prisma.collection.findMany({
			where: { userId },
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

export async function getLatestCollections(userId: string): Promise<DashboardCollection[]> {
	const collections = await prisma.collection.findMany({
		where: { userId },
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

export async function getSelectableCollections(userId: string): Promise<SelectableCollection[]> {
	return prisma.collection.findMany({
		where: { userId },
		orderBy: { name: 'asc' },
		select: {
			id: true,
			name: true
		}
	})
}

export type CollectionForSelect = {
	id: string
	value: string
	label: string
}

export async function getCollectionsForUserSelect(userId: string): Promise<CollectionForSelect[]> {
	const collections = await prisma.collection.findMany({
		where: { userId },
		orderBy: { name: 'asc' },
		select: { id: true, name: true }
	})

	return collections.map(collection => ({
		id: collection.id,
		value: collection.id,
		label: collection.name
	}))
}

export type CollectionSort = 'createdAt-desc' | 'createdAt-asc' | 'name-asc' | 'name-desc'

export type PaginatedCollectionsResult = {
	collections: DashboardCollection[]
	nextCursor: string | null
}

function getPaginatedOrderBy(sort: CollectionSort) {
	switch (sort) {
		case 'createdAt-desc':
			return [{ createdAt: 'desc' as const }, { id: 'desc' as const }]
		case 'createdAt-asc':
			return [{ createdAt: 'asc' as const }, { id: 'asc' as const }]
		case 'name-asc':
			return [{ name: 'asc' as const }, { id: 'asc' as const }]
		case 'name-desc':
			return [{ name: 'desc' as const }, { id: 'desc' as const }]
	}
}

export async function getCollectionsPaginated(
	userId: string,
	sort: CollectionSort,
	cursor?: string | null,
	limit: number = 9
): Promise<PaginatedCollectionsResult> {
	const orderBy = getPaginatedOrderBy(sort)

	const collections = await prisma.collection.findMany({
		where: { userId },
		orderBy,
		take: limit + 1,
		...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
		include: {
			items: {
				include: {
					type: true
				}
			}
		}
	})

	const hasMore = collections.length > limit

	if (hasMore) {
		collections.pop()
	}

	const mappedCollections = collections.map(collection => {
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

	return {
		collections: mappedCollections,
		nextCursor: hasMore ? mappedCollections[mappedCollections.length - 1].id : null
	}
}

export async function getCollectionById(
	userId: string,
	collectionId: string
): Promise<DashboardCollection | null> {
	const collection = await prisma.collection.findFirst({
		where: { id: collectionId, userId },
		include: {
			items: {
				include: { type: true }
			}
		}
	})

	if (!collection) {
		return null
	}

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
}
