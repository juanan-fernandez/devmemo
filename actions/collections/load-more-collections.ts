'use server'

import { auth } from '@/auth/auth'
import {
	getCollectionsPaginated,
	type CollectionSort,
	type PaginatedCollectionsResult
} from '@/lib/db/collections'

export async function loadMoreCollectionsAction(
	sort: CollectionSort,
	cursor?: string | null,
	favoritesOnly?: boolean
): Promise<PaginatedCollectionsResult> {
	const session = await auth()

	if (!session?.user?.id) {
		return { collections: [], nextCursor: null }
	}

	return getCollectionsPaginated(session.user.id, sort, cursor, 9, favoritesOnly)
}
