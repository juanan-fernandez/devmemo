'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { FolderPlus, Menu, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CreateCollectionDialog } from '@/components/collections/create-collection-dialog'
import { NewItemMenu } from '@/components/dashboard/new-item-menu'
import { Sidebar } from '@/components/dashboard/sidebar'
import { GlobalSearch } from '@/components/search/global-search'
import type { SidebarItemType } from '@/lib/db/items'
import type { SidebarCollectionsData } from '@/lib/db/collections'
import type { SidebarUser } from '@/lib/db/user'
import type { SearchIndex } from '@/lib/db/search'

type DashboardLayoutShellProps = {
	children: React.ReactNode
	sidebarItemTypes: SidebarItemType[]
	sidebarCollections: SidebarCollectionsData
	sidebarUser: SidebarUser | null
	searchIndex?: SearchIndex
}

export function DashboardLayoutShell({
	children,
	sidebarItemTypes,
	sidebarCollections,
	sidebarUser,
	searchIndex
}: DashboardLayoutShellProps) {
	const [collapsed, setCollapsed] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)
	const [searchOpen, setSearchOpen] = useState(false)
	const searchInputRef = useRef<HTMLInputElement>(null)

	// Keyboard shortcut: Cmd+B / Ctrl+B
	// searchIndex is server-provided and never changes on the client
	const searchIndexRef = useRef(searchIndex)
	// eslint-disable-next-line react-hooks/refs
	searchIndexRef.current = searchIndex

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
				e.preventDefault()
				if (searchIndexRef.current) {
					setSearchOpen(true)
				}
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [])

	const handleSearchClick = useCallback(() => {
		if (searchIndex) {
			setSearchOpen(true)
		}
	}, [searchIndex])

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
						className='md:hidden shrink-0'
						onClick={() => setMobileOpen(!mobileOpen)}
					>
						<Menu className='size-5' />
					</Button>
					<div className='flex flex-1 justify-center min-w-0'>
						<div className='relative w-full max-w-md'>
							<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
							<Input
								ref={searchInputRef}
								type='search'
								placeholder={
									searchIndex
										? 'Buscar items o colecciones... Cmd+B / Ctrl+B'
										: 'Buscar snippets, comandos, notas...'
								}
								className='pl-9'
								readOnly
								onClick={searchIndex ? handleSearchClick : undefined}
								onFocus={searchIndex ? handleSearchClick : undefined}
							/>
						</div>
					</div>
					<NewItemMenu />
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

			{searchIndex && <GlobalSearch searchIndex={searchIndex} open={searchOpen} onOpenChange={setSearchOpen} />}
		</div>
	)
}
