'use server'

import { buildAuthRateLimitMessage } from '@/lib/auth/rate-limit-messages'
import { getIPFromHeaders } from '@/lib/get-ip'
import { requestPasswordReset } from '@/lib/auth/password-reset'
import { FORGOT_PASSWORD_SUCCESS_MESSAGE } from '@/lib/auth/password-reset-messages'
import { rateLimiters } from '@/lib/rate-limit'
import { isValidEmail } from '@/lib/validation/email'

type RequestPasswordResetState = {
	message: string | null
	error: string | null
}

export async function requestPasswordResetAction(
	_previousState: RequestPasswordResetState,
	formData: FormData
): Promise<RequestPasswordResetState> {
	try {
		const ip = await getIPFromHeaders()
		const { success, reset } = await rateLimiters.passwordReset.limit(`reset:${ip}`)

		if (!success) {
			return {
				message: null,
				error: buildAuthRateLimitMessage(reset)
			}
		}

		const email = formData.get('email')

		if (typeof email !== 'string' || !isValidEmail(email)) {
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
