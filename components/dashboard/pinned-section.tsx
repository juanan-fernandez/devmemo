'use client'

import { useState } from 'react'
import { Columns3, LayoutList, Pin } from 'lucide-react'
import type { DashboardItem } from '@/lib/db/items'
import { cn } from '@/lib/utils'
import { ItemCard } from '@/components/items/item-card'
import { PinnedItemRow } from '@/components/dashboard/pinned-item-row'

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
					{items.map(item => (
						<ItemCard key={item.id} item={item} />
					))}
				</div>
			) : (
				<div className='divide-y divide-border overflow-hidden rounded-xl border border-border'>
					{items.map(item => (
						<PinnedItemRow key={item.id} item={item} />
					))}
				</div>
			)}
		</section>
	)
}
