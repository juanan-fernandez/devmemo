'use server'

import {
	resendVerificationEmail
} from '@/lib/auth/email-verification'
import { isEmailVerificationEnabled } from '@/lib/auth/email-verification-config'
import { RESEND_VERIFICATION_MESSAGE } from '@/lib/auth/email-verification-messages'

export type ResendVerificationState = {
	message: string | null
	error: string | null
}

export const INITIAL_RESEND_VERIFICATION_STATE: ResendVerificationState = {
	message: null,
	error: null
}

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function resendVerificationAction(
	_previousState: ResendVerificationState,
	formData: FormData
): Promise<ResendVerificationState> {
	if (!isEmailVerificationEnabled()) {
		return INITIAL_RESEND_VERIFICATION_STATE
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
