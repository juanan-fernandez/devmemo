'use client'

import { Pin, Star } from 'lucide-react'
import { startTransition, useOptimistic } from 'react'
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
	refreshOnSuccess?: boolean
	onStatusChange?: (nextState: { isFavorite?: boolean; isPinned?: boolean }) => void
}

export function ItemActions({
	itemId,
	itemTitle,
	isFavorite,
	isPinned,
	onDelete,
	refreshOnSuccess = true,
	onStatusChange
}: ItemActionsProps) {
	const router = useRouter()
	const [favoriteState, setFavoriteState] = useOptimistic(isFavorite)
	const [pinnedState, setPinnedState] = useOptimistic(isPinned)

	async function handleToggleFavorite() {
		const optimisticState = !favoriteState

		startTransition(() => {
			setFavoriteState(optimisticState)
		})

		const result = await toggleFavoriteAction(itemId, favoriteState, {})

		if (!result.successful) {
			startTransition(() => {
				setFavoriteState(isFavorite)
			})
			alert(result.error || 'Error al actualizar favorito')
			return
		}

		onStatusChange?.({ isFavorite: optimisticState })

		if (refreshOnSuccess) {
			router.refresh()
		}
	}

	async function handleTogglePinned() {
		const optimisticState = !pinnedState

		startTransition(() => {
			setPinnedState(optimisticState)
		})

		const result = await togglePinnedAction(itemId, pinnedState, {})

		if (!result.successful) {
			startTransition(() => {
				setPinnedState(isPinned)
			})
			alert(result.error || 'Error al actualizar fijado')
			return
		}

		onStatusChange?.({ isPinned: optimisticState })

		if (refreshOnSuccess) {
			router.refresh()
		}
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
				className={cn(
					'rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
					pinnedState && 'text-sky-500 hover:text-sky-500'
				)}
				aria-label={pinnedState ? 'Quitar item fijado' : 'Fijar item'}
				onClick={handleTogglePinned}
			>
				<Pin className='size-4' />
			</button>
			<DeleteItemDialog itemId={itemId} itemTitle={itemTitle} onDelete={onDelete} />
		</div>
	)
}
