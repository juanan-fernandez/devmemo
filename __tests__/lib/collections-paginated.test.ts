import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getCollectionsPaginated } from '@/lib/db/collections'

const { findManyMock } = vi.hoisted(() => ({
	findManyMock: vi.fn()
}))

vi.mock('@/lib/db/prisma', () => ({
	prisma: {
		collection: {
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

function makeCollectionItem(overrides: Partial<{ id: string; name: string; description: string | null; isFavorite: boolean; createdAt: string; itemCount: number }> & { typeIndex?: number } = {}) {
	const type = makeItemType(
		(overrides as Record<string, unknown>).typeIndex === 1
			? { id: 'type_commands', name: 'Command', icon: 'terminal-square', color: '#F97316' }
			: undefined
	)

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { typeIndex, ...rest } = overrides as Record<string, unknown>

	return {
		id: (rest.id as string) ?? 'col_1',
		name: (rest.name as string) ?? 'Test Collection',
		description: (rest.description as string | null) ?? null,
		isFavorite: (rest.isFavorite as boolean) ?? false,
		createdAt: new Date((rest.createdAt as string) ?? '2026-06-01T00:00:00Z'),
		items: [{ type }]
	}
}

function makeCollectionRows(count: number) {
	return Array.from({ length: count }, (_, i) =>
		makeCollectionItem({
			id: `col_${i + 1}`,
			name: `Collection ${i + 1}`,
			createdAt: new Date(Date.UTC(2026, 0, count - i)).toISOString(),
			typeIndex: i % 2
		})
	)
}

describe('getCollectionsPaginated', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('returns the first page with default sort (createdAt-desc) and no cursor', async () => {
		const rows = makeCollectionRows(10)
		findManyMock.mockResolvedValue(rows)

		const result = await getCollectionsPaginated('user_1', 'createdAt-desc')

		expect(findManyMock).toHaveBeenCalledWith({
			where: { userId: 'user_1' },
			orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
			take: 10,
			include: {
				items: {
					include: { type: true }
				}
			}
		})

		expect(result.collections).toHaveLength(9)
		expect(result.nextCursor).toBe('col_9')
	})

	it('returns first page with name-asc sort', async () => {
		const rows = makeCollectionRows(3)
		findManyMock.mockResolvedValue(rows)

		await getCollectionsPaginated('user_1', 'name-asc')

		expect(findManyMock).toHaveBeenCalledWith({
			where: { userId: 'user_1' },
			orderBy: [{ name: 'asc' }, { id: 'asc' }],
			take: 10,
			include: {
				items: {
					include: { type: true }
				}
			}
		})
	})

	it('returns first page with createdAt-asc sort', async () => {
		const rows = makeCollectionRows(3)
		findManyMock.mockResolvedValue(rows)

		await getCollectionsPaginated('user_1', 'createdAt-asc')

		expect(findManyMock).toHaveBeenCalledWith({
			where: { userId: 'user_1' },
			orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
			take: 10,
			include: {
				items: {
					include: { type: true }
				}
			}
		})
	})

	it('returns first page with name-desc sort', async () => {
		const rows = makeCollectionRows(3)
		findManyMock.mockResolvedValue(rows)

		await getCollectionsPaginated('user_1', 'name-desc')

		expect(findManyMock).toHaveBeenCalledWith({
			where: { userId: 'user_1' },
			orderBy: [{ name: 'desc' }, { id: 'desc' }],
			take: 10,
			include: {
				items: {
					include: { type: true }
				}
			}
		})
	})

	it('uses cursor + skip:1 for subsequent pages', async () => {
		const rows = makeCollectionRows(10)
		findManyMock.mockResolvedValue(rows)

		await getCollectionsPaginated('user_1', 'createdAt-desc', 'col_9')

		expect(findManyMock).toHaveBeenCalledWith({
			where: { userId: 'user_1' },
			orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
			take: 10,
			cursor: { id: 'col_9' },
			skip: 1,
			include: {
				items: {
					include: { type: true }
				}
			}
		})
	})

	it('sets nextCursor to null when there are no more pages', async () => {
		const rows = makeCollectionRows(5)
		findManyMock.mockResolvedValue(rows)

		const result = await getCollectionsPaginated('user_1', 'createdAt-desc')

		expect(result.collections).toHaveLength(5)
		expect(result.nextCursor).toBeNull()
	})

	it('respects a custom limit', async () => {
		const rows = makeCollectionRows(6)
		findManyMock.mockResolvedValue(rows)

		const result = await getCollectionsPaginated('user_1', 'createdAt-desc', null, 5)

		expect(result.collections).toHaveLength(5)
		expect(result.nextCursor).toBe('col_5')
		expect(findManyMock).toHaveBeenCalledWith(expect.objectContaining({ take: 6 }))
	})

	it('maps collections to DashboardCollection shape', async () => {
		const rows = makeCollectionRows(1)
		findManyMock.mockResolvedValue(rows)

		const result = await getCollectionsPaginated('user_1', 'createdAt-desc')

		const collection = result.collections[0]
		expect(collection).toHaveProperty('id', 'col_1')
		expect(collection).toHaveProperty('name', 'Collection 1')
		expect(collection).toHaveProperty('description')
		expect(collection).toHaveProperty('isFavorite', false)
		expect(collection).toHaveProperty('createdAt')
		expect(collection).toHaveProperty('itemCount', 1)
		expect(collection).toHaveProperty('predominantType')
		expect(collection).toHaveProperty('typeIcons')
	})
})
