import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import { getCollectionsPaginated } from '@/lib/db/collections'
import { getSidebarCollections } from '@/lib/db/collections'
import { getSidebarItemTypes } from '@/lib/db/items'
import { getSidebarUser } from '@/lib/db/user'
import { getSearchIndex } from '@/lib/db/search'
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

	const [sidebarItemTypes, sidebarCollections, sidebarUser, initialData, searchIndex] = await Promise.all([
		getSidebarItemTypes(userId),
		getSidebarCollections(userId),
		getSidebarUser(userId),
		getCollectionsPaginated(userId, 'createdAt-desc', null, 9, favoritesOnly),
		getSearchIndex(userId)
	])

	return (
		<DashboardLayoutShell
			sidebarItemTypes={sidebarItemTypes}
			sidebarCollections={sidebarCollections}
			sidebarUser={sidebarUser}
			searchIndex={searchIndex}
		>
			<CollectionList
				initialCollections={initialData.collections}
				initialNextCursor={initialData.nextCursor}
				favoritesOnly={favoritesOnly}
			/>
		</DashboardLayoutShell>
	)
}
