'use client'

import { useState } from 'react'
import {
	Columns3,
	LayoutList,
	Pin,
	PinOff,
	Star,
	Trash2,
	MoreHorizontal,
	Code2,
	Sparkles,
	TerminalSquare,
	NotebookPen,
	FileText,
	Image,
	Link
} from 'lucide-react'
import type { DashboardItem } from '@/lib/db/items'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ElementType> = {
	Braces: Code2,
	MessageSquare: Sparkles,
	Terminal: TerminalSquare,
	StickyNote: NotebookPen,
	FileText: FileText,
	Image: Image,
	Link: Link,
	'code-2': Code2,
	sparkles: Sparkles,
	'terminal-square': TerminalSquare,
	'notebook-pen': NotebookPen,
	'file-text': FileText,
	image: Image,
	link: Link
}


function getItemTypeIcon(iconName: string | null, color: string | null, className?: string) {
	if (!iconName) return <MoreHorizontal className={className} style={{ color: color ?? undefined }} />
	const Icon = iconMap[iconName] || MoreHorizontal
	return <Icon className={className} style={{ color: color ?? undefined }} />
}

export function PinnedSection({ items, title }: { items: DashboardItem[]; title: string }) {
	const [pinnedView, setPinnedView] = useState<'card' | 'list'>('card')

	return (
		<section>
			<div className='mb-4 flex items-center justify-between'>
				<h2 className='flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
					<Pin className='size-3.5' />
					{title}
				</h2>
				<div className='flex items-center gap-1 rounded-lg border border-border bg-card p-0.5'>
					<button
						onClick={() => setPinnedView('card')}
						className={cn(
							'rounded-md p-1.5 transition-colors',
							pinnedView === 'card'
								? 'bg-accent text-foreground'
								: 'text-muted-foreground hover:text-foreground'
						)}
						aria-label='Vista de tarjetas'
					>
						<Columns3 className='size-4' />
					</button>
					<button
						onClick={() => setPinnedView('list')}
						className={cn(
							'rounded-md p-1.5 transition-colors',
							pinnedView === 'list'
								? 'bg-accent text-foreground'
								: 'text-muted-foreground hover:text-foreground'
						)}
						aria-label='Vista de lista'
					>
						<LayoutList className='size-4' />
					</button>
				</div>
			</div>

			{items.length === 0 ? (
				<p className='text-sm text-muted-foreground'>No hay elementos fijados. Marca elementos como fijados para verlos aquí.</p>
			) : pinnedView === 'card' ? (
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{items.map(item => {
						return (
							<div
								key={item.id}
								className='group rounded-xl border border-border bg-card transition-colors hover:bg-accent/50'
							>
								<div className='flex items-start justify-between p-4'>
									<div className='flex min-w-0 flex-1 items-start gap-3'>
									<span className='mt-0.5 shrink-0'>
										{getItemTypeIcon(item.type.icon, item.type.color, 'size-5')}
									</span>
										<div className='min-w-0 space-y-1'>
											<h3 className='truncate text-sm font-medium text-foreground'>{item.title}</h3>
											{item.description && (
												<p className='line-clamp-2 text-xs text-muted-foreground'>{item.description}</p>
											)}
											<div className='flex items-center gap-2 text-[11px] text-muted-foreground'>
												<span>{item.type.label}</span>
												{item.language && (
													<>
														<span>·</span>
														<span>{item.language}</span>
													</>
												)}
											</div>
										</div>
									</div>
									<div className='flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
										<button
											className='rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
											aria-label='Favorito'
										>
											<Star
												className={cn('size-4', item.isFavorite && 'fill-yellow-500 text-yellow-500')}
											/>
										</button>
										<button
											className='rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
											aria-label='Desfijar'
										>
											<PinOff className='size-4' />
										</button>
										<button
											className='rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-destructive'
											aria-label='Eliminar'
										>
											<Trash2 className='size-4' />
										</button>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			) : (
				<div className='divide-y divide-border overflow-hidden rounded-xl border border-border'>
					{items.map(item => {
						return (
							<div
								key={item.id}
								className='group flex items-center gap-3 bg-card px-4 py-3 transition-colors hover:bg-accent/50'
							>
							<span className='shrink-0'>
								{getItemTypeIcon(item.type.icon, item.type.color, 'size-4')}
							</span>
								<div className='flex min-w-0 flex-1 items-center gap-3'>
									<span className='truncate text-sm font-medium text-foreground'>{item.title}</span>
									<span className='shrink-0 text-xs text-muted-foreground'>{item.type.label}</span>
									{item.language && (
										<span className='shrink-0 text-xs text-muted-foreground'>{item.language}</span>
									)}
								</div>
								<div className='flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
									<button
										className='rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
										aria-label='Favorito'
									>
										<Star className={cn('size-4', item.isFavorite && 'fill-yellow-500 text-yellow-500')} />
									</button>
									<button
										className='rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
										aria-label='Desfijar'
									>
										<PinOff className='size-4' />
									</button>
									<button
										className='rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-destructive'
										aria-label='Eliminar'
									>
										<Trash2 className='size-4' />
									</button>
								</div>
							</div>
						)
					})}
				</div>
			)}
		</section>
	)
}
