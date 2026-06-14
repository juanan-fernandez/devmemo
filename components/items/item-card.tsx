'use client'

import { ItemTypeIcon } from '@/lib/item-type-icons'
import type { DashboardItem } from '@/lib/db/items'
import { ItemActions } from '@/components/items/item-actions'

type ItemCardProps = {
	item: DashboardItem
}

export function ItemCard({ item }: ItemCardProps) {
	return (
		<div
			className='group rounded-xl border border-border bg-card transition-colors hover:bg-accent/50'
			style={{ borderLeftColor: item.type.color ?? undefined, borderLeftWidth: '4px' }}
		>
			<div className='flex items-center justify-between px-5 pt-4'>
				<span className='shrink-0'>
					<ItemTypeIcon iconName={item.type.icon} className='size-5' color={item.type.color} />
				</span>
				<ItemActions isFavorite={item.isFavorite} isPinned={item.isPinned} />
			</div>
			<div className='px-5 pb-4 pt-1'>
				<h3 className='truncate text-base font-medium text-foreground'>{item.title}</h3>
				{item.description ? (
					<p className='mt-0.5 line-clamp-2 text-sm text-muted-foreground'>{item.description}</p>
				) : null}
				<div className='mt-1 flex items-center gap-2 text-xs text-muted-foreground'>
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
	)
}