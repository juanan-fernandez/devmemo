'use client'

import {
	ChevronRight,
	Folder,
	PanelLeftClose,
	PanelLeftOpen,
	Star
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { SidebarUser } from '@/lib/db/user'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import type { SidebarItemType } from '@/lib/db/items'
import type { SidebarCollectionsData } from '@/lib/db/collections'
import { ItemTypeIcon } from '@/lib/item-type-icons'
import { UserProfile } from '@/components/dashboard/user-profile'

export type SidebarProps = {
	collapsed: boolean
	mobileOpen: boolean
	onToggleCollapse: () => void
	onCloseMobile: () => void
	itemTypes: SidebarItemType[]
	collections: SidebarCollectionsData
	user: SidebarUser | null
}

export function Sidebar({
	collapsed,
	mobileOpen,
	onToggleCollapse,
	onCloseMobile,
	itemTypes,
	collections,
	user
}: SidebarProps) {
	const [collectionsOpen, setCollectionsOpen] = useState(true)

	return (
		<>
			{mobileOpen && <div className='fixed inset-0 z-40 bg-black/50 md:hidden' onClick={onCloseMobile} />}

			<aside
				className={cn(
					'fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 md:relative md:inset-auto',
					collapsed ? 'w-[72px]' : 'w-[240px]',
					mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
				)}
			>
				<div
					className={cn(
						'flex shrink-0 items-center border-b border-sidebar-border px-3 py-3',
						collapsed ? 'justify-center' : 'justify-between'
					)}
				>
					{!collapsed && <span className='font-heading text-base font-bold text-sidebar-foreground'>DevMemo</span>}
					<Button
						variant='ghost'
						size='icon'
						onClick={onToggleCollapse}
						className='text-sidebar-foreground/60 hover:text-sidebar-foreground'
					>
						{collapsed ? <PanelLeftClose className='size-5' /> : <PanelLeftOpen className='size-5' />}
					</Button>
				</div>

				<nav className='flex-1 overflow-y-auto px-2 py-3'>
					<ul className='space-y-1'>
						{itemTypes.map(type => {
							return (
								<li key={type.id}>
									<Link
										href={type.href}
										className={cn(
											'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground',
											collapsed && 'justify-center px-0'
										)}
										title={collapsed ? type.name : undefined}
									>
										<ItemTypeIcon iconName={type.icon} className='size-5 shrink-0' color={type.color} />
										{!collapsed && <span>{type.name}</span>}
										{!collapsed && (
											<span className='ml-auto text-right text-xs text-sidebar-foreground/50'>
												{type.itemCount}
											</span>
										)}
									</Link>
								</li>
							)
						})}
					</ul>

					{!collapsed && (
						<div className='mt-4'>
							<button
								onClick={() => setCollectionsOpen(!collectionsOpen)}
								className='flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 transition-colors hover:text-sidebar-foreground'
							>
								<ChevronRight className={cn('size-3 transition-transform', collectionsOpen && 'rotate-90')} />
								Colecciones
							</button>

							{collectionsOpen && (
								<ul className='mt-1 space-y-0.5'>
									<li>
										<Link
											href='/collections/favorites'
											className='flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-sidebar-foreground/50 transition-colors hover:text-sidebar-foreground'
										>
											<Star className='size-4 shrink-0' />
											Ver favoritas ({collections.favoriteCollectionsCount})
										</Link>
									</li>
									<li>
										<Link
											href='/collections'
											className='flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-sidebar-foreground/50 transition-colors hover:text-sidebar-foreground'
										>
											<Folder className='size-4 shrink-0' />
											Ver todas
										</Link>
									</li>
									{collections.recentCollections.map(collection => (
										<li key={collection.id}>
											<Link
												href={`/collections/${collection.id}`}
												className='flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground'
											>
												<span
													className='size-1.5 shrink-0 rounded-full bg-sidebar-foreground/30'
													style={
														collection.predominantTypeColor
															? { backgroundColor: collection.predominantTypeColor }
															: undefined
													}
												/>
												<span className='truncate'>{collection.name}</span>
											</Link>
										</li>
									))}
								</ul>
							)}
						</div>
					)}
				</nav>

				<div
					className={cn(
						'flex shrink-0 border-t border-sidebar-border p-3',
						collapsed && 'justify-center'
					)}
				>
					<UserProfile user={user} collapsed={collapsed} />
				</div>
			</aside>
		</>
	)
}
