'use server'

import { requestPasswordReset } from '@/lib/auth/password-reset'
import { FORGOT_PASSWORD_SUCCESS_MESSAGE } from '@/lib/auth/password-reset-messages'

type RequestPasswordResetState = {
	message: string | null
	error: string | null
}

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function requestPasswordResetAction(
	_previousState: RequestPasswordResetState,
	formData: FormData
): Promise<RequestPasswordResetState> {
	try {
		const email = formData.get('email')

		if (typeof email !== 'string' || !isValidEmail(email.trim().toLowerCase())) {
			return {
				message: null,
				error: 'Escribe un correo electrónico válido.'
			}
		}

		await requestPasswordReset(email)

		return {
			message: FORGOT_PASSWORD_SUCCESS_MESSAGE,
			error: null
		}
	} catch {
		return {
			message: null,
			error: 'No pudimos procesar tu solicitud ahora mismo. Inténtalo de nuevo en unos minutos.'
		}
	}
}
