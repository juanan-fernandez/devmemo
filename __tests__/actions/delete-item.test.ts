import { beforeEach, describe, expect, it, vi } from 'vitest'

import { deleteItemAction } from '@/actions/items/delete-item'

const { authMock, itemFindUniqueMock, itemDeleteMock, deleteUploadForItemMock, revalidatePathMock } =
	vi.hoisted(() => ({
		authMock: vi.fn(),
		itemFindUniqueMock: vi.fn(),
		itemDeleteMock: vi.fn(),
		deleteUploadForItemMock: vi.fn(),
		revalidatePathMock: vi.fn()
	}))

vi.mock('@/auth/auth', () => ({ auth: authMock }))
vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }))

vi.mock('@/lib/db/prisma', () => ({
	prisma: {
		item: {
			findUnique: itemFindUniqueMock,
			delete: itemDeleteMock
		}
	}
}))

vi.mock('@/lib/storage/file-uploads', () => ({
	deleteUploadForItem: deleteUploadForItemMock
}))

describe('deleteItemAction', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		authMock.mockResolvedValue({ user: { id: 'user_1' } })
		itemFindUniqueMock.mockResolvedValue({ userId: 'user_1' })
		itemDeleteMock.mockResolvedValue({})
	})

	it('returns auth error when not signed in', async () => {
		authMock.mockResolvedValue(null)
		const result = await deleteItemAction('item_1', {})
		expect(result).toEqual({ error: 'Debes iniciar sesión para eliminar items.' })
		expect(itemFindUniqueMock).not.toHaveBeenCalled()
	})

	it('returns error for empty item ID', async () => {
		const result = await deleteItemAction('', {})
		expect(result).toEqual({ error: 'ID de item no válido.' })
		expect(itemFindUniqueMock).not.toHaveBeenCalled()
	})

	it('returns error when item not found', async () => {
		itemFindUniqueMock.mockResolvedValue(null)
		const result = await deleteItemAction('item_999', {})
		expect(result).toEqual({ error: 'Item no encontrado.' })
		expect(itemDeleteMock).not.toHaveBeenCalled()
	})

	it('returns error when item belongs to another user', async () => {
		itemFindUniqueMock.mockResolvedValue({ userId: 'user_other' })
		const result = await deleteItemAction('item_1', {})
		expect(result).toEqual({ error: 'No tienes permiso para eliminar este item.' })
		expect(itemDeleteMock).not.toHaveBeenCalled()
	})

	it('deletes associated upload, deletes item, and revalidates paths', async () => {
		const result = await deleteItemAction('item_1', {})

		expect(itemFindUniqueMock).toHaveBeenCalledWith({
			where: { id: 'item_1' },
			select: { userId: true }
		})
		expect(deleteUploadForItemMock).toHaveBeenCalledWith({
			itemId: 'item_1',
			userId: 'user_1'
		})
		expect(itemDeleteMock).toHaveBeenCalledWith({
			where: { id: 'item_1' }
		})
		expect(revalidatePathMock).toHaveBeenCalledWith('/dashboard')
		expect(revalidatePathMock).toHaveBeenCalledWith('/profile')
		expect(revalidatePathMock).toHaveBeenCalledWith('/items', 'layout')
		expect(result).toEqual({
			success: 'Item eliminado correctamente.',
			error: null,
			successful: true
		})
	})
})
