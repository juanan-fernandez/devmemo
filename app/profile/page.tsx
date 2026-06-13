import { CalendarDays, Key, Trash2 } from 'lucide-react'

import { auth } from '@/auth/auth'
import { ChangePasswordForm } from '@/components/profile/change-password-form'
import { UsageStatsCard } from '@/components/profile/usage-stats-card'
import { DashboardLayoutShell } from '@/components/dashboard/dashboard-layout-shell'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getSidebarCollections } from '@/lib/db/collections'
import { getSidebarItemTypes } from '@/lib/db/items'
import { getUserProfile, getUserUsageStats } from '@/lib/db/profile'
import { getSidebarUser } from '@/lib/db/user'

const MONTHS_ES = [
	'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
	'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
]

function formatDate(date: Date): string {
	const day = date.getDate()
	const month = MONTHS_ES[date.getMonth()]
	const year = date.getFullYear()
	return `${day} de ${month}, ${year}`
}

export default async function ProfilePage() {
	const session = await auth()
	const userId = session?.user?.id

	if (!userId) {
		return null
	}

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
			<div className='mx-auto max-w-2xl space-y-8 p-6 md:p-10'>
				<h1 className='text-2xl font-bold tracking-tight text-foreground'>Tu perfil</h1>

				<section className='rounded-2xl border border-border bg-card p-6'>
					<div className='flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between'>
						<div className='flex items-start gap-4'>
							<div className='size-16 shrink-0 overflow-hidden rounded-full border border-border/70 bg-background'>
								<Avatar
									src={profile.image}
									name={profile.name}
									email={profile.email}
									size={64}
									className='size-16'
								/>
							</div>
							<div className='space-y-1'>
								<p className='text-lg font-semibold text-foreground'>
									{profile.name?.trim() || 'Usuario'}
								</p>
								<p className='text-sm text-muted-foreground'>{profile.email}</p>
								<div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
									<CalendarDays className='size-3.5' />
									<span>Miembro desde {formatDate(profile.createdAt)}</span>
								</div>
							</div>
						</div>

						<div className='flex shrink-0 flex-col gap-2 sm:items-end'>
							{profile.hasPassword && (
								<a href='#cambiar-contraseña'>
									<Button variant='outline' size='sm' className='rounded-xl'>
										<Key className='size-3.5' />
										Cambiar contraseña
									</Button>
								</a>
							)}
							<Button variant='outline' size='sm' disabled className='rounded-xl opacity-50'>
								<Trash2 className='size-3.5' />
								Eliminar cuenta
							</Button>
						</div>
					</div>
				</section>

				{profile.hasPassword && (
					<section id='cambiar-contraseña' className='rounded-2xl border border-border bg-card p-6'>
						<h2 className='mb-5 text-lg font-semibold text-foreground'>Cambiar contraseña</h2>
						<ChangePasswordForm />
					</section>
				)}

				<UsageStatsCard stats={stats} />
			</div>
		</DashboardLayoutShell>
	)
}
