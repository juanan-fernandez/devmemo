import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createCollection } from '@/actions/collections/create-collection'

const { authMock, collectionCreateMock, revalidatePathMock } = vi.hoisted(() => ({
	authMock: vi.fn(),
	collectionCreateMock: vi.fn(),
	revalidatePathMock: vi.fn()
}))

vi.mock('@/auth/auth', () => ({ auth: authMock }))
vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }))

vi.mock('@/lib/db/prisma', () => ({
	prisma: {
		collection: {
			create: collectionCreateMock
		}
	}
}))

function buildFormData(entries: Record<string, string>) {
	const fd = new FormData()
	for (const [k, v] of Object.entries(entries)) fd.set(k, v)
	return fd
}

describe('createCollection', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		authMock.mockResolvedValue({ user: { id: 'user_1' } })
		collectionCreateMock.mockResolvedValue({ id: 'col_new' })
	})

	it('returns auth error when not signed in', async () => {
		authMock.mockResolvedValue(null)
		const result = await createCollection(
			{},
			buildFormData({ name: 'Mi colección', description: '' })
		)
		expect(result).toEqual({ error: 'Debes iniciar sesión para crear colecciones.', successful: false })
		expect(collectionCreateMock).not.toHaveBeenCalled()
	})

	it('returns validation error for empty name', async () => {
		const result = await createCollection(
			{},
			buildFormData({ name: '', description: '' })
		)
		expect(result.error).toBe('Revisa los campos del formulario.')
		expect(result.fieldErrors?.name).toBeDefined()
		expect(result.successful).toBe(false)
		expect(collectionCreateMock).not.toHaveBeenCalled()
	})

	it('returns validation error for whitespace-only name', async () => {
		const result = await createCollection(
			{},
			buildFormData({ name: '   ', description: '' })
		)
		expect(result.error).toBe('Revisa los campos del formulario.')
		expect(result.fieldErrors?.name).toBeDefined()
		expect(result.successful).toBe(false)
	})

	it('creates collection with name only and revalidates paths', async () => {
		const result = await createCollection(
			{},
			buildFormData({ name: 'Nueva colección', description: '' })
		)
		expect(collectionCreateMock).toHaveBeenCalledWith({
			data: {
				name: 'Nueva colección',
				description: null,
				userId: 'user_1'
			}
		})
		expect(revalidatePathMock).toHaveBeenCalledWith('/dashboard')
		expect(revalidatePathMock).toHaveBeenCalledWith('/collections')
		expect(result).toEqual({
			success: 'Colección creada correctamente.',
			error: null,
			successful: true,
			fieldErrors: {}
		})
	})

	it('creates collection with name and description', async () => {
		const result = await createCollection(
			{},
			buildFormData({ name: 'Snippets', description: 'Mis snippets favoritos' })
		)
		expect(collectionCreateMock).toHaveBeenCalledWith({
			data: {
				name: 'Snippets',
				description: 'Mis snippets favoritos',
				userId: 'user_1'
			}
		})
		expect(result.successful).toBe(true)
	})

	it('returns error when prisma create throws', async () => {
		collectionCreateMock.mockRejectedValue(new Error('DB error'))
		const result = await createCollection(
			{},
			buildFormData({ name: 'Colección', description: '' })
		)
		expect(result).toEqual({
			error: 'No se ha podido crear la colección.',
			successful: false
		})
	})
})
