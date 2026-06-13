import { auth } from '@/auth/auth'
import { DashboardLayoutShell } from '@/components/dashboard/dashboard-layout-shell'
import { getSidebarCollections } from '@/lib/db/collections'
import { getSidebarItemTypes } from '@/lib/db/items'
import { getSidebarUser } from '@/lib/db/user'

export default async function DashboardLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await auth()
	const userId = session?.user?.id

	const [sidebarItemTypes, sidebarCollections, sidebarUser] = await Promise.all([
		userId ? getSidebarItemTypes(userId) : Promise.resolve([]),
		userId
			? getSidebarCollections(userId)
			: Promise.resolve({ favoriteCollectionsCount: 0, recentCollections: [] }),
		userId ? getSidebarUser(userId) : Promise.resolve(null)
	])

	return (
		<DashboardLayoutShell
			sidebarItemTypes={sidebarItemTypes}
			sidebarCollections={sidebarCollections}
			sidebarUser={sidebarUser}
		>
			{children}
		</DashboardLayoutShell>
	)
}
