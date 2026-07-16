'use server'

import { auth } from '@/auth/auth'
import { getItemsPaginated, type ItemSort, type PaginatedItemsResult } from '@/lib/db/items'

export async function loadMoreItemsAction(
	sort: ItemSort,
	cursor?: string | null,
	favoritesOnly?: boolean
): Promise<PaginatedItemsResult> {
	const session = await auth()

	if (!session?.user?.id) {
		return { items: [], nextCursor: null }
	}

	return getItemsPaginated(session.user.id, sort, cursor, 9, favoritesOnly)
}
