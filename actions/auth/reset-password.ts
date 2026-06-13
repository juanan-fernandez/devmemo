'use server'

import { redirect } from 'next/navigation'

import { PASSWORD_ERROR_MESSAGE, PASSWORD_MISMATCH_MESSAGE, validatePassword } from '@/lib/auth/password-policy'
import { resetPassword } from '@/lib/auth/password-reset'
import { PASSWORD_RESET_INVALID_TOKEN_MESSAGE } from '@/lib/auth/password-reset-messages'

type ResetPasswordState = {
	error: string | null
}

export async function resetPasswordAction(
	_previousState: ResetPasswordState,
	formData: FormData
): Promise<ResetPasswordState> {
	try {
		const token = formData.get('token')
		const password = formData.get('password')
		const confirmPassword = formData.get('confirmPassword')

		if (typeof token !== 'string' || !token.trim()) {
			return { error: PASSWORD_RESET_INVALID_TOKEN_MESSAGE }
		}

		if (typeof password !== 'string' || typeof confirmPassword !== 'string') {
			return { error: 'Completa todos los campos antes de continuar.' }
		}

		const passwordError = validatePassword(password)

		if (passwordError) {
			return { error: passwordError === 'Escribe una contraseña.' ? PASSWORD_ERROR_MESSAGE : passwordError }
		}

		if (!confirmPassword) {
			return { error: 'Confirma tu nueva contraseña.' }
		}

		if (password !== confirmPassword) {
			return { error: PASSWORD_MISMATCH_MESSAGE }
		}

		const result = await resetPassword(token, password)

		if (!result.success) {
			return { error: result.message }
		}
	} catch {
		return { error: 'No pudimos actualizar tu contraseña. Inténtalo de nuevo en unos minutos.' }
	}

	redirect('/login?reset=true')
}
