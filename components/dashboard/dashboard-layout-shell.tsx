'use client'

import { FolderPlus, Menu, Search } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CreateCollectionDialog } from '@/components/collections/create-collection-dialog'
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
					<Button variant='ghost' size='icon' className='md:hidden shrink-0' onClick={() => setMobileOpen(!mobileOpen)}>
						<Menu className='size-5' />
					</Button>
					<div className='flex flex-1 justify-center min-w-0'>
						<div className='relative w-full max-w-md'>
							<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
							<Input type='search' placeholder='Buscar snippets, comandos, notas...' className='pl-9' />
						</div>
					</div>
					<CreateCollectionDialog>
						<Button className='gap-2 shrink-0'>
							<FolderPlus className='size-4' />
							Nueva Colección
						</Button>
					</CreateCollectionDialog>
				</header>
				<main className='flex-1 overflow-auto'>
					<div className='mx-auto max-w-5xl px-6 py-6 md:px-12 xl:px-20'>{children}</div>
				</main>
			</div>
		</div>
	)
}
