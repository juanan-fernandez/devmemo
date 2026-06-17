import { beforeEach, describe, expect, it, vi } from 'vitest'

import { updateCollection } from '@/actions/collections/update-collection'

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

function buildFormData(entries: Record<string, string>) {
	const fd = new FormData()
	for (const [k, v] of Object.entries(entries)) fd.set(k, v)
	return fd
}

describe('updateCollection', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		authMock.mockResolvedValue({ user: { id: 'user_1' } })
		collectionFindFirstMock.mockResolvedValue({ id: 'col_1' })
		collectionUpdateMock.mockResolvedValue({})
	})

	it('returns auth error when not signed in', async () => {
		authMock.mockResolvedValue(null)
		const result = await updateCollection({}, buildFormData({ collectionId: 'col_1', name: 'Nuevo nombre' }))
		expect(result).toEqual({ error: 'Debes iniciar sesión para editar colecciones.', successful: false })
	})

	it('returns error when collection not found or wrong owner', async () => {
		collectionFindFirstMock.mockResolvedValue(null)
		const result = await updateCollection({}, buildFormData({ collectionId: 'col_999', name: 'X' }))
		expect(result).toEqual({ error: 'Colección no encontrada.', successful: false })
	})

	it('updates name and description and revalidates', async () => {
		const result = await updateCollection({}, buildFormData({ collectionId: 'col_1', name: 'Renamed', description: 'New desc' }))
		expect(collectionUpdateMock).toHaveBeenCalledWith({
			where: { id: 'col_1' },
			data: { name: 'Renamed', description: 'New desc' }
		})
		expect(revalidatePathMock).toHaveBeenCalledWith('/dashboard')
		expect(revalidatePathMock).toHaveBeenCalledWith('/collections')
		expect(result).toEqual({ success: 'Colección actualizada correctamente.', error: null, successful: true, fieldErrors: {} })
	})

	it('returns validation error for empty name', async () => {
		const result = await updateCollection({}, buildFormData({ collectionId: 'col_1', name: '' }))
		expect(result.error).toBe('Revisa los campos del formulario.')
		expect(result.fieldErrors?.name).toBeDefined()
		expect(result.successful).toBe(false)
	})
})
