import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getSearchIndex } from '@/lib/db/search'

const { itemFindManyMock, collectionFindManyMock } = vi.hoisted(() => ({
	itemFindManyMock: vi.fn(),
	collectionFindManyMock: vi.fn()
}))

vi.mock('@/lib/db/prisma', () => ({
	prisma: {
		item: {
			findMany: itemFindManyMock
		},
		collection: {
			findMany: collectionFindManyMock
		}
	}
}))

function makeRawItem(overrides: Partial<{
	id: string
	title: string
	description: string | null
	createdAt: Date
	typeName: string
	typeIcon: string
	typeColor: string
	tags: string[]
}> = {}) {
	return {
		id: overrides.id ?? 'item_1',
		title: overrides.title ?? 'Test Item',
		description: overrides.description ?? null,
		createdAt: overrides.createdAt ?? new Date('2026-06-01T00:00:00Z'),
		type: {
			id: 'type_snippets',
			name: overrides.typeName ?? 'Snippet',
			icon: overrides.typeIcon ?? 'code-2',
			color: overrides.typeColor ?? '#84CC16',
			isSystem: true,
			userId: null
		},
		tags: (overrides.tags ?? []).map(name => ({ tag: { name } }))
	}
}

function makeRawCollection(overrides: Partial<{
	id: string
	name: string
	createdAt: Date
	itemCount: number
}> = {}) {
	return {
		id: overrides.id ?? 'col_1',
		name: overrides.name ?? 'Test Collection',
		createdAt: overrides.createdAt ?? new Date('2026-06-01T00:00:00Z'),
		_count: { items: overrides.itemCount ?? 5 }
	}
}

describe('getSearchIndex', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('returns empty index when user has no items or collections', async () => {
		itemFindManyMock.mockResolvedValue([])
		collectionFindManyMock.mockResolvedValue([])

		const result = await getSearchIndex('user_1')

		expect(result.items).toEqual([])
		expect(result.collections).toEqual([])
	})

	it('maps items to SearchableItem shape with tags and type info', async () => {
		itemFindManyMock.mockResolvedValue([
			makeRawItem({
				id: 'item_1',
				title: 'My Snippet',
				description: 'A handy snippet',
				typeName: 'Snippet',
				typeIcon: 'code-2',
				typeColor: '#84CC16',
				tags: ['react', 'typescript']
			})
		])
		collectionFindManyMock.mockResolvedValue([])

		const result = await getSearchIndex('user_1')

		expect(result.items).toHaveLength(1)
		const item = result.items[0]
		expect(item.id).toBe('item_1')
		expect(item.title).toBe('My Snippet')
		expect(item.description).toBe('A handy snippet')
		expect(item.tags).toEqual(['react', 'typescript'])
		expect(item.type.name).toBe('Snippets')
		expect(item.type.color).toBe('#84CC16')
		expect(item.type.icon).toBe('code-2')
	})

	it('maps items with null description to null without crashing', async () => {
		itemFindManyMock.mockResolvedValue([
			makeRawItem({ id: 'item_1', description: null, tags: [] })
		])
		collectionFindManyMock.mockResolvedValue([])

		const result = await getSearchIndex('user_1')

		expect(result.items[0].description).toBeNull()
	})

	it('maps collections to SearchableCollection shape with item count', async () => {
		itemFindManyMock.mockResolvedValue([])
		collectionFindManyMock.mockResolvedValue([
			makeRawCollection({ id: 'col_1', name: 'Work Notes', itemCount: 12 })
		])

		const result = await getSearchIndex('user_1')

		expect(result.collections).toHaveLength(1)
		const collection = result.collections[0]
		expect(collection.id).toBe('col_1')
		expect(collection.name).toBe('Work Notes')
		expect(collection.itemCount).toBe(12)
	})

	it('filters items and collections by userId', async () => {
		itemFindManyMock.mockResolvedValue([])
		collectionFindManyMock.mockResolvedValue([])

		await getSearchIndex('user_42')

		expect(itemFindManyMock).toHaveBeenCalledWith(
			expect.objectContaining({ where: { userId: 'user_42' } })
		)
		expect(collectionFindManyMock).toHaveBeenCalledWith(
			expect.objectContaining({ where: { userId: 'user_42' } })
		)
	})

	it('returns items ordered by createdAt desc', async () => {
		const older = makeRawItem({ id: 'item_old', createdAt: new Date('2026-01-01') })
		const newer = makeRawItem({ id: 'item_new', createdAt: new Date('2026-06-15') })
		itemFindManyMock.mockResolvedValue([newer, older])
		collectionFindManyMock.mockResolvedValue([])

		const result = await getSearchIndex('user_1')

		expect(result.items[0].id).toBe('item_new')
		expect(result.items[1].id).toBe('item_old')
	})

	it('returns both items and collections in a single call', async () => {
		itemFindManyMock.mockResolvedValue([
			makeRawItem({ id: 'item_1', title: 'Snippet 1', tags: [] })
		])
		collectionFindManyMock.mockResolvedValue([
			makeRawCollection({ id: 'col_1', name: 'Collection 1', itemCount: 3 }),
			makeRawCollection({ id: 'col_2', name: 'Collection 2', itemCount: 7 })
		])

		const result = await getSearchIndex('user_1')

		expect(result.items).toHaveLength(1)
		expect(result.collections).toHaveLength(2)
	})
})
