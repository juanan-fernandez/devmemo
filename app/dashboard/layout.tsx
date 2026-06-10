import { DashboardLayoutShell } from '@/components/dashboard/dashboard-layout-shell'
import { getSidebarCollections } from '@/lib/db/collections'
import { getSidebarItemTypes } from '@/lib/db/items'

export default async function DashboardLayout({
	children
}: {
	children: React.ReactNode
}) {
	const [sidebarItemTypes, sidebarCollections] = await Promise.all([
		getSidebarItemTypes(),
		getSidebarCollections()
	])

	return (
		<DashboardLayoutShell sidebarItemTypes={sidebarItemTypes} sidebarCollections={sidebarCollections}>
			{children}
		</DashboardLayoutShell>
	)
}
