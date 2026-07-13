export function getAppUrl(errorMessage: string) {
	const appUrl = process.env.APP_URL?.trim()

	if (!appUrl && process.env.NODE_ENV !== 'test') {
		throw new Error(errorMessage)
	}

	return appUrl ?? 'http://localhost:3000'
}
