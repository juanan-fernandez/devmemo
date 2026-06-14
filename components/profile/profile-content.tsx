'use client'

import { CalendarDays, Key } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

import { ChangePasswordForm } from '@/components/profile/change-password-form'
import { DeleteAccountDialog } from '@/components/profile/delete-account-dialog'
import { UsageStatsCard } from '@/components/profile/usage-stats-card'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { ProfileUserData, UsageStats } from '@/lib/db/profile'

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

type ProfileContentProps = {
	profile: ProfileUserData
	stats: UsageStats
}

export function ProfileContent({ profile, stats }: ProfileContentProps) {
	const [showForm, setShowForm] = useState(false)
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const handleSuccess = useCallback(() => {
		if (timerRef.current) clearTimeout(timerRef.current)

		timerRef.current = setTimeout(() => {
			setShowForm(false)
		}, 4000)
	}, [])

	const handleOpenForm = useCallback(() => {
		setShowForm(true)
	}, [])

	return (
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
						{profile.hasPassword && !showForm && (
							<Button
								variant='outline'
								size='sm'
								className='rounded-xl'
								onClick={handleOpenForm}
							>
								<Key className='size-3.5' />
								Cambiar contraseña
							</Button>
						)}
						<DeleteAccountDialog email={profile.email} />
					</div>
				</div>
			</section>

			{profile.hasPassword && showForm && (
				<section className='rounded-2xl border border-border bg-card p-6'>
					<h2 className='mb-5 text-lg font-semibold text-foreground'>Cambiar contraseña</h2>
					<ChangePasswordForm onSuccess={handleSuccess} />
				</section>
			)}

			<UsageStatsCard stats={stats} />
		</div>
	)
}
