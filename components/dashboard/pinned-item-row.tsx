'use client'

import { ItemTypeIcon } from '@/lib/item-type-icons'
import type { DashboardItem } from '@/lib/db/items'
import { ItemActions } from '@/components/items/item-actions'
import { ItemDetailSheet } from '@/components/items/item-detail-sheet'
import { useItemRow } from '@/components/items/hooks/use-item-row'

type PinnedItemRowProps = {
	item: DashboardItem
}

export function PinnedItemRow({ item }: PinnedItemRowProps) {
	const { isDeleted, showMessage, sheetSession, sheetOpen, setSheetOpen, handleDelete, handleOpenSheet } =
		useItemRow()

	if (isDeleted) {
		return showMessage ? (
			<div className='rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-center text-sm text-green-600'>
				Item eliminado correctamente.
			</div>
		) : null
	}

	return (
		<>
			<div
				className='group cursor-pointer flex items-center gap-3 bg-card px-4 py-3 transition-colors hover:bg-accent/50'
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
				<span className='shrink-0'>
					<ItemTypeIcon iconName={item.type.icon} className='size-4' color={item.type.color} />
				</span>
				<div className='flex min-w-0 flex-1 items-center gap-3'>
					<span className='truncate text-sm font-medium text-foreground'>{item.title}</span>
					<span className='shrink-0 text-xs text-muted-foreground'>{item.type.label}</span>
					{item.language ? <span className='shrink-0 text-xs text-muted-foreground'>{item.language}</span> : null}
				</div>
				<ItemActions
					itemId={item.id}
					itemTitle={item.title}
					isFavorite={item.isFavorite}
					isPinned={item.isPinned}
					onDelete={handleDelete}
				/>
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
