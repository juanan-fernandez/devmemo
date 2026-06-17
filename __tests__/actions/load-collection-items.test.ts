import { beforeEach, describe, expect, it, vi } from 'vitest'

import { loadCollectionItemsAction } from '@/actions/collections/load-collection-items'

const { authMock, getCollectionItemsPaginatedMock } = vi.hoisted(() => ({
	authMock: vi.fn(),
	getCollectionItemsPaginatedMock: vi.fn()
}))

vi.mock('@/auth/auth', () => ({
	auth: authMock
}))

vi.mock('@/lib/db/items', () => ({
	getCollectionItemsPaginated: getCollectionItemsPaginatedMock
}))

describe('loadCollectionItemsAction', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('returns empty result when user is not authenticated', async () => {
		authMock.mockResolvedValue(null)

		const result = await loadCollectionItemsAction('col_1')

		expect(result).toEqual({ items: [], nextCursor: null, totalCount: 0, filteredCount: 0 })
		expect(getCollectionItemsPaginatedMock).not.toHaveBeenCalled()
	})

	it('returns empty result when session has no user id', async () => {
		authMock.mockResolvedValue({ user: {} })

		const result = await loadCollectionItemsAction('col_1')

		expect(result).toEqual({ items: [], nextCursor: null, totalCount: 0, filteredCount: 0 })
	})

	it('delegates to getCollectionItemsPaginated with session user id', async () => {
		authMock.mockResolvedValue({ user: { id: 'user_123' } })
		getCollectionItemsPaginatedMock.mockResolvedValue({
			items: [{ id: 'item_1', title: 'Test' }],
			nextCursor: 'item_1',
			totalCount: 5,
			filteredCount: 5
		})

		const result = await loadCollectionItemsAction('col_1', null, null)

		expect(getCollectionItemsPaginatedMock).toHaveBeenCalledWith('user_123', 'col_1', null, null)
		expect(result.items).toHaveLength(1)
		expect(result.totalCount).toBe(5)
	})

	it('passes itemType and cursor through', async () => {
		authMock.mockResolvedValue({ user: { id: 'user_123' } })
		getCollectionItemsPaginatedMock.mockResolvedValue({
			items: [],
			nextCursor: null,
			totalCount: 0,
			filteredCount: 0
		})

		await loadCollectionItemsAction('col_1', 'Snippet', 'item_99')

		expect(getCollectionItemsPaginatedMock).toHaveBeenCalledWith('user_123', 'col_1', 'Snippet', 'item_99')
	})
})
