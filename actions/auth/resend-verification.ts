'use server'

import {
	resendVerificationEmail
} from '@/lib/auth/email-verification'
import { isEmailVerificationEnabled } from '@/lib/auth/email-verification-config'
import { RESEND_VERIFICATION_MESSAGE } from '@/lib/auth/email-verification-messages'
import { buildAuthRateLimitMessage } from '@/lib/auth/rate-limit-messages'
import { getIPFromHeaders } from '@/lib/get-ip'
import { rateLimiters } from '@/lib/rate-limit'
import { isValidEmail } from '@/lib/validation/email'

type ResendVerificationState = {
	message: string | null
	error: string | null
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

	const ip = await getIPFromHeaders()
	const { success, reset } = await rateLimiters.resendVerification.limit(
		`resend-verification:${ip}`
	)

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
			error: 'Escribe un correo electrónico válido para reenviar el enlace.'
		}
	}

	await resendVerificationEmail(email)

	return {
		message: RESEND_VERIFICATION_MESSAGE,
		error: null
	}
}
