import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import { DashboardLayoutShell } from '@/components/dashboard/dashboard-layout-shell'
import { getSidebarBootstrap } from '@/lib/sidebar-bootstrap'

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

	const sidebarBootstrap = await getSidebarBootstrap(userId)

	return (
		<DashboardLayoutShell
			sidebarItemTypes={sidebarBootstrap.sidebarItemTypes}
			sidebarCollections={sidebarBootstrap.sidebarCollections}
			sidebarUser={sidebarBootstrap.sidebarUser}
			searchIndex={sidebarBootstrap.searchIndex}
		>
			{children}
		</DashboardLayoutShell>
	)
}
