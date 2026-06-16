'use client'

import { ItemTypeIcon } from '@/lib/item-type-icons'
import type { DashboardItem } from '@/lib/db/items'
import { ItemActions } from '@/components/items/item-actions'
import { ItemDetailSheet } from '@/components/items/item-detail-sheet'
import { useItemRow } from '@/components/items/hooks/use-item-row'

type ItemCardProps = {
	item: DashboardItem
}

export function ItemCard({ item }: ItemCardProps) {
	const { isDeleted, showMessage, sheetSession, sheetOpen, setSheetOpen, handleDelete, handleOpenSheet } =
		useItemRow()

	if (isDeleted) {
		return showMessage ? (
			<div className='rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-center text-sm text-green-600'>
				Item eliminado correctamente.
			</div>
		) : null
	}

	return (
		<>
			<div
				className='group cursor-pointer rounded-xl border border-border bg-card transition-colors hover:bg-accent/50'
				style={{ borderLeftColor: item.type.color ?? undefined, borderLeftWidth: '4px' }}
				onClick={handleOpenSheet}
				onKeyDown={event => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault()
						handleOpenSheet()
					}
				}}
				role='button'
				tabIndex={0}
			>
				<div className='flex items-center justify-between px-5 pt-4'>
					<span className='shrink-0'>
						<ItemTypeIcon iconName={item.type.icon} className='size-5' color={item.type.color} />
					</span>
					<ItemActions
						itemId={item.id}
						itemTitle={item.title}
						isFavorite={item.isFavorite}
						isPinned={item.isPinned}
						onDelete={handleDelete}
					/>
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

			<ItemDetailSheet
				key={`${item.id}-${sheetSession}`}
				item={item}
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				onDelete={handleDelete}
			/>
		</>
	)
}
