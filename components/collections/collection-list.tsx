'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { FolderPlus, LoaderCircle } from 'lucide-react'

import { loadMoreCollectionsAction } from '@/actions/collections/load-more-collections'
import type { DashboardCollection, CollectionSort } from '@/lib/db/collections'
import { useInfiniteScroll } from '@/lib/hooks/use-infinite-scroll'
import { CreateCollectionDialog } from '@/components/collections/create-collection-dialog'
import { LatestCollectionCard } from '@/components/dashboard/latest-collection-card'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

type CollectionListProps = {
	initialCollections: DashboardCollection[]
	initialNextCursor: string | null
}

const SORT_OPTIONS: { value: CollectionSort; label: string }[] = [
	{ value: 'createdAt-desc', label: 'Más recientes primero' },
	{ value: 'createdAt-asc', label: 'Más antiguas primero' },
	{ value: 'name-asc', label: 'Nombre A-Z' },
	{ value: 'name-desc', label: 'Nombre Z-A' }
]

export function CollectionList({ initialCollections, initialNextCursor }: CollectionListProps) {
	const [sort, setSort] = useState<CollectionSort>('createdAt-desc')
	const sortRef = useRef(sort)

	useEffect(() => {
		sortRef.current = sort
	}, [sort])

	const loadMore = useCallback(
		async (cursor: string | null) => {
			const result = await loadMoreCollectionsAction(sort, cursor)
			return { items: result.collections, nextCursor: result.nextCursor }
		},
		[sort]
	)

	const { items, isLoadingMore, hasMore, sentinelRef, reset } = useInfiniteScroll({
		initialItems: initialCollections,
		initialNextCursor,
		loadMore
	})

	// When the server sends new initial data (e.g. after router.refresh() from
	// creating a collection), reset the local list so the new collection appears.
	const prevInitialIdsRef = useRef<string | null>(null)
	useEffect(() => {
		const currentIds = initialCollections.map(c => c.id).sort().join(',')
		const prevIds = prevInitialIdsRef.current

		if (prevIds !== null && currentIds !== prevIds) {
			reset(initialCollections, initialNextCursor)
		}

		prevInitialIdsRef.current = currentIds
	}, [initialCollections, initialNextCursor, reset])

	function handleSortChange(value: string) {
		const newSort = value as CollectionSort
		setSort(newSort)

		loadMoreCollectionsAction(newSort, null).then(result => {
			reset(result.collections, result.nextCursor)
		})
	}

	const handleCollectionCreated = useCallback(() => {
		loadMoreCollectionsAction(sortRef.current, null).then(result => {
			reset(result.collections, result.nextCursor)
		})
	}, [reset])

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-xl font-semibold text-foreground'>Colecciones</h1>
				<div className='flex items-center gap-2'>
					<label htmlFor='collection-sort' className='text-xs text-muted-foreground'>
						Ordenar por
					</label>
					<Select value={sort} onValueChange={handleSortChange}>
						<SelectTrigger id='collection-sort' className='w-44'>
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
					<p className='text-sm text-muted-foreground'>No tienes colecciones todavía.</p>
					<p className='mt-1 mb-4 text-xs text-muted-foreground'>
						Crea una nueva colección para organizar tus items.
					</p>
					<CreateCollectionDialog onSuccess={handleCollectionCreated}>
						<Button type='button' className='gap-2'>
							<FolderPlus className='size-4' />
							Nueva Colección
						</Button>
					</CreateCollectionDialog>
				</div>
			) : (
				<>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{items.map(collection => (
							<LatestCollectionCard key={collection.id} collection={collection} />
						))}
					</div>

					{/* Sentinel for intersection observer */}
					<div ref={sentinelRef} className='h-1' />

					{isLoadingMore && (
						<div className='flex items-center justify-center py-6 text-sm text-muted-foreground'>
							<LoaderCircle className='mr-2 size-4 animate-spin' />
							Cargando más colecciones...
						</div>
					)}

					{!hasMore && items.length > 0 && (
						<p className='py-4 text-center text-xs text-muted-foreground'>
							No hay más colecciones.
						</p>
					)}
				</>
			)}
		</div>
	)
}
