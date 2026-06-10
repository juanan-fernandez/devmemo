import { prisma } from '@/lib/db/prisma'

export type DashboardSummary = {
	totalItems: number
	totalCollections: number
	favoriteItems: number
	favoriteCollections: number
}

export type DashboardCollection = {
	id: string
	name: string
	description: string | null
	isFavorite: boolean
	createdAt: Date
	itemCount: number
	predominantType: { id: string; name: string; icon: string | null; color: string | null } | null
	typeIcons: { icon: string | null; color: string | null; name: string }[]
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

		const typeCounts = new Map<
			string,
			{ count: number; type: { id: string; name: string; icon: string | null; color: string | null } }
		>()

		for (const item of collection.items) {
			const existing = typeCounts.get(item.type.id)
			if (existing) {
				existing.count++
			} else {
				typeCounts.set(item.type.id, { count: 1, type: item.type })
			}
		}

		let predominantType: { id: string; name: string; icon: string | null; color: string | null } | null = null
		let maxCount = 0

		for (const [, entry] of typeCounts) {
			if (entry.count > maxCount) {
				maxCount = entry.count
				predominantType = entry.type
			}
		}

		const typeIcons: { icon: string | null; color: string | null; name: string }[] = []
		const seenIds = new Set<string>()

		for (const item of collection.items) {
			if (!seenIds.has(item.type.id)) {
				seenIds.add(item.type.id)
				typeIcons.push({ icon: item.type.icon, color: item.type.color, name: item.type.name })
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
