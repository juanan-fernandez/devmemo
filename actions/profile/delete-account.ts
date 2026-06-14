'use server'

import { redirect } from 'next/navigation'

import { auth, signOut } from '@/auth/auth'
import { prisma } from '@/lib/db/prisma'

const DEMO_USER_EMAIL = 'demo@devmemo.com'
const DELETE_ACCOUNT_SUCCESS_REDIRECT = '/?accountDeleted=true'

export type DeleteAccountState = {
	error?: string | null
}

export async function deleteAccountAction(
	_previousState: DeleteAccountState,
	formData: FormData
): Promise<DeleteAccountState> {
	const session = await auth()
	const userId = session?.user?.id
	const userEmail = session?.user?.email

	if (!userId || !userEmail) {
		return { error: 'Debes iniciar sesión para eliminar tu cuenta.' }
	}

	const confirmation = formData.get('confirmation')

	if (typeof confirmation !== 'string' || confirmation !== 'BORRAR') {
		return { error: 'Escribe BORRAR exactamente para continuar.' }
	}

	if (userEmail === DEMO_USER_EMAIL) {
		return { error: 'El usuario demo no se puede eliminar' }
	}

	await prisma.$transaction(async tx => {
		await tx.passwordResetToken.deleteMany({
			where: { email: userEmail }
		})

		await tx.emailVerificationToken.deleteMany({
			where: { email: userEmail }
		})

		await tx.verificationToken.deleteMany({
			where: { identifier: userEmail }
		})

		await tx.item.deleteMany({
			where: { userId }
		})

		await tx.itemType.deleteMany({
			where: { userId }
		})

		await tx.user.delete({
			where: { id: userId }
		})
	})

	await signOut({ redirect: false })
	redirect(DELETE_ACCOUNT_SUCCESS_REDIRECT)
}
