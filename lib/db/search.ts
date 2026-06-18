import { prisma } from '@/lib/db/prisma'
import { toAppItemType, type AppItemType } from '@/lib/item-types'

export type SearchableItem = {
	id: string
	title: string
	description: string | null
	type: AppItemType
	tags: string[]
	createdAt: Date
}

export type SearchableCollection = {
	id: string
	name: string
	itemCount: number
	createdAt: Date
}

export type SearchIndex = {
	items: SearchableItem[]
	collections: SearchableCollection[]
}

export async function getSearchIndex(userId: string): Promise<SearchIndex> {
	const [rawItems, rawCollections] = await Promise.all([
		prisma.item.findMany({
			where: { userId },
			select: {
				id: true,
				title: true,
				description: true,
				createdAt: true,
				type: {
					select: {
						id: true,
						name: true,
						icon: true,
						color: true,
						isSystem: true,
						userId: true
					}
				},
				tags: {
					select: {
						tag: {
							select: { name: true }
						}
					}
				}
			},
			orderBy: { createdAt: 'desc' }
		}),
		prisma.collection.findMany({
			where: { userId },
			select: {
				id: true,
				name: true,
				createdAt: true,
				_count: {
					select: { items: true }
				}
			},
			orderBy: { createdAt: 'desc' }
		})
	])

	const items: SearchableItem[] = rawItems.map(item => ({
		id: item.id,
		title: item.title,
		description: item.description,
		type: toAppItemType(item.type),
		tags: item.tags.map(t => t.tag.name),
		createdAt: item.createdAt
	}))

	const collections: SearchableCollection[] = rawCollections.map(col => ({
		id: col.id,
		name: col.name,
		itemCount: col._count.items,
		createdAt: col.createdAt
	}))

	return { items, collections }
}
