import { beforeEach, describe, expect, it, vi } from 'vitest'

import { toggleCollectionFavoriteAction } from '@/actions/collections/toggle-collection-favorite'

const { authMock, collectionFindFirstMock, collectionUpdateMock, revalidatePathMock } = vi.hoisted(() => ({
	authMock: vi.fn(),
	collectionFindFirstMock: vi.fn(),
	collectionUpdateMock: vi.fn(),
	revalidatePathMock: vi.fn()
}))

vi.mock('@/auth/auth', () => ({ auth: authMock }))
vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }))

vi.mock('@/lib/db/prisma', () => ({
	prisma: {
		collection: {
			findFirst: collectionFindFirstMock,
			update: collectionUpdateMock
		}
	}
}))

describe('toggleCollectionFavoriteAction', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		authMock.mockResolvedValue({ user: { id: 'user_1' } })
	})

	it('returns error when not authenticated', async () => {
		authMock.mockResolvedValue(null)
		const result = await toggleCollectionFavoriteAction('col_1')
		expect(result).toEqual({ error: 'Debes iniciar sesión.' })
	})

	it('returns error when collection not found or wrong owner', async () => {
		collectionFindFirstMock.mockResolvedValue(null)
		const result = await toggleCollectionFavoriteAction('col_999')
		expect(result).toEqual({ error: 'Colección no encontrada.' })
	})

	it('toggles favorite from false to true', async () => {
		collectionFindFirstMock.mockResolvedValue({ isFavorite: false })
		const result = await toggleCollectionFavoriteAction('col_1')
		expect(collectionUpdateMock).toHaveBeenCalledWith({
			where: { id: 'col_1' },
			data: { isFavorite: true }
		})
		expect(result).toEqual({ isFavorite: true })
	})

	it('toggles favorite from true to false', async () => {
		collectionFindFirstMock.mockResolvedValue({ isFavorite: true })
		const result = await toggleCollectionFavoriteAction('col_1')
		expect(collectionUpdateMock).toHaveBeenCalledWith({
			where: { id: 'col_1' },
			data: { isFavorite: false }
		})
		expect(result).toEqual({ isFavorite: false })
	})
})
