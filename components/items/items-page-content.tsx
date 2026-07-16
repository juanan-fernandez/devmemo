import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import { getItemsPaginated } from '@/lib/db/items'
import { getSidebarBootstrap } from '@/lib/sidebar-bootstrap'
import { DashboardLayoutShell } from '@/components/dashboard/dashboard-layout-shell'
import { ItemList } from '@/components/items/item-list'

type ItemsPageContentProps = {
	favoritesOnly?: boolean
}

export async function ItemsPageContent({ favoritesOnly = false }: ItemsPageContentProps) {
	const session = await auth()

	if (!session?.user?.id) {
		redirect('/login')
	}

	const userId = session.user.id

	const [sidebarBootstrap, initialData] = await Promise.all([
		getSidebarBootstrap(userId),
		getItemsPaginated(userId, 'createdAt-desc', null, 9, favoritesOnly)
	])

	return (
		<DashboardLayoutShell
			sidebarItemTypes={sidebarBootstrap.sidebarItemTypes}
			sidebarCollections={sidebarBootstrap.sidebarCollections}
			sidebarUser={sidebarBootstrap.sidebarUser}
			searchIndex={sidebarBootstrap.searchIndex}
		>
			<ItemList
				initialItems={initialData.items}
				initialNextCursor={initialData.nextCursor}
				favoritesOnly={favoritesOnly}
			/>
		</DashboardLayoutShell>
	)
}
