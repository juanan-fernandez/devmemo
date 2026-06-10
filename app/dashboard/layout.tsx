import { DashboardLayoutShell } from '@/components/dashboard/dashboard-layout-shell'
import { getSidebarCollections } from '@/lib/db/collections'
import { getSidebarItemTypes } from '@/lib/db/items'
import { getSidebarUser } from '@/lib/db/user'

export default async function DashboardLayout({
	children
}: {
	children: React.ReactNode
}) {
	const [sidebarItemTypes, sidebarCollections, sidebarUser] = await Promise.all([
		getSidebarItemTypes(),
		getSidebarCollections(),
		getSidebarUser()
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
