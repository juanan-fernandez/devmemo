import { UNVERIFIED_LOGIN_MESSAGE } from '@/lib/auth/email-verification-messages'

const AUTH_ERROR_MESSAGES: Record<string, string> = {
	AccessDenied: 'No tienes permiso para acceder con esa cuenta.',
	CallbackRouteError: 'No pudimos completar el inicio de sesión. Inténtalo de nuevo.',
	Configuration: 'La autenticación no está disponible en este momento.',
	CredentialsSignin: 'Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.',
	Default: 'No pudimos iniciar sesión. Inténtalo de nuevo en unos minutos.',
	OAuthAccountNotLinked: 'Esa cuenta ya está asociada a otro método de acceso.',
	OAuthCallbackError: 'Hubo un problema al validar tu cuenta de GitHub.',
	OAuthSignin: 'No pudimos iniciar el acceso con GitHub. Inténtalo de nuevo.',
	SessionRequired: 'Debes iniciar sesión para continuar.',
	Verification: 'La verificación ya no es válida. Solicita un nuevo acceso.'
}


export function getAuthErrorMessage(error?: string | null, code?: string | null) {
	if (!error) {
		return null
	}

	if (error === 'CredentialsSignin' && code === 'email_not_verified') {
		return UNVERIFIED_LOGIN_MESSAGE
	}

	return AUTH_ERROR_MESSAGES[error] ?? AUTH_ERROR_MESSAGES.Default
}
