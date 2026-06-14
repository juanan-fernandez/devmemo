'use client'

import { ItemTypeIcon } from '@/lib/item-type-icons'
import type { DashboardItem } from '@/lib/db/items'
import { PinnedItemActions } from '@/components/dashboard/pinned-item-actions'

type ItemCardProps = {
	item: DashboardItem
}

export function ItemCard({ item }: ItemCardProps) {
	return (
		<div
			className='group rounded-xl border border-border bg-card transition-colors hover:bg-accent/50'
			style={{ borderLeftColor: item.type.color ?? undefined, borderLeftWidth: '4px' }}
		>
			<div className='flex items-start justify-between p-4'>
				<div className='flex min-w-0 flex-1 items-start gap-3'>
					<span className='mt-0.5 shrink-0'>
						<ItemTypeIcon iconName={item.type.icon} className='size-5' color={item.type.color} />
					</span>
					<div className='min-w-0 space-y-1'>
						<h3 className='truncate text-sm font-medium text-foreground'>{item.title}</h3>
						{item.description ? (
							<p className='line-clamp-2 text-xs text-muted-foreground'>{item.description}</p>
						) : null}
						<div className='flex items-center gap-2 text-[11px] text-muted-foreground'>
							<span>{item.type.label}</span>
							{item.language ? (
								<>
									<span>·</span>
									<span>{item.language}</span>
								</>
							) : null}
						</div>
					</div>
				</div>
				<PinnedItemActions isFavorite={item.isFavorite} />
			</div>
		</div>
	)
}