import { beforeEach, describe, expect, it, vi } from 'vitest'

import { loadMoreCollectionsAction } from '@/actions/collections/load-more-collections'

const { authMock, getCollectionsPaginatedMock } = vi.hoisted(() => ({
	authMock: vi.fn(),
	getCollectionsPaginatedMock: vi.fn()
}))

vi.mock('@/auth/auth', () => ({
	auth: authMock
}))

vi.mock('@/lib/db/collections', () => ({
	getCollectionsPaginated: getCollectionsPaginatedMock
}))

describe('loadMoreCollectionsAction', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('returns empty result when user is not authenticated', async () => {
		authMock.mockResolvedValue(null)

		const result = await loadMoreCollectionsAction('createdAt-desc')

		expect(result).toEqual({ collections: [], nextCursor: null })
		expect(getCollectionsPaginatedMock).not.toHaveBeenCalled()
	})

	it('returns empty result when session has no user id', async () => {
		authMock.mockResolvedValue({ user: {} })

		const result = await loadMoreCollectionsAction('createdAt-desc')

		expect(result).toEqual({ collections: [], nextCursor: null })
	})

	it('delegates to getCollectionsPaginated with session user id, sort, and cursor', async () => {
		authMock.mockResolvedValue({ user: { id: 'user_123' } })
		getCollectionsPaginatedMock.mockResolvedValue({
			collections: [{ id: 'col_1', name: 'Test', description: null, isFavorite: false, createdAt: new Date(), itemCount: 1, predominantType: null, typeIcons: [] }],
			nextCursor: 'col_1'
		})

		const result = await loadMoreCollectionsAction('name-asc', 'col_5')

		expect(getCollectionsPaginatedMock).toHaveBeenCalledWith('user_123', 'name-asc', 'col_5', 9, undefined)
		expect(result.collections).toHaveLength(1)
		expect(result.nextCursor).toBe('col_1')
	})

	it('passes null cursor by default', async () => {
		authMock.mockResolvedValue({ user: { id: 'user_123' } })
		getCollectionsPaginatedMock.mockResolvedValue({ collections: [], nextCursor: null })

		await loadMoreCollectionsAction('createdAt-desc')

		expect(getCollectionsPaginatedMock).toHaveBeenCalledWith('user_123', 'createdAt-desc', undefined, 9, undefined)
	})
})
