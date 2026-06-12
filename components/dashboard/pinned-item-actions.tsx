import { PinOff, Star, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type PinnedItemActionsProps = {
	isFavorite: boolean
}

export function PinnedItemActions({ isFavorite }: PinnedItemActionsProps) {
	return (
		<div className='flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
			<button
				className='rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
				aria-label='Favorito'
			>
				<Star className={cn('size-4', isFavorite && 'fill-yellow-500 text-yellow-500')} />
			</button>
			<button
				className='rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
				aria-label='Desfijar'
			>
				<PinOff className='size-4' />
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
