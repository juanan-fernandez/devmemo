'use client'

import { AlertTriangle, LoaderCircle, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { deleteItemAction, type DeleteItemState } from '@/actions/items/delete-item'
import { Button } from '@/components/ui/button'

const INITIAL_DELETE_ITEM_STATE: DeleteItemState = {
	error: null
}

type DeleteItemDialogProps = {
	itemId: string
	itemTitle: string
	onDelete: () => void
}

export function DeleteItemDialog({ itemId, itemTitle, onDelete }: DeleteItemDialogProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		if (!isOpen) {
			return
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && !isSubmitting) {
				setIsOpen(false)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, isSubmitting])

	function handleOpen() {
		setIsSubmitting(false)
		setIsOpen(true)
	}

	function handleClose() {
		if (isSubmitting) {
			return
		}

		setIsOpen(false)
		setIsSubmitting(false)
	}

	async function handleDelete() {
		setIsSubmitting(true)

		const result = await deleteItemAction(itemId, INITIAL_DELETE_ITEM_STATE)

		if (result.successful) {
			setIsOpen(false)
			setIsSubmitting(false)
			onDelete()
		} else {
			setIsSubmitting(false)
			alert(result.error || 'Error al eliminar el item')
		}
	}

	return (
		<>
			<button
				type='button'
				className='rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-destructive'
				aria-label='Eliminar'
				onClick={handleOpen}
			>
				<Trash2 className='size-4' />
			</button>

			{isOpen ? (
				<div
					className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm'
					role='presentation'
					onClick={handleClose}
				>
					<div
						role='dialog'
						aria-modal='true'
						aria-labelledby='delete-item-title'
						className='relative w-full max-w-lg overflow-hidden rounded-[28px] border border-destructive/20 bg-card shadow-2xl'
						onClick={event => event.stopPropagation()}
					>
						<div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-destructive/50 to-transparent' />
						<div className='flex items-start justify-between gap-4 border-b border-border/70 px-6 py-5'>
							<div className='flex items-start gap-3'>
								<div className='flex size-11 items-center justify-center rounded-2xl border border-destructive/25 bg-destructive/10 text-destructive'>
									<Trash2 className='size-5' />
								</div>
								<div className='space-y-1'>
									<h2 id='delete-item-title' className='text-xl font-semibold text-foreground'>
										Eliminar item
									</h2>
									<p className='text-sm text-muted-foreground'>
										Esta acción no se puede deshacer.
									</p>
								</div>
							</div>
							<Button
								type='button'
								variant='ghost'
								size='icon-sm'
								className='rounded-xl'
								onClick={handleClose}
								disabled={isSubmitting}
								aria-label='Cerrar confirmación de eliminación'
							>
								<X className='size-4' />
							</Button>
						</div>

						<div className='space-y-6 px-6 py-6'>
							<div className='rounded-2xl border border-destructive/20 bg-destructive/5 p-4'>
								<div className='flex items-start gap-3'>
									<AlertTriangle className='mt-0.5 size-5 shrink-0 text-destructive' />
									<div className='space-y-2'>
										<p className='text-sm font-medium text-foreground'>
											¿Seguro que quieres eliminar este item?
										</p>
										<p className='text-sm text-muted-foreground'>
											Vas a eliminar <span className='font-medium text-foreground'>{itemTitle}</span>.
										</p>
									</div>
								</div>
							</div>

							<div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
								<Button
									type='button'
									variant='outline'
									className='h-11 rounded-2xl'
									onClick={handleClose}
									disabled={isSubmitting}
								>
									Cancelar
								</Button>
								<Button
									type='button'
									variant='destructive'
									className='h-11 rounded-2xl px-5'
									onClick={handleDelete}
									disabled={isSubmitting}
								>
									{isSubmitting ? <LoaderCircle className='size-4 animate-spin' /> : <Trash2 className='size-4' />}
									Eliminar
								</Button>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</>
	)
}
