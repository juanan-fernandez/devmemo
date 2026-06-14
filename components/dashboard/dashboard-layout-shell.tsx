'use client'

import { Menu, Search } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/dashboard/sidebar'
import type { SidebarItemType } from '@/lib/db/items'
import type { SidebarCollectionsData } from '@/lib/db/collections'
import type { SidebarUser } from '@/lib/db/user'

type DashboardLayoutShellProps = {
	children: React.ReactNode
	sidebarItemTypes: SidebarItemType[]
	sidebarCollections: SidebarCollectionsData
	sidebarUser: SidebarUser | null
}

export function DashboardLayoutShell({
	children,
	sidebarItemTypes,
	sidebarCollections,
	sidebarUser
}: DashboardLayoutShellProps) {
	const [collapsed, setCollapsed] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)

	return (
		<div className='flex h-dvh'>
			<Sidebar
				collapsed={collapsed}
				mobileOpen={mobileOpen}
				onToggleCollapse={() => setCollapsed(!collapsed)}
				onCloseMobile={() => setMobileOpen(false)}
				itemTypes={sidebarItemTypes}
				collections={sidebarCollections}
				user={sidebarUser}
			/>
			<div className='flex min-w-0 flex-1 flex-col'>
				<header className='flex shrink-0 items-center gap-4 border-b border-border px-4 py-3 md:px-6'>
					<Button
						variant='ghost'
						size='icon'
						className='md:hidden'
						onClick={() => setMobileOpen(!mobileOpen)}
					>
						<Menu className='size-5' />
					</Button>
					<div className='relative ml-auto max-w-md flex-1'>
						<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
						<Input type='search' placeholder='Buscar snippets, comandos, notas...' className='pl-9' />
					</div>
				</header>
				<main className='flex-1 overflow-auto'>
				<div className='mx-auto max-w-5xl px-8 py-8 md:px-16 xl:px-24'>{children}</div>
			</main>
			</div>
		</div>
	)
}
