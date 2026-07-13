import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import { getCollectionById } from '@/lib/db/collections'
import { getCollectionItemsPaginated } from '@/lib/db/items'
import { getSidebarBootstrap } from '@/lib/sidebar-bootstrap'
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

	const [sidebarBootstrap, collection, itemsResult] = await Promise.all([
		getSidebarBootstrap(userId),
		getCollectionById(userId, collectionId),
		getCollectionItemsPaginated(userId, collectionId, null, null, 12)
	])

	if (!collection) {
		notFound()
	}

	return (
		<DashboardLayoutShell
			sidebarItemTypes={sidebarBootstrap.sidebarItemTypes}
			sidebarCollections={sidebarBootstrap.sidebarCollections}
			sidebarUser={sidebarBootstrap.sidebarUser}
			searchIndex={sidebarBootstrap.searchIndex}
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
