'use server'

import { auth } from '@/auth/auth'
import { getCollectionItemsPaginated } from '@/lib/db/items'

export async function loadCollectionItemsAction(
	collectionId: string,
	itemType?: string | null,
	cursor?: string | null
) {
	const session = await auth()

	if (!session?.user?.id) {
		return { items: [], nextCursor: null, totalCount: 0, filteredCount: 0 }
	}

	return getCollectionItemsPaginated(session.user.id, collectionId, itemType, cursor)
}
