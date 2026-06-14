'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { ItemTypeIcon } from '@/lib/item-type-icons'
import type { DashboardItem } from '@/lib/db/items'
import { ItemActions } from '@/components/items/item-actions'
import { ItemDetailSheet } from '@/components/items/item-detail-sheet'

type PinnedItemRowProps = {
	item: DashboardItem
}

export function PinnedItemRow({ item }: PinnedItemRowProps) {
	const router = useRouter()
	const [isDeleted, setIsDeleted] = useState(false)
	const [showMessage, setShowMessage] = useState(false)
	const [sheetOpen, setSheetOpen] = useState(false)

	function handleDelete() {
		setSheetOpen(false)
		setIsDeleted(true)
		setShowMessage(true)

		setTimeout(() => {
			setShowMessage(false)
			router.refresh()
		}, 2000)
	}

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
				onClick={() => setSheetOpen(true)}
				onKeyDown={event => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault()
						setSheetOpen(true)
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

			<ItemDetailSheet item={item} open={sheetOpen} onOpenChange={setSheetOpen} onDelete={handleDelete} />
		</>
	)
}
