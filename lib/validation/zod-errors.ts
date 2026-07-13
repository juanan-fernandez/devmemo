import { z } from 'zod'

export function mapZodFieldErrors<TField extends string>(
	error: z.ZodError,
	fields: readonly TField[]
): Partial<Record<TField, string>> {
	const fieldErrors = error.flatten().fieldErrors as Partial<Record<TField, string[]>>

	return fields.reduce<Partial<Record<TField, string>>>((result, field) => {
		const firstError = fieldErrors[field]?.[0]

		if (firstError) {
			result[field] = firstError
		}

		return result
	}, {})
}
