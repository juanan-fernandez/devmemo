import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getItemsPaginated } from '@/lib/db/items'

const { findManyMock } = vi.hoisted(() => ({
	findManyMock: vi.fn()
}))

vi.mock('@/lib/db/prisma', () => ({
	prisma: {
		item: {
			findMany: findManyMock
		}
	}
}))

function makeItemType(overrides: Partial<{ id: string; name: string; icon: string; color: string }> = {}) {
	return {
		id: overrides.id ?? 'type_snippets',
		name: overrides.name ?? 'Snippet',
		icon: overrides.icon ?? 'code-2',
		color: overrides.color ?? '#84CC16',
		isSystem: true,
		userId: null
	}
}

function makeItem(overrides: Partial<{ id: string; title: string; description: string | null; isFavorite: boolean; isPinned: boolean; language: string | null; createdAt: string }> = {}) {
	return {
		id: overrides.id ?? 'item_1',
		title: overrides.title ?? 'Test Item',
		description: overrides.description ?? null,
		isFavorite: overrides.isFavorite ?? false,
		isPinned: overrides.isPinned ?? false,
		language: overrides.language ?? null,
		createdAt: new Date(overrides.createdAt ?? '2026-06-01T00:00:00Z'),
		type: makeItemType()
	}
}

function makeItemRows(count: number) {
	return Array.from({ length: count }, (_, i) =>
		makeItem({
			id: `item_${i + 1}`,
			title: `Item ${i + 1}`,
			createdAt: new Date(Date.UTC(2026, 0, count - i)).toISOString()
		})
	)
}

describe('getItemsPaginated', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('returns the first page with default sort (createdAt-desc) and no cursor', async () => {
		const rows = makeItemRows(10)
		findManyMock.mockResolvedValue(rows)

		const result = await getItemsPaginated('user_1', 'createdAt-desc')

		expect(findManyMock).toHaveBeenCalledWith({
			where: { userId: 'user_1' },
			orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
			take: 10,
			include: { type: true }
		})

		expect(result.items).toHaveLength(9)
		expect(result.nextCursor).toBe('item_9')
	})

	it('returns first page with title-asc sort', async () => {
		const rows = makeItemRows(3)
		findManyMock.mockResolvedValue(rows)

		await getItemsPaginated('user_1', 'title-asc')

		expect(findManyMock).toHaveBeenCalledWith({
			where: { userId: 'user_1' },
			orderBy: [{ title: 'asc' }, { id: 'asc' }],
			take: 10,
			include: { type: true }
		})
	})

	it('returns first page with createdAt-asc sort', async () => {
		const rows = makeItemRows(3)
		findManyMock.mockResolvedValue(rows)

		await getItemsPaginated('user_1', 'createdAt-asc')

		expect(findManyMock).toHaveBeenCalledWith({
			where: { userId: 'user_1' },
			orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
			take: 10,
			include: { type: true }
		})
	})

	it('returns first page with title-desc sort', async () => {
		const rows = makeItemRows(3)
		findManyMock.mockResolvedValue(rows)

		await getItemsPaginated('user_1', 'title-desc')

		expect(findManyMock).toHaveBeenCalledWith({
			where: { userId: 'user_1' },
			orderBy: [{ title: 'desc' }, { id: 'desc' }],
			take: 10,
			include: { type: true }
		})
	})

	it('uses cursor + skip:1 for subsequent pages', async () => {
		const rows = makeItemRows(10)
		findManyMock.mockResolvedValue(rows)

		await getItemsPaginated('user_1', 'createdAt-desc', 'item_9')

		expect(findManyMock).toHaveBeenCalledWith({
			where: { userId: 'user_1' },
			orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
			take: 10,
			cursor: { id: 'item_9' },
			skip: 1,
			include: { type: true }
		})
	})

	it('sets nextCursor to null when there are no more pages', async () => {
		const rows = makeItemRows(5)
		findManyMock.mockResolvedValue(rows)

		const result = await getItemsPaginated('user_1', 'createdAt-desc')

		expect(result.items).toHaveLength(5)
		expect(result.nextCursor).toBeNull()
	})

	it('respects a custom limit', async () => {
		const rows = makeItemRows(6)
		findManyMock.mockResolvedValue(rows)

		const result = await getItemsPaginated('user_1', 'createdAt-desc', null, 5)

		expect(result.items).toHaveLength(5)
		expect(result.nextCursor).toBe('item_5')
		expect(findManyMock).toHaveBeenCalledWith(expect.objectContaining({ take: 6 }))
	})

	it('maps items to DashboardItem shape', async () => {
		const rows = makeItemRows(1)
		findManyMock.mockResolvedValue(rows)

		const result = await getItemsPaginated('user_1', 'createdAt-desc')

		const item = result.items[0]
		expect(item).toHaveProperty('id', 'item_1')
		expect(item).toHaveProperty('title', 'Item 1')
		expect(item).toHaveProperty('description')
		expect(item).toHaveProperty('isFavorite', false)
		expect(item).toHaveProperty('isPinned', false)
		expect(item).toHaveProperty('createdAt')
		expect(item).toHaveProperty('type')
	})
})
