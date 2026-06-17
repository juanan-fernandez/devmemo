'use server'

import { auth } from '@/auth/auth'
import { getCollectionsForUserSelect } from '@/lib/db/collections'

export async function getCollectionsForSelectAction() {
	const session = await auth()

	if (!session?.user?.id) {
		return []
	}

	return getCollectionsForUserSelect(session.user.id)
}
