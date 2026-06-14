'use client'

import { Pin, PinOff, Star } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { toggleFavoriteAction } from '@/actions/items/toggle-favorite'
import { togglePinnedAction } from '@/actions/items/toggle-pinned'
import { DeleteItemDialog } from '@/components/items/delete-item-dialog'
import { cn } from '@/lib/utils'

type ItemActionsProps = {
	itemId: string
	itemTitle: string
	isFavorite: boolean
	isPinned: boolean
	onDelete: () => void
}

export function ItemActions({ itemId, itemTitle, isFavorite, isPinned, onDelete }: ItemActionsProps) {
	const router = useRouter()
	const [favoriteState, setFavoriteState] = useState(isFavorite)
	const [pinnedState, setPinnedState] = useState(isPinned)

	async function handleToggleFavorite() {
		const optimisticState = !favoriteState
		setFavoriteState(optimisticState)

		const result = await toggleFavoriteAction(itemId, favoriteState, {})

		if (!result.successful) {
			setFavoriteState(isFavorite)
			alert(result.error || 'Error al actualizar favorito')
			return
		}

		router.refresh()
	}

	async function handleTogglePinned() {
		const optimisticState = !pinnedState
		setPinnedState(optimisticState)

		const result = await togglePinnedAction(itemId, pinnedState, {})

		if (!result.successful) {
			setPinnedState(isPinned)
			alert(result.error || 'Error al actualizar fijado')
			return
		}

		router.refresh()
	}

	return (
		<div
			className='flex shrink-0 items-center gap-1'
			onClick={event => event.stopPropagation()}
			onKeyDown={event => event.stopPropagation()}
		>
			<button
				type='button'
				className='rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
				aria-label={favoriteState ? 'Quitar de favoritos' : 'Marcar como favorito'}
				onClick={handleToggleFavorite}
			>
				<Star className={cn('size-4', favoriteState && 'fill-yellow-500 text-yellow-500')} />
			</button>
			<button
				type='button'
				className='rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
				aria-label={pinnedState ? 'Quitar item fijado' : 'Fijar item'}
				onClick={handleTogglePinned}
			>
				{pinnedState ? <PinOff className='size-4' /> : <Pin className='size-4' />}
			</button>
			<DeleteItemDialog itemId={itemId} itemTitle={itemTitle} onDelete={onDelete} />
		</div>
	)
}
