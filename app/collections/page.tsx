import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import { getCollectionsPaginated } from '@/lib/db/collections'
import { getSidebarCollections } from '@/lib/db/collections'
import { getSidebarItemTypes } from '@/lib/db/items'
import { getSidebarUser } from '@/lib/db/user'
import { DashboardLayoutShell } from '@/components/dashboard/dashboard-layout-shell'
import { CollectionList } from '@/components/collections/collection-list'

export default async function CollectionsPage() {
	const session = await auth()

	if (!session?.user?.id) {
		redirect('/login')
	}

	const userId = session.user.id

	const [sidebarItemTypes, sidebarCollections, sidebarUser, initialData] = await Promise.all([
		getSidebarItemTypes(userId),
		getSidebarCollections(userId),
		getSidebarUser(userId),
		getCollectionsPaginated(userId, 'createdAt-desc', null, 9)
	])

	return (
		<DashboardLayoutShell
			sidebarItemTypes={sidebarItemTypes}
			sidebarCollections={sidebarCollections}
			sidebarUser={sidebarUser}
		>
			<CollectionList
				initialCollections={initialData.collections}
				initialNextCursor={initialData.nextCursor}
			/>
		</DashboardLayoutShell>
	)
}
