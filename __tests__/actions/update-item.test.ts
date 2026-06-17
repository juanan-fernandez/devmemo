import { beforeEach, describe, expect, it, vi } from 'vitest'

import { updateItemAction } from '@/actions/items/update-item'

const {
	authMock,
	revalidatePathMock,
	itemFindUniqueMock,
	collectionFindFirstMock,
	transactionMock,
	itemUpdateMock,
	tagUpsertMock,
	itemTagCreateManyMock,
	itemTagDeleteManyMock
} = vi.hoisted(() => ({
	authMock: vi.fn(),
	revalidatePathMock: vi.fn(),
	itemFindUniqueMock: vi.fn(),
	collectionFindFirstMock: vi.fn(),
	transactionMock: vi.fn(),
	itemUpdateMock: vi.fn(),
	tagUpsertMock: vi.fn(),
	itemTagCreateManyMock: vi.fn(),
	itemTagDeleteManyMock: vi.fn()
}))

vi.mock('next/cache', () => ({
	revalidatePath: revalidatePathMock
}))

vi.mock('@/auth/auth', () => ({
	auth: authMock
}))

vi.mock('@/lib/db/prisma', () => ({
	prisma: {
		item: {
			findUnique: itemFindUniqueMock
		},
		collection: {
			findFirst: collectionFindFirstMock
		},
		$transaction: transactionMock
	}
}))

function buildUpdateInput(overrides: Partial<{
	itemId: string
	title: string
	description: string | null
	content: string | null
	language: string | null
	url: string | null
	tags: string[]
	collectionId: string | null
}> = {}) {
	return {
		itemId: 'item_123',
		title: 'Título',
		description: null,
		content: null,
		language: null,
		url: null,
		tags: [] as string[],
		collectionId: null,
		...overrides
	}
}

describe('updateItemAction server action', () => {
	beforeEach(() => {
		vi.clearAllMocks()

		authMock.mockResolvedValue({ user: { id: 'user_123' } })
		itemFindUniqueMock.mockResolvedValue({
			userId: 'user_123',
			type: { name: 'snippet' }
		})
		collectionFindFirstMock.mockResolvedValue({ id: 'collection_123' })
		itemUpdateMock.mockResolvedValue({ id: 'item_123' })
		tagUpsertMock.mockImplementation(({ where }: { where: { name_userId: { name: string } } }) =>
			Promise.resolve({ id: `tag-${where.name_userId.name}` })
		)
		itemTagCreateManyMock.mockResolvedValue({ count: 2 })
		itemTagDeleteManyMock.mockResolvedValue({ count: 2 })
		transactionMock.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) =>
			callback({
				item: { update: itemUpdateMock },
				tag: { upsert: tagUpsertMock },
				itemTag: { createMany: itemTagCreateManyMock, deleteMany: itemTagDeleteManyMock }
			})
		)
	})

	it('returns an auth error when the user is not signed in', async () => {
		authMock.mockResolvedValue(null)

		const result = await updateItemAction(buildUpdateInput())

		expect(result).toEqual({
			error: 'Debes iniciar sesión para editar items.'
		})
		expect(itemFindUniqueMock).not.toHaveBeenCalled()
	})

	it('returns an error when the item does not exist', async () => {
		itemFindUniqueMock.mockResolvedValue(null)

		const result = await updateItemAction(buildUpdateInput({ itemId: 'item_999' }))

		expect(result).toEqual({
			error: 'Item no encontrado.'
		})
	})

	it('returns an error when the item belongs to another user', async () => {
		itemFindUniqueMock.mockResolvedValue({
			userId: 'user_other',
			type: { name: 'snippet' }
		})

		const result = await updateItemAction(buildUpdateInput())

		expect(result).toEqual({
			error: 'No tienes permiso para modificar este item.'
		})
	})

	it('returns a field error when the collection does not belong to the user', async () => {
		collectionFindFirstMock.mockResolvedValue(null)

		const result = await updateItemAction(
			buildUpdateInput({ collectionId: 'collection_999' })
		)

		expect(result).toEqual({
			error: 'Revisa los campos del formulario.',
			fieldErrors: { collectionId: 'La colección seleccionada no es válida.' },
			successful: false
		})
		expect(collectionFindFirstMock).toHaveBeenCalledWith({
			where: { id: 'collection_999', userId: 'user_123' },
			select: { id: true }
		})
		expect(transactionMock).not.toHaveBeenCalled()
	})

	it('updates the item with a valid collectionId', async () => {
		const result = await updateItemAction(
			buildUpdateInput({
				title: 'Título editado',
				description: 'Descripción editada',
				tags: ['react'],
				collectionId: 'collection_123'
			})
		)

		expect(collectionFindFirstMock).toHaveBeenCalledWith({
			where: { id: 'collection_123', userId: 'user_123' },
			select: { id: true }
		})
		expect(itemUpdateMock).toHaveBeenCalledWith({
			where: { id: 'item_123' },
			data: expect.objectContaining({
				title: 'Título editado',
				description: 'Descripción editada',
				collectionId: 'collection_123'
			})
		})
		expect(result).toEqual({
			success: 'Cambios guardados correctamente.',
			error: null,
			successful: true,
			fieldErrors: {}
		})
	})

	it('sets collectionId to null in the db when an empty string is provided', async () => {
		const result = await updateItemAction(
			buildUpdateInput({ collectionId: '' })
		)

		expect(itemUpdateMock).toHaveBeenCalledWith({
			where: { id: 'item_123' },
			data: expect.objectContaining({
				collectionId: null
			})
		})
		expect(result).toEqual({
			success: 'Cambios guardados correctamente.',
			error: null,
			successful: true,
			fieldErrors: {}
		})
	})

	it('does not query collection ownership when collectionId is empty', async () => {
		await updateItemAction(buildUpdateInput({ collectionId: '' }))

		expect(collectionFindFirstMock).not.toHaveBeenCalled()
	})

	it('sets collectionId to null in the db when collectionId is null', async () => {
		await updateItemAction(buildUpdateInput({ collectionId: null }))

		expect(itemUpdateMock).toHaveBeenCalledWith({
			where: { id: 'item_123' },
			data: expect.objectContaining({
				collectionId: null
			})
		})
	})

	it('returns a Zod error when collectionId is not a valid type', async () => {
		const result = await updateItemAction(
			// @ts-expect-error — testing runtime validation for invalid type
			buildUpdateInput({ collectionId: 42 })
		)

		expect(result).toEqual({
			error: 'Revisa los campos del formulario.',
			fieldErrors: expect.objectContaining({ collectionId: expect.any(String) }),
			successful: false
		})
		expect(transactionMock).not.toHaveBeenCalled()
	})
})
