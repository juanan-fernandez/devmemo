'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Folder } from 'lucide-react'

import { ItemTypeIcon } from '@/lib/item-type-icons'
import { ItemDetailSheet } from '@/components/items/item-detail-sheet'
import type { DashboardItem } from '@/lib/db/items'
import type { SearchIndex, SearchableItem, SearchableCollection } from '@/lib/db/search'
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from '@/components/ui/command'

type GlobalSearchProps = {
	searchIndex: SearchIndex
	open: boolean
	onOpenChange: (open: boolean) => void
}

function searchableItemToDashboardItem(item: SearchableItem): DashboardItem {
	return {
		id: item.id,
		title: item.title,
		description: item.description,
		isFavorite: false,
		isPinned: false,
		language: null,
		createdAt: item.createdAt,
		type: item.type
	}
}

export function GlobalSearch({ searchIndex, open, onOpenChange }: GlobalSearchProps) {
	const router = useRouter()
	const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null)
	const [sheetOpen, setSheetOpen] = useState(false)
	const [sheetSession, setSheetSession] = useState(0)

	const handleItemSelect = useCallback((item: SearchableItem) => {
		const dashboardItem = searchableItemToDashboardItem(item)
		setSelectedItem(dashboardItem)
		setSheetSession(s => s + 1)
		setSheetOpen(true)
		onOpenChange(false)
	}, [onOpenChange])

	const handleSheetOpenChange = useCallback((isOpen: boolean) => {
		setSheetOpen(isOpen)
		if (!isOpen) {
			setSelectedItem(null)
		}
	}, [])

	const handleCollectionSelect = useCallback((collection: SearchableCollection) => {
		onOpenChange(false)
		router.push(`/collections/${collection.id}`)
	}, [router, onOpenChange])

	// Custom filter: case-insensitive substring matching on each word
	const filter = useMemo(() => {
		return (value: string, search: string) => {
			if (!search.trim()) return 1
			const lowerValue = value.toLowerCase()
			const words = search.toLowerCase().trim().split(/\s+/)
			const matchCount = words.filter(word => lowerValue.includes(word)).length
			return matchCount
		}
	}, [])

	return (
		<>
			<CommandDialog open={open} onOpenChange={onOpenChange} filter={filter}>
				<CommandInput placeholder='Buscar items o colecciones...' />
				<CommandList>
					<CommandEmpty>No se encontraron resultados.</CommandEmpty>
					<CommandGroup heading='Items'>
						{searchIndex.items.map(item => (
							<CommandItem
								key={`item-${item.id}`}
								value={`${item.title} ${item.description ?? ''} ${item.type.label ?? item.type.name} ${item.tags.join(' ')}`}
								onSelect={() => handleItemSelect(item)}
							>
								<ItemTypeIcon iconName={item.type.icon} color={item.type.color} className='size-4' />
								<span className='truncate'>{item.title}</span>
								<span className='ml-auto shrink-0 text-xs text-muted-foreground'>{item.type.label ?? item.type.name}</span>
							</CommandItem>
						))}
					</CommandGroup>
					<CommandGroup heading='Colecciones'>
						{searchIndex.collections.map(collection => (
							<CommandItem
								key={`collection-${collection.id}`}
								value={collection.name}
								onSelect={() => handleCollectionSelect(collection)}
							>
								<Folder className='size-4 text-muted-foreground' />
								<span className='truncate'>{collection.name}</span>
								<span className='ml-auto shrink-0 text-xs text-muted-foreground'>({collection.itemCount})</span>
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>

			{selectedItem && (
				<ItemDetailSheet
					key={sheetSession}
					item={selectedItem}
					open={sheetOpen}
					onOpenChange={handleSheetOpenChange}
				/>
			)}
		</>
	)
}
