import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import { getCollectionsPaginated } from '@/lib/db/collections'
import { getSidebarBootstrap } from '@/lib/sidebar-bootstrap'
import { DashboardLayoutShell } from '@/components/dashboard/dashboard-layout-shell'
import { CollectionList } from '@/components/collections/collection-list'

type CollectionsPageProps = {
	searchParams: Promise<{ filter?: string }>
}

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
	const { filter } = await searchParams
	const favoritesOnly = filter === 'favorites'

	const session = await auth()

	if (!session?.user?.id) {
		redirect('/login')
	}

	const userId = session.user.id

	const [sidebarBootstrap, initialData] = await Promise.all([
		getSidebarBootstrap(userId),
		getCollectionsPaginated(userId, 'createdAt-desc', null, 9, favoritesOnly)
	])

	return (
		<DashboardLayoutShell
			sidebarItemTypes={sidebarBootstrap.sidebarItemTypes}
			sidebarCollections={sidebarBootstrap.sidebarCollections}
			sidebarUser={sidebarBootstrap.sidebarUser}
			searchIndex={sidebarBootstrap.searchIndex}
		>
			<CollectionList
				initialCollections={initialData.collections}
				initialNextCursor={initialData.nextCursor}
				favoritesOnly={favoritesOnly}
			/>
		</DashboardLayoutShell>
	)
}
