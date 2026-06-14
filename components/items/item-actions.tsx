import { Pin, PinOff, Star, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ItemActionsProps = {
	isFavorite: boolean
	isPinned: boolean
}

export function ItemActions({ isFavorite, isPinned }: ItemActionsProps) {
	return (
		<div className='flex shrink-0 items-center gap-1'>
			<button
				className='rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
				aria-label='Favorito'
			>
				<Star className={cn('size-4', isFavorite && 'fill-yellow-500 text-yellow-500')} />
			</button>
			<button
				className='rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
				aria-label={isPinned ? 'Desfijar' : 'Fijar'}
			>
				{isPinned ? <PinOff className='size-4' /> : <Pin className='size-4' />}
			</button>
			<button
				className='rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-destructive'
				aria-label='Eliminar'
			>
				<Trash2 className='size-4' />
			</button>
		</div>
	)
}