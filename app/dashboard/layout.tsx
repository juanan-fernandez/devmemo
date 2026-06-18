import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import { DashboardLayoutShell } from '@/components/dashboard/dashboard-layout-shell'
import { getSidebarCollections } from '@/lib/db/collections'
import { getSidebarItemTypes } from '@/lib/db/items'
import { getSidebarUser } from '@/lib/db/user'
import { getSearchIndex } from '@/lib/db/search'

export default async function DashboardLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await auth()

	if (!session?.user?.id) {
		redirect('/login')
	}

	const userId = session.user.id

	const [sidebarItemTypes, sidebarCollections, sidebarUser, searchIndex] = await Promise.all([
		userId ? getSidebarItemTypes(userId) : Promise.resolve([]),
		userId
			? getSidebarCollections(userId)
			: Promise.resolve({ favoriteCollectionsCount: 0, recentCollections: [] }),
		userId ? getSidebarUser(userId) : Promise.resolve(null),
		userId ? getSearchIndex(userId) : Promise.resolve({ items: [], collections: [] })
	])

	return (
		<DashboardLayoutShell
			sidebarItemTypes={sidebarItemTypes}
			sidebarCollections={sidebarCollections}
			sidebarUser={sidebarUser}
			searchIndex={searchIndex}
		>
			{children}
		</DashboardLayoutShell>
	)
}
