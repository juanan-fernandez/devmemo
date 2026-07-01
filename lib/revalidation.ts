import { revalidatePath } from 'next/cache'

export function revalidateItemPaths(typeHref?: string) {
	revalidatePath('/dashboard')
	revalidatePath('/profile')
	revalidatePath('/items', 'layout')

	if (typeHref) {
		revalidatePath(typeHref)
	}
}

export function revalidateCollectionPaths() {
	revalidatePath('/dashboard')
	revalidatePath('/collections')
}
