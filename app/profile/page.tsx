import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import { ProfileContent } from '@/components/profile/profile-content'
import { DashboardLayoutShell } from '@/components/dashboard/dashboard-layout-shell'
import { getSidebarCollections } from '@/lib/db/collections'
import { getSidebarItemTypes } from '@/lib/db/items'
import { getUserProfile, getUserUsageStats } from '@/lib/db/profile'
import { getSidebarUser } from '@/lib/db/user'

export default async function ProfilePage() {
	const session = await auth()

	if (!session?.user?.id) {
		redirect('/login')
	}

	const userId = session.user.id

	const [sidebarItemTypes, sidebarCollections, sidebarUser, profile, stats] = await Promise.all([
		getSidebarItemTypes(userId),
		getSidebarCollections(userId),
		getSidebarUser(userId),
		getUserProfile(userId),
		getUserUsageStats(userId)
	])

	if (!profile) {
		return null
	}

	return (
		<DashboardLayoutShell
			sidebarItemTypes={sidebarItemTypes}
			sidebarCollections={sidebarCollections}
			sidebarUser={sidebarUser}
		>
			<ProfileContent profile={profile} stats={stats} />
		</DashboardLayoutShell>
	)
}
