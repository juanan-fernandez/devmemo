import { beforeEach, describe, expect, it, vi } from 'vitest'

import { deleteCollectionAction } from '@/actions/collections/delete-collection'

const { authMock, collectionFindFirstMock, itemUpdateManyMock, collectionDeleteMock, transactionMock, revalidatePathMock } =
	vi.hoisted(() => ({
		authMock: vi.fn(),
		collectionFindFirstMock: vi.fn(),
		itemUpdateManyMock: vi.fn(),
		collectionDeleteMock: vi.fn(),
		transactionMock: vi.fn(),
		revalidatePathMock: vi.fn()
	}))

vi.mock('@/auth/auth', () => ({ auth: authMock }))
vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }))

vi.mock('@/lib/db/prisma', () => ({
	prisma: {
		collection: {
			findFirst: collectionFindFirstMock,
			delete: collectionDeleteMock
		},
		item: {
			updateMany: itemUpdateManyMock
		},
		$transaction: transactionMock
	}
}))

describe('deleteCollectionAction', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		authMock.mockResolvedValue({ user: { id: 'user_1' } })
		transactionMock.mockImplementation(async (cb: (tx: unknown) => Promise<unknown>) =>
			cb({
				item: { updateMany: itemUpdateManyMock },
				collection: { delete: collectionDeleteMock }
			})
		)
	})

	it('returns error when not authenticated', async () => {
		authMock.mockResolvedValue(null)
		const result = await deleteCollectionAction('col_1')
		expect(result).toEqual({ error: 'Debes iniciar sesión.' })
	})

	it('returns error when collection not found or wrong owner', async () => {
		collectionFindFirstMock.mockResolvedValue(null)
		const result = await deleteCollectionAction('col_999')
		expect(result).toEqual({ error: 'Colección no encontrada.' })
	})

	it('nulls out collectionId on items and deletes collection in a transaction', async () => {
		collectionFindFirstMock.mockResolvedValue({ id: 'col_1' })

		const result = await deleteCollectionAction('col_1')

		expect(itemUpdateManyMock).toHaveBeenCalledWith({
			where: { collectionId: 'col_1' },
			data: { collectionId: null }
		})
		expect(collectionDeleteMock).toHaveBeenCalledWith({
			where: { id: 'col_1' }
		})
		expect(revalidatePathMock).toHaveBeenCalledWith('/dashboard')
		expect(revalidatePathMock).toHaveBeenCalledWith('/collections')
		expect(result).toEqual({ success: true })
	})
})
