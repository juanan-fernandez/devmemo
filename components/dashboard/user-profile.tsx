'use client'

import { LoaderCircle, LogOut } from 'lucide-react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { SidebarUser } from '@/lib/db/user'
import { cn } from '@/lib/utils'

type UserProfileProps = {
	user: SidebarUser | null
	collapsed: boolean
}

export function UserProfile({ user, collapsed }: UserProfileProps) {
	const [isSigningOut, setIsSigningOut] = useState(false)

	async function handleSignOut() {
		setIsSigningOut(true)
		await signOut({ redirectTo: '/' })
		setIsSigningOut(false)
	}

	return (
		<div className={cn('space-y-3', collapsed && 'w-full')}>
			<Link
				href='/profile'
				className={cn(
					'flex items-center gap-3 rounded-2xl border border-sidebar-border/80 bg-sidebar-accent/50 p-3 transition hover:border-sidebar-ring hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
					collapsed && 'justify-center'
				)}
			>
				<Avatar
					src={user?.image}
					name={user?.name}
					email={user?.email}
					size={44}
					className='size-11 border border-sidebar-border/70'
				/>

				{!collapsed ? (
					<div className='min-w-0 flex-1'>
						<p className='truncate text-sm font-semibold text-sidebar-foreground'>
							{user?.name?.trim() || 'Tu perfil'}
						</p>
						<p className='truncate text-xs text-sidebar-foreground/65'>{user?.email ?? 'Sin correo disponible'}</p>
					</div>
				) : (
					<span className='sr-only'>Ir a tu perfil</span>
				)}
			</Link>

			<Button
				type='button'
				variant='ghost'
				onClick={handleSignOut}
				disabled={isSigningOut}
				className={cn(
					'h-11 w-full rounded-2xl border border-transparent px-3 text-sidebar-foreground/72 hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-foreground',
					collapsed && 'justify-center px-0'
				)}
				aria-label='Cerrar sesión'
			>
				{isSigningOut ? <LoaderCircle className='size-4 animate-spin' /> : <LogOut className='size-4' />}
				{!collapsed ? <span>Cerrar sesión</span> : <span className='sr-only'>Cerrar sesión</span>}
			</Button>
		</div>
	)
}
