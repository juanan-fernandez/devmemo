export function logServerError(scope: string, error: unknown): void {
	console.error(`[${scope}]`, error)
}
