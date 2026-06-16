import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createItem } from '@/actions/items/create-item'
import { getCanonicalItemTypeByKey } from '@/lib/item-types'

const {
	authMock,
	revalidatePathMock,
	itemTypeFindFirstMock,
	collectionFindFirstMock,
	transactionMock,
	itemCreateMock,
	tagUpsertMock,
	itemTagCreateManyMock
} = vi.hoisted(() => ({
	authMock: vi.fn(),
	revalidatePathMock: vi.fn(),
	itemTypeFindFirstMock: vi.fn(),
	collectionFindFirstMock: vi.fn(),
	transactionMock: vi.fn(),
	itemCreateMock: vi.fn(),
	tagUpsertMock: vi.fn(),
	itemTagCreateManyMock: vi.fn()
}))

vi.mock('next/cache', () => ({
	revalidatePath: revalidatePathMock
}))

vi.mock('@/auth/auth', () => ({
	auth: authMock
}))

vi.mock('@/lib/db/prisma', () => ({
	prisma: {
		itemType: {
			findFirst: itemTypeFindFirstMock
		},
		collection: {
			findFirst: collectionFindFirstMock
		},
		$transaction: transactionMock
	}
}))

function buildFormData(entries: Record<string, string>) {
	const formData = new FormData()

	for (const [key, value] of Object.entries(entries)) {
		formData.set(key, value)
	}

	return formData
}

describe('createItem server action', () => {
	beforeEach(() => {
		vi.clearAllMocks()

		authMock.mockResolvedValue({ user: { id: 'user_123' } })
		itemTypeFindFirstMock.mockResolvedValue({ id: 'type_123' })
		collectionFindFirstMock.mockResolvedValue({ id: 'collection_123' })
		itemCreateMock.mockResolvedValue({ id: 'item_123' })
		tagUpsertMock.mockImplementation(({ where }: { where: { name_userId: { name: string } } }) =>
			Promise.resolve({ id: `tag-${where.name_userId.name}` })
		)
		itemTagCreateManyMock.mockResolvedValue({ count: 2 })
		transactionMock.mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) =>
			callback({
				item: { create: itemCreateMock },
				tag: { upsert: tagUpsertMock },
				itemTag: { createMany: itemTagCreateManyMock }
			})
		)
	})

	it('returns an auth error when the user is not signed in', async () => {
		authMock.mockResolvedValue(null)

		const result = await createItem(
			{},
			buildFormData({
				type: 'snippet',
				title: 'Snippet title',
				description: '',
				content: 'console.log("hi")',
				language: 'TypeScript',
				url: '',
				collectionId: 'none',
				tags: ''
			})
		)

		expect(result).toEqual({
			error: 'Debes iniciar sesión para crear items.',
			successful: false
		})
		expect(itemTypeFindFirstMock).not.toHaveBeenCalled()
		expect(transactionMock).not.toHaveBeenCalled()
	})

	it('returns a field error when the selected collection does not belong to the user', async () => {
		collectionFindFirstMock.mockResolvedValue(null)

		const result = await createItem(
			{},
			buildFormData({
				type: 'snippet',
				title: 'Snippet title',
				description: '',
				content: 'console.log("hi")',
				language: 'TypeScript',
				url: '',
				collectionId: 'collection_999',
				tags: 'react'
			})
		)

		expect(result).toEqual({
			error: 'Revisa los campos del formulario.',
			fieldErrors: { collectionId: 'Selecciona una colección válida.' },
			successful: false
		})
		expect(collectionFindFirstMock).toHaveBeenCalledWith({
			where: {
				id: 'collection_999',
				userId: 'user_123'
			},
			select: {
				id: true
			}
		})
		expect(transactionMock).not.toHaveBeenCalled()
	})

	it('creates the item, persists normalized tags, and revalidates affected routes', async () => {
		const canonicalSnippetType = getCanonicalItemTypeByKey('snippet')

		const result = await createItem(
			{},
			buildFormData({
				type: 'snippet',
				title: '  Mi snippet  ',
				description: '  Descripción corta  ',
				content: 'const answer = 42',
				language: 'TypeScript',
				url: '',
				collectionId: 'none',
				tags: 'react, nextjs, react'
			})
		)

		expect(itemCreateMock).toHaveBeenCalledWith({
			data: {
			title: 'Mi snippet',
			description: 'Descripción corta',
			contentType: 'text',
			content: 'const answer = 42',
			fileName: null,
			fileSize: null,
			fileUrl: null,
			language: 'TypeScript',
			url: null,
				collectionId: null,
				userId: 'user_123',
				typeId: 'type_123'
			},
			select: {
				id: true
			}
		})
		expect(tagUpsertMock).toHaveBeenCalledTimes(2)
		expect(itemTagCreateManyMock).toHaveBeenCalledWith({
			data: [
				{ itemId: 'item_123', tagId: 'tag-react' },
				{ itemId: 'item_123', tagId: 'tag-nextjs' }
			],
			skipDuplicates: true
		})
		expect(revalidatePathMock).toHaveBeenNthCalledWith(1, '/dashboard')
		expect(revalidatePathMock).toHaveBeenNthCalledWith(2, '/profile')
		expect(revalidatePathMock).toHaveBeenNthCalledWith(3, '/items', 'layout')
		expect(revalidatePathMock).toHaveBeenNthCalledWith(4, canonicalSnippetType?.href)
		expect(result).toEqual({
			success: 'Item creado correctamente.',
			error: null,
			successful: true,
			fieldErrors: {}
		})
	})
})
