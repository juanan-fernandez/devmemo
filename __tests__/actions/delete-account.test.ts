import { beforeEach, describe, expect, it, vi } from 'vitest'

import { deleteAccountAction } from '@/actions/profile/delete-account'

const { authMock, signOutMock, redirectMock, transactionMock, deleteManyMock, userDeleteMock } =
	vi.hoisted(() => ({
		authMock: vi.fn(),
		signOutMock: vi.fn(),
		redirectMock: vi.fn(),
		transactionMock: vi.fn(),
		deleteManyMock: vi.fn(),
		userDeleteMock: vi.fn()
	}))

vi.mock('next/navigation', () => ({ redirect: redirectMock }))
vi.mock('@/auth/auth', () => ({ auth: authMock, signOut: signOutMock }))

vi.mock('@/lib/db/prisma', () => ({
	prisma: {
		$transaction: transactionMock
	}
}))

function buildFormData(confirmation: string) {
	const fd = new FormData()
	fd.set('confirmation', confirmation)
	return fd
}

function setupTransaction() {
	transactionMock.mockImplementation(
		async (cb: (tx: Record<string, Record<string, unknown>>) => Promise<void>) =>
			cb({
				passwordResetToken: { deleteMany: deleteManyMock },
				emailVerificationToken: { deleteMany: deleteManyMock },
				verificationToken: { deleteMany: deleteManyMock },
				item: { deleteMany: deleteManyMock },
				itemType: { deleteMany: deleteManyMock },
				user: { delete: userDeleteMock }
			})
	)
}

describe('deleteAccountAction', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		authMock.mockResolvedValue({ user: { id: 'user_1', email: 'user@example.com' } })
		signOutMock.mockResolvedValue(undefined)
		setupTransaction()
	})

	it('returns auth error when session is null', async () => {
		authMock.mockResolvedValue(null)
		const result = await deleteAccountAction({}, buildFormData('BORRAR'))
		expect(result).toEqual({ error: 'Debes iniciar sesión para eliminar tu cuenta.' })
		expect(transactionMock).not.toHaveBeenCalled()
	})

	it('returns auth error when session has no user id', async () => {
		authMock.mockResolvedValue({ user: {} })
		const result = await deleteAccountAction({}, buildFormData('BORRAR'))
		expect(result).toEqual({ error: 'Debes iniciar sesión para eliminar tu cuenta.' })
	})

	it('returns auth error when session has no email', async () => {
		authMock.mockResolvedValue({ user: { id: 'user_1' } })
		const result = await deleteAccountAction({}, buildFormData('BORRAR'))
		expect(result).toEqual({ error: 'Debes iniciar sesión para eliminar tu cuenta.' })
	})

	it('returns error when confirmation text is not BORRAR', async () => {
		const result = await deleteAccountAction({}, buildFormData('borrar'))
		expect(result).toEqual({ error: 'Escribe BORRAR exactamente para continuar.' })
	})

	it('returns error when confirmation is missing', async () => {
		const fd = new FormData()
		const result = await deleteAccountAction({}, fd)
		expect(result).toEqual({ error: 'Escribe BORRAR exactamente para continuar.' })
	})

	it('returns error for demo user', async () => {
		authMock.mockResolvedValue({ user: { id: 'demo_user', email: 'demo@devmemo.com' } })
		const result = await deleteAccountAction({}, buildFormData('BORRAR'))
		expect(result).toEqual({ error: 'El usuario demo no se puede eliminar' })
	})

	it('deletes all related records, signs out, and redirects', async () => {
		await deleteAccountAction({}, buildFormData('BORRAR'))

		expect(transactionMock).toHaveBeenCalledTimes(1)
		expect(deleteManyMock).toHaveBeenCalledWith({ where: { email: 'user@example.com' } })
		expect(deleteManyMock).toHaveBeenCalledWith({ where: { userId: 'user_1' } })
		expect(userDeleteMock).toHaveBeenCalledWith({ where: { id: 'user_1' } })
		expect(signOutMock).toHaveBeenCalledWith({ redirect: false })
		expect(redirectMock).toHaveBeenCalledWith('/?accountDeleted=true')
	})
})
