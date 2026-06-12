'use client'

import { ItemTypeIcon } from '@/lib/item-type-icons'
import type { DashboardItem } from '@/lib/db/items'
import { PinnedItemActions } from '@/components/dashboard/pinned-item-actions'

type PinnedItemRowProps = {
	item: DashboardItem
}

export function PinnedItemRow({ item }: PinnedItemRowProps) {
	return (
		<div className='group flex items-center gap-3 bg-card px-4 py-3 transition-colors hover:bg-accent/50'>
			<span className='shrink-0'>
				<ItemTypeIcon iconName={item.type.icon} className='size-4' color={item.type.color} />
			</span>
			<div className='flex min-w-0 flex-1 items-center gap-3'>
				<span className='truncate text-sm font-medium text-foreground'>{item.title}</span>
				<span className='shrink-0 text-xs text-muted-foreground'>{item.type.label}</span>
				{item.language ? <span className='shrink-0 text-xs text-muted-foreground'>{item.language}</span> : null}
			</div>
			<PinnedItemActions isFavorite={item.isFavorite} />
		</div>
	)
}
