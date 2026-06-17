import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getCollectionItemsPaginated } from '@/lib/db/items'

const { findManyMock, countMock } = vi.hoisted(() => ({
	findManyMock: vi.fn(),
	countMock: vi.fn()
}))

vi.mock('@/lib/db/prisma', () => ({
	prisma: {
		item: {
			findMany: findManyMock,
			count: countMock
		}
	}
}))

function makeItem(overrides: Partial<{ id: string; title: string; createdAt: string }> = {}) {
	return {
		id: overrides.id ?? 'item_1',
		title: overrides.title ?? 'Test Item',
		description: null,
		isFavorite: false,
		isPinned: false,
		language: null,
		createdAt: new Date(overrides.createdAt ?? '2026-01-01T00:00:00Z'),
		type: {
			id: 'type_snippets',
			name: 'Snippet',
			icon: 'code-2',
			color: '#84CC16',
			isSystem: true,
			userId: null
		}
	}
}

function makeItems(count: number) {
	return Array.from({ length: count }, (_, i) =>
		makeItem({ id: `item_${i + 1}`, title: `Item ${i + 1}` })
	)
}

describe('getCollectionItemsPaginated', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		countMock.mockResolvedValue(10)
	})

	it('returns first page with no cursor and no type filter', async () => {
		const rows = makeItems(13)
		findManyMock.mockResolvedValue(rows)

		const result = await getCollectionItemsPaginated('user_1', 'col_1')

		expect(findManyMock).toHaveBeenCalledWith({
			where: { userId: 'user_1', collectionId: 'col_1' },
			orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
			take: 13,
			include: { type: true }
		})
		expect(result.items).toHaveLength(12)
		expect(result.nextCursor).toBe('item_12')
		expect(result.totalCount).toBe(10)
		expect(result.filteredCount).toBe(10)
	})

	it('returns empty when there are no items', async () => {
		findManyMock.mockResolvedValue([])
		countMock.mockResolvedValue(0)

		const result = await getCollectionItemsPaginated('user_1', 'col_1')

		expect(result.items).toHaveLength(0)
		expect(result.nextCursor).toBeNull()
		expect(result.totalCount).toBe(0)
	})

	it('filters by item type using dbName', async () => {
		const rows = makeItems(5)
		findManyMock.mockResolvedValue(rows)
		countMock.mockResolvedValueOnce(10).mockResolvedValueOnce(5)

		const result = await getCollectionItemsPaginated('user_1', 'col_1', 'Snippet')

		expect(findManyMock).toHaveBeenCalledWith({
			where: { userId: 'user_1', collectionId: 'col_1', type: { name: 'Snippet' } },
			orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
			take: 13,
			include: { type: true }
		})
		expect(result.filteredCount).toBe(5)
	})

	it('uses cursor and skip for pagination', async () => {
		const rows = makeItems(13)
		findManyMock.mockResolvedValue(rows)

		await getCollectionItemsPaginated('user_1', 'col_1', null, 'item_12')

		expect(findManyMock).toHaveBeenCalledWith({
			where: { userId: 'user_1', collectionId: 'col_1' },
			orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
			take: 13,
			cursor: { id: 'item_12' },
			skip: 1,
			include: { type: true }
		})
	})

	it('detects end of pages when items fit in one page', async () => {
		const rows = makeItems(5)
		findManyMock.mockResolvedValue(rows)

		const result = await getCollectionItemsPaginated('user_1', 'col_1')

		expect(result.items).toHaveLength(5)
		expect(result.nextCursor).toBeNull()
	})
})
