'use server'

import { compare, hash } from 'bcryptjs'

import { auth } from '@/auth/auth'
import { prisma } from '@/lib/db/prisma'
import { validatePassword } from '@/lib/auth/password-policy'

type ChangePasswordState = {
	success?: string
	error?: string | null
	successful?: boolean
}

export async function changePasswordAction(
	prevState: ChangePasswordState,
	formData: FormData
): Promise<ChangePasswordState> {
	const session = await auth()

	if (!session?.user?.id) {
		return { error: 'Debes iniciar sesión para cambiar tu contraseña.' }
	}

	const currentPassword = formData.get('currentPassword')
	const newPassword = formData.get('newPassword')
	const confirmPassword = formData.get('confirmPassword')

	if (
		typeof currentPassword !== 'string' ||
		typeof newPassword !== 'string' ||
		typeof confirmPassword !== 'string'
	) {
		return { error: 'Todos los campos son obligatorios.' }
	}

	if (!currentPassword || !newPassword || !confirmPassword) {
		return { error: 'Todos los campos son obligatorios.' }
	}

	if (newPassword !== confirmPassword) {
		return { error: 'Las contraseñas no coinciden.' }
	}

	const passwordError = validatePassword(newPassword)
	if (passwordError) {
		return { error: passwordError }
	}

	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { password: true, email: true }
	})

	if (!user) {
		return { error: 'Usuario no encontrado.' }
	}

	const isCurrentPasswordValid = await compare(currentPassword, user.password)
	if (!isCurrentPasswordValid) {
		return { error: 'La contraseña actual no es correcta.' }
	}

	const hashedPassword = await hash(newPassword, 12)

	await prisma.user.update({
		where: { id: session.user.id },
		data: { password: hashedPassword }
	})

	return {
		success: 'Tu contraseña se ha actualizado correctamente.',
		error: null,
		successful: true
	}
}
