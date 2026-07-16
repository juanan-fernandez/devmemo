'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { LoaderCircle } from 'lucide-react'

import { loadMoreItemsAction } from '@/actions/items/load-more-items'
import type { DashboardItem, ItemSort } from '@/lib/db/items'
import { useInfiniteScroll } from '@/lib/hooks/use-infinite-scroll'
import { ItemCard } from '@/components/items/item-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type ItemListProps = {
	initialItems: DashboardItem[]
	initialNextCursor: string | null
}

const SORT_OPTIONS: { value: ItemSort; label: string }[] = [
	{ value: 'createdAt-desc', label: 'Más recientes primero' },
	{ value: 'createdAt-asc', label: 'Más antiguas primero' },
	{ value: 'title-asc', label: 'Nombre A-Z' },
	{ value: 'title-desc', label: 'Nombre Z-A' }
]

export function ItemList({ initialItems, initialNextCursor }: ItemListProps) {
	const [sort, setSort] = useState<ItemSort>('createdAt-desc')
	const sortRef = useRef(sort)

	useEffect(() => {
		sortRef.current = sort
	}, [sort])

	const loadMore = useCallback(
		async (cursor: string | null) => {
			const result = await loadMoreItemsAction(sortRef.current, cursor)
			return { items: result.items, nextCursor: result.nextCursor }
		},
		[]
	)

	const { items, isLoadingMore, hasMore, sentinelRef, reset } = useInfiniteScroll({
		initialItems,
		initialNextCursor,
		loadMore
	})

	const prevInitialIdsRef = useRef<string | null>(null)
	useEffect(() => {
		const currentSignature = initialItems
			.map(i => `${i.id}:${i.isFavorite}:${i.isPinned}:${i.title}:${i.description ?? ''}:${i.language ?? ''}`)
			.sort()
			.join('|')
		const prevIds = prevInitialIdsRef.current

		if (prevIds !== null && currentSignature !== prevIds) {
			reset(initialItems, initialNextCursor)
		}

		prevInitialIdsRef.current = currentSignature
	}, [initialItems, initialNextCursor, reset])

	function handleSortChange(value: string) {
		const newSort = value as ItemSort
		setSort(newSort)

		loadMoreItemsAction(newSort, null).then(result => {
			reset(result.items, result.nextCursor)
		})
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-xl font-semibold text-foreground'>Items</h1>
				<div className='flex items-center gap-2'>
					<label htmlFor='item-sort' className='text-xs text-muted-foreground'>
						Ordenar por
					</label>
					<Select value={sort} onValueChange={handleSortChange}>
						<SelectTrigger id='item-sort' className='w-44'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{SORT_OPTIONS.map(option => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{items.length === 0 ? (
				<div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center'>
					<p className='text-sm text-muted-foreground'>No tienes items todavía.</p>
				</div>
			) : (
				<>
					<div className='grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3'>
						{items.map(item => (
							<ItemCard key={item.id} item={item} />
						))}
					</div>

					<div ref={sentinelRef} className='h-1' />

					{isLoadingMore && (
						<div className='flex items-center justify-center py-6 text-sm text-muted-foreground'>
							<LoaderCircle className='mr-2 size-4 animate-spin' />
							Cargando más items...
						</div>
					)}

					{!hasMore && items.length > 9 && (
						<p className='py-4 text-center text-xs text-muted-foreground'>No hay más items.</p>
					)}
				</>
			)}
		</div>
	)
}
