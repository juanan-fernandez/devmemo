import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import { getCollectionById } from '@/lib/db/collections'
import { getCollectionItemsPaginated } from '@/lib/db/items'
import { getSidebarCollections } from '@/lib/db/collections'
import { getSidebarItemTypes } from '@/lib/db/items'
import { getSidebarUser } from '@/lib/db/user'
import { getSearchIndex } from '@/lib/db/search'
import { DashboardLayoutShell } from '@/components/dashboard/dashboard-layout-shell'
import { CollectionDetailContent } from '@/components/collections/collection-detail-content'

type CollectionDetailPageProps = {
	params: Promise<{ id: string }>
}

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
	const { id: collectionId } = await params

	const session = await auth()

	if (!session?.user?.id) {
		redirect('/login')
	}

	const userId = session.user.id

	const [sidebarItemTypes, sidebarCollections, sidebarUser, collection, itemsResult, searchIndex] =
		await Promise.all([
			getSidebarItemTypes(userId),
			getSidebarCollections(userId),
			getSidebarUser(userId),
			getCollectionById(userId, collectionId),
			getCollectionItemsPaginated(userId, collectionId, null, null, 12),
			getSearchIndex(userId)
		])

	if (!collection) {
		notFound()
	}

	return (
		<DashboardLayoutShell
			sidebarItemTypes={sidebarItemTypes}
			sidebarCollections={sidebarCollections}
			sidebarUser={sidebarUser}
			searchIndex={searchIndex}
		>
			<CollectionDetailContent
				collection={collection}
				initialItems={itemsResult.items}
				initialTotalCount={itemsResult.totalCount}
				initialFilteredCount={itemsResult.filteredCount}
				initialNextCursor={itemsResult.nextCursor}
			/>
		</DashboardLayoutShell>
	)
}
