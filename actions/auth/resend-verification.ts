'use server'

import {
	resendVerificationEmail
} from '@/lib/auth/email-verification'
import { isEmailVerificationEnabled } from '@/lib/auth/email-verification-config'
import { RESEND_VERIFICATION_MESSAGE } from '@/lib/auth/email-verification-messages'

type ResendVerificationState = {
	message: string | null
	error: string | null
}

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function resendVerificationAction(
	_previousState: ResendVerificationState,
	formData: FormData
): Promise<ResendVerificationState> {
	if (!isEmailVerificationEnabled()) {
		return {
			message: null,
			error: null
		}
	}

	const email = formData.get('email')

	if (typeof email !== 'string' || !isValidEmail(email.trim())) {
		return {
			message: null,
			error: 'Escribe un correo electrónico válido para reenviar el enlace.'
		}
	}

	await resendVerificationEmail(email)

	return {
		message: RESEND_VERIFICATION_MESSAGE,
		error: null
	}
}
