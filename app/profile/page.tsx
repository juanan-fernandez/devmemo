import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import { ProfileContent } from '@/components/profile/profile-content'
import { DashboardLayoutShell } from '@/components/dashboard/dashboard-layout-shell'
import { getSidebarBootstrap } from '@/lib/sidebar-bootstrap'
import { getUserProfile, getUserUsageStats } from '@/lib/db/profile'

export default async function ProfilePage() {
	const session = await auth()

	if (!session?.user?.id) {
		redirect('/login')
	}

	const userId = session.user.id

	const [sidebarBootstrap, profile, stats] = await Promise.all([
		getSidebarBootstrap(userId),
		getUserProfile(userId),
		getUserUsageStats(userId)
	])

	if (!profile) {
		return null
	}

	return (
		<DashboardLayoutShell
			sidebarItemTypes={sidebarBootstrap.sidebarItemTypes}
			sidebarCollections={sidebarBootstrap.sidebarCollections}
			sidebarUser={sidebarBootstrap.sidebarUser}
			searchIndex={sidebarBootstrap.searchIndex}
		>
			<ProfileContent profile={profile} stats={stats} />
		</DashboardLayoutShell>
	)
}
