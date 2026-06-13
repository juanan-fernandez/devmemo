export function isEmailVerificationEnabled() {
	return process.env.EMAIL_VERIFICATION?.trim().toLowerCase() === 'true'
}
