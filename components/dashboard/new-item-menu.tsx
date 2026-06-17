'use client'

import { Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { getCollectionsForSelectAction } from '@/actions/collections/get-collections-for-select'
import { CANONICAL_SYSTEM_ITEM_TYPES } from '@/lib/item-types'
import type { CanonicalSystemItemType } from '@/lib/item-types'
import type { SelectableCollection } from '@/lib/db/collections'
import { ItemTypeIcon } from '@/lib/item-type-icons'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent
} from '@/components/ui/dialog'
import { CreateItemForm } from '@/components/items/create-item-dialog'

export function NewItemMenu() {
	const router = useRouter()
	const [menuOpen, setMenuOpen] = useState(false)
	const [selectedType, setSelectedType] = useState<CanonicalSystemItemType | null>(null)
	const [collections, setCollections] = useState<SelectableCollection[]>([])
	const [collectionsLoading, setCollectionsLoading] = useState(false)
	const [formKey, setFormKey] = useState(0)
	const menuRef = useRef<HTMLDivElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)

	const handleToggle = useCallback(() => {
		setMenuOpen(current => !current)
	}, [])

	const handleSelectType = useCallback(
		async (type: CanonicalSystemItemType) => {
			setMenuOpen(false)
			setSelectedType(type)
			setCollectionsLoading(true)

			try {
				const userCollections = await getCollectionsForSelectAction()
				setCollections(
					userCollections.map(c => ({ id: c.id, name: c.label }))
				)
			} finally {
				setCollectionsLoading(false)
			}
		},
		[]
	)

	const handleDialogClose = useCallback(() => {
		setSelectedType(null)
		setFormKey(key => key + 1)
	}, [])

	const handleFormSuccess = useCallback(() => {
		router.refresh()
		handleDialogClose()
	}, [router, handleDialogClose])

	const handleFormCancel = useCallback(() => {
		handleDialogClose()
	}, [handleDialogClose])

	useEffect(() => {
		if (!menuOpen) return

		function handleClickOutside(event: MouseEvent) {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setMenuOpen(false)
			}
		}

		function handleEscape(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setMenuOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleEscape)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleEscape)
		}
	}, [menuOpen])

	const newLabels = CANONICAL_SYSTEM_ITEM_TYPES.map(type => ({
		...type,
		newLabel: `Nuev${type.gender === 'feminine' ? 'a' : 'o'} ${type.singularLabel}`
	}))

	return (
		<>
			<div className='relative shrink-0'>
				<Button ref={buttonRef} type='button' className='gap-2' onClick={handleToggle}>
					<Plus className='size-4' />
					Nuevo Item
				</Button>

				{menuOpen && (
					<div
						ref={menuRef}
						className='absolute right-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl border border-border bg-popover shadow-lg'
						role='menu'
					>
						{newLabels.map(type => (
							<button
								key={type.key}
								type='button'
								className='flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent'
								onClick={() => handleSelectType(type)}
								role='menuitem'
							>
								<ItemTypeIcon iconName={type.icon} className='size-4' color={type.color} />
								{type.newLabel}
							</button>
						))}
					</div>
				)}
			</div>

			{selectedType && !collectionsLoading && (
				<Dialog open={!!selectedType && !collectionsLoading} onOpenChange={open => { if (!open) handleDialogClose() }}>
					<DialogContent className='max-h-[90vh] p-0'>
						<CreateItemForm
							key={formKey}
							canonicalType={selectedType}
							collections={collections}
							onCancel={handleFormCancel}
							onSuccess={handleFormSuccess}
							onPendingChange={() => {}}
						/>
					</DialogContent>
				</Dialog>
			)}
		</>
	)
}
