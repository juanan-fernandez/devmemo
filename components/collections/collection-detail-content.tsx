'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertTriangle, LoaderCircle, Pencil, Star, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { loadCollectionItemsAction } from '@/actions/collections/load-collection-items'
import { toggleCollectionFavoriteAction } from '@/actions/collections/toggle-collection-favorite'
import { deleteCollectionAction } from '@/actions/collections/delete-collection'
import type { DashboardCollection } from '@/lib/db/collections'
import type { DashboardItem } from '@/lib/db/items'
import { useInfiniteScroll } from '@/lib/hooks/use-infinite-scroll'
import { CANONICAL_SYSTEM_ITEM_TYPES } from '@/lib/item-types'
import { ItemTypeIcon } from '@/lib/item-type-icons'
import { ItemCard } from '@/components/items/item-card'
import { CollectionFormDialog } from '@/components/collections/create-collection-dialog'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type CollectionDetailContentProps = {
	collection: DashboardCollection
	initialItems: DashboardItem[]
	initialTotalCount: number
	initialFilteredCount: number
	initialNextCursor: string | null
}

const ALL_TYPES_VALUE = 'all'

const ITEM_TYPE_OPTIONS = [{ value: ALL_TYPES_VALUE, label: 'Todos los tipos', dbName: null as string | null }].concat(
	CANONICAL_SYSTEM_ITEM_TYPES.map(type => ({
		value: type.key,
		label: type.singularLabel,
		dbName: type.dbName
	}))
)

export function CollectionDetailContent({
	collection,
	initialItems,
	initialTotalCount,
	initialFilteredCount,
	initialNextCursor
}: CollectionDetailContentProps) {
	const router = useRouter()
	const [itemType, setItemType] = useState<string>(ALL_TYPES_VALUE)
	const itemTypeRef = useRef(itemType)
	const [filteredCount, setFilteredCount] = useState(initialFilteredCount)
	const [isFavorite, setIsFavorite] = useState(collection.isFavorite)
	const [editOpen, setEditOpen] = useState(false)
	const [deleteOpen, setDeleteOpen] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	useEffect(() => {
		itemTypeRef.current = itemType
	}, [itemType])

	const loadMore = useCallback(
		async (cursor: string | null) => {
			const result = await loadCollectionItemsAction(
				collection.id,
				itemTypeRef.current ? itemTypeRef.current : null,
				cursor
			)
			return { items: result.items, nextCursor: result.nextCursor }
		},
		[collection.id]
	)

	const { items, isLoadingMore, hasMore, sentinelRef, reset } = useInfiniteScroll({
		initialItems,
		initialNextCursor,
		loadMore
	})

	function handleTypeFilterChange(value: string) {
		setItemType(value)
		const dbName = value === ALL_TYPES_VALUE ? null : (ITEM_TYPE_OPTIONS.find(o => o.value === value)?.dbName ?? null)
		loadCollectionItemsAction(collection.id, dbName, null).then(result => {
			reset(result.items, result.nextCursor)
			setFilteredCount(result.filteredCount)
		})
	}

	// Detect server-side refresh (e.g. after creating an item in this collection)
	const prevInitialIdsRef = useRef<string | null>(null)
	useEffect(() => {
		const currentIds = initialItems.map(i => i.id).sort().join(',')
		if (prevInitialIdsRef.current !== null && currentIds !== prevInitialIdsRef.current) {
			reset(initialItems, initialNextCursor)
		}
		prevInitialIdsRef.current = currentIds
	}, [initialItems, initialNextCursor, reset])

	// --- Favorite toggle ---
	async function handleToggleFavorite() {
		const previous = isFavorite
		setIsFavorite(!previous)

		const result = await toggleCollectionFavoriteAction(collection.id)

		if (result.error) {
			setIsFavorite(previous)
		}
	}

	// --- Delete ---
	async function handleDelete() {
		setIsDeleting(true)
		const result = await deleteCollectionAction(collection.id)
		setIsDeleting(false)

		if (result.error) {
			return
		}

		setDeleteOpen(false)
		router.refresh()
		router.push('/collections')
	}

	async function handleEditSuccess() {
		router.refresh()
	}

	const description = collection.description || 'Sin descripción'

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<h1 className='text-xl font-semibold text-foreground'>
					{collection.name}{' '}
					<span className='ml-2 text-base font-normal text-muted-foreground'>({initialTotalCount})</span>
				</h1>
				<div className='flex items-center gap-1'>
					<Button
						type='button'
						variant='ghost'
						size='icon'
						onClick={() => setEditOpen(true)}
						aria-label='Editar colección'
						title='Editar colección'
					>
						<Pencil className='size-4' />
					</Button>
					<Button
						type='button'
						variant='ghost'
						size='icon'
						onClick={handleToggleFavorite}
						aria-label={isFavorite ? 'Quitar colección de favoritas' : 'Marcar colección como favorita'}
						title={isFavorite ? 'Quitar colección de favoritas' : 'Marcar colección como favorita'}
					>
						<Star
							className={`size-4 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`}
						/>
					</Button>
					<Button
						type='button'
						variant='ghost'
						size='icon'
						onClick={() => setDeleteOpen(true)}
						aria-label='Eliminar colección'
						title='Eliminar colección'
					>
						<Trash2 className='size-4 text-destructive' />
					</Button>
				</div>
			</div>

			{/* Description */}
			<p className='text-sm text-muted-foreground'>{description}</p>

			{/* Type filter */}
			<div className='flex items-center gap-3'>
				<label htmlFor='item-type-filter' className='text-xs text-muted-foreground'>
					Filtrar por tipo
				</label>
				<Select value={itemType} onValueChange={handleTypeFilterChange}>
					<SelectTrigger id='item-type-filter' className='w-48'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{ITEM_TYPE_OPTIONS.map(option => (
							<SelectItem key={option.value || 'all'} value={option.value}>
								{option.dbName ? (
									<span className='flex items-center gap-2'>
										<ItemTypeIcon
											iconName={CANONICAL_SYSTEM_ITEM_TYPES.find(t => t.dbName === option.dbName)?.icon}
											className='size-4'
											color={CANONICAL_SYSTEM_ITEM_TYPES.find(t => t.dbName === option.dbName)?.color}
										/>
										{option.label}
									</span>
								) : (
									option.label
								)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<span className='text-xs text-muted-foreground'>
					{filteredCount} {filteredCount === 1 ? 'item' : 'items'}
				</span>
			</div>

			{/* Items */}
			{items.length === 0 ? (
				<div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center'>
					<p className='text-sm text-muted-foreground'>
						{itemType !== ALL_TYPES_VALUE
							? 'No hay items de este tipo en esta colección.'
							: 'No hay items en esta colección.'}
					</p>
				</div>
			) : (
				<>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
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

					{!hasMore && items.length > 12 && (
						<p className='py-4 text-center text-xs text-muted-foreground'>No hay más items.</p>
					)}
				</>
			)}

			{/* Edit dialog */}
			<CollectionFormDialog
				mode='edit'
				collectionId={collection.id}
				initialName={collection.name}
				initialDescription={collection.description}
				open={editOpen}
				onOpenChange={setEditOpen}
				onSuccess={handleEditSuccess}
			/>

			{/* Delete confirmation dialog */}
			<Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<DialogContent>
					<DialogHeader>
						<div className='flex items-center gap-3'>
							<div className='flex size-11 shrink-0 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive'>
								<AlertTriangle className='size-5' />
							</div>
							<div className='min-w-0 space-y-1'>
								<DialogTitle>Eliminar colección</DialogTitle>
								<DialogDescription>
									Esta acción es irreversible. La colección se eliminará permanentemente, pero los items que
									contiene no se eliminarán y quedarán sin colección.
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>
					<DialogFooter>
						<Button type='button' variant='outline' onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
							Cancelar
						</Button>
						<Button type='button' variant='destructive' onClick={handleDelete} disabled={isDeleting}>
							{isDeleting ? <LoaderCircle className='mr-2 size-4 animate-spin' /> : null}
							Eliminar
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
