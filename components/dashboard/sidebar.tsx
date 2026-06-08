'use client'

import {
	ChevronRight,
	Code2,
	FileText,
	Image,
	Link,
	MoreHorizontal,
	NotebookPen,
	PanelLeftClose,
	PanelLeftOpen,
	Sparkles,
	Star,
	TerminalSquare,
	User
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockCollections, mockItemTypes, mockUser } from '@/lib/mockdata'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const iconMap: Record<string, React.ElementType> = {
	'code-2': Code2,
	sparkles: Sparkles,
	'terminal-square': TerminalSquare,
	'notebook-pen': NotebookPen,
	'file-text': FileText,
	image: Image,
	link: Link
}

const latestCollections = [...mockCollections]
	.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
	.slice(0, 3)

const favoriteCollectionsCount = mockCollections.filter(collection => collection.isFavorite).length

export type SidebarProps = {
	collapsed: boolean
	mobileOpen: boolean
	onToggleCollapse: () => void
	onCloseMobile: () => void
}

export function Sidebar({ collapsed, mobileOpen, onToggleCollapse, onCloseMobile }: SidebarProps) {
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
						{mockItemTypes.map(type => {
							const Icon = iconMap[type.icon] || MoreHorizontal
							return (
								<li key={type.id}>
									<button
										className={cn(
											'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground',
											collapsed && 'justify-center px-0'
										)}
										title={collapsed ? type.name : undefined}
									>
										<Icon className='size-5 shrink-0' style={{ color: type.color }} />
										{!collapsed && <span>{type.name}</span>}
									</button>
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
									{latestCollections.map(col => (
										<li key={col.id}>
											<button className='flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground'>
												<span className='size-1.5 shrink-0 rounded-full bg-sidebar-foreground/30' />
												<span className='truncate'>{col.name}</span>
											</button>
										</li>
									))}
									<li>
										<button className='flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-sidebar-foreground/50 transition-colors hover:text-sidebar-foreground'>
											<Star className='size-4 shrink-0' />
											Ver favoritas ({favoriteCollectionsCount})
										</button>
									</li>
									<li>
										<button className='flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-sidebar-foreground/50 transition-colors hover:text-sidebar-foreground'>
											Ver todas
										</button>
									</li>
								</ul>
							)}
						</div>
					)}
				</nav>

				<div
					className={cn(
						'flex shrink-0 items-center border-t border-sidebar-border p-3',
						collapsed && 'justify-center'
					)}
				>
					<div className={cn('flex items-center gap-3', collapsed && 'flex-col')}>
						<div className='flex size-8 items-center justify-center rounded-full bg-sidebar-accent'>
							<User className='size-4 text-sidebar-foreground/60' />
						</div>
						{!collapsed && (
							<div className='min-w-0'>
								<p className='truncate text-sm font-medium text-sidebar-foreground'>{mockUser.email}</p>
								<p className='truncate text-xs text-sidebar-foreground/50'>Demo</p>
							</div>
						)}
					</div>
				</div>
			</aside>
		</>
	)
}
