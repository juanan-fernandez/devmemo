export const PASSWORD_ERROR_MESSAGE =
	'La contraseña debe tener al menos 8 caracteres e incluir números y/o símbolos.'

export const PASSWORD_MISMATCH_MESSAGE = 'Las contraseñas no coinciden.'

export function isValidPassword(password: string) {
	return /^(?=.*[0-9\W_]).{8,}$/.test(password)
}

export function validatePassword(password: string) {
	if (!password) {
		return 'Escribe una contraseña.'
	}

	if (!isValidPassword(password)) {
		return PASSWORD_ERROR_MESSAGE
	}

	return null
}
