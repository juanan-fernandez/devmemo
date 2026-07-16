import { beforeEach, describe, expect, it, vi } from 'vitest'

import { loadMoreItemsAction } from '@/actions/items/load-more-items'

const { authMock, getItemsPaginatedMock } = vi.hoisted(() => ({
	authMock: vi.fn(),
	getItemsPaginatedMock: vi.fn()
}))

vi.mock('@/auth/auth', () => ({
	auth: authMock
}))

vi.mock('@/lib/db/items', () => ({
	getItemsPaginated: getItemsPaginatedMock
}))

describe('loadMoreItemsAction', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('returns empty result when user is not authenticated', async () => {
		authMock.mockResolvedValue(null)

		const result = await loadMoreItemsAction('createdAt-desc')

		expect(result).toEqual({ items: [], nextCursor: null })
		expect(getItemsPaginatedMock).not.toHaveBeenCalled()
	})

	it('returns empty result when session has no user id', async () => {
		authMock.mockResolvedValue({ user: {} })

		const result = await loadMoreItemsAction('createdAt-desc')

		expect(result).toEqual({ items: [], nextCursor: null })
	})

	it('delegates to getItemsPaginated with session user id, sort, and cursor', async () => {
		authMock.mockResolvedValue({ user: { id: 'user_123' } })
		getItemsPaginatedMock.mockResolvedValue({
			items: [
				{
					id: 'item_1',
					title: 'Test',
					description: null,
					isFavorite: false,
					isPinned: false,
					language: null,
					createdAt: new Date(),
					type: {
						id: 'type_1',
						name: 'Snippets',
						icon: 'code-2',
						color: '#84CC16',
						isSystem: true,
						userId: null,
						label: 'Snippet',
						href: '/items/snippets'
					}
				}
			],
			nextCursor: 'item_1'
		})

		const result = await loadMoreItemsAction('title-asc', 'item_5')

		expect(getItemsPaginatedMock).toHaveBeenCalledWith('user_123', 'title-asc', 'item_5', 9, undefined)
		expect(result.items).toHaveLength(1)
		expect(result.nextCursor).toBe('item_1')
	})

	it('passes favoritesOnly to the paginated query when requested', async () => {
		authMock.mockResolvedValue({ user: { id: 'user_123' } })
		getItemsPaginatedMock.mockResolvedValue({ items: [], nextCursor: null })

		await loadMoreItemsAction('createdAt-desc', 'item_5', true)

		expect(getItemsPaginatedMock).toHaveBeenCalledWith('user_123', 'createdAt-desc', 'item_5', 9, true)
	})

	it('passes null cursor by default', async () => {
		authMock.mockResolvedValue({ user: { id: 'user_123' } })
		getItemsPaginatedMock.mockResolvedValue({ items: [], nextCursor: null })

		await loadMoreItemsAction('createdAt-desc')

		expect(getItemsPaginatedMock).toHaveBeenCalledWith('user_123', 'createdAt-desc', undefined, 9, undefined)
	})
})
