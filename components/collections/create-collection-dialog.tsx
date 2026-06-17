'use client'

import { CheckCircle2, FolderHeart, LoaderCircle, Save, X } from 'lucide-react'
import { useActionState, useEffect, useId, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
	createCollection,
	type CreateCollectionState
} from '@/actions/collections/create-collection'
import {
	updateCollection,
	type UpdateCollectionState
} from '@/actions/collections/update-collection'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const INITIAL_CREATE_COLLECTION_STATE: CreateCollectionState = {
	error: null,
	successful: false,
	fieldErrors: {}
}

const INITIAL_UPDATE_COLLECTION_STATE: UpdateCollectionState = {
	error: null,
	successful: false,
	fieldErrors: {}
}

const textareaClassName =
	'min-h-28 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'

type CollectionFormDialogProps = {
	children?: React.ReactNode
	mode?: 'create' | 'edit'
	collectionId?: string
	initialName?: string
	initialDescription?: string | null
	/** Open state control (for edit mode triggered externally) */
	open?: boolean
	onOpenChange?: (open: boolean) => void
	onSuccess?: () => void
}

type CollectionFormProps = {
	mode: 'create' | 'edit'
	collectionId?: string
	initialName?: string
	initialDescription?: string | null
	onCancel: () => void
	onSuccess: () => void
	onPendingChange: (isPending: boolean) => void
}

export function CollectionFormDialog({
	children,
	mode = 'create',
	collectionId,
	initialName,
	initialDescription,
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
	onSuccess
}: CollectionFormDialogProps) {
	const [internalOpen, setInternalOpen] = useState(false)
	const [isPending, setIsPending] = useState(false)
	const [formKey, setFormKey] = useState(0)

	const isControlled = controlledOpen !== undefined
	const open = isControlled ? controlledOpen : internalOpen

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen && isPending) return

		if (isControlled) {
			controlledOnOpenChange?.(nextOpen)
		} else {
			setInternalOpen(nextOpen)
		}

		if (!nextOpen) {
			setFormKey(k => k + 1)
		}
	}

	function handleFormSuccess() {
		handleOpenChange(false)
		onSuccess?.()
	}

	const trigger = isControlled ? null : (
		<DialogTrigger asChild>{children}</DialogTrigger>
	)

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			{trigger}
			<DialogContent className='max-h-[90vh] p-0'>
				<CollectionForm
					key={formKey}
					mode={mode}
					collectionId={collectionId}
					initialName={initialName}
					initialDescription={initialDescription}
					onCancel={() => handleOpenChange(false)}
					onSuccess={handleFormSuccess}
					onPendingChange={setIsPending}
				/>
			</DialogContent>
		</Dialog>
	)
}

// Backwards-compatible export
export { CollectionFormDialog as CreateCollectionDialog }

function CollectionForm({
	mode,
	collectionId,
	initialName = '',
	initialDescription = '',
	onCancel,
	onSuccess,
	onPendingChange
}: CollectionFormProps) {
	const router = useRouter()
	const formId = useId()
	const [createState, createAction, isCreatePending] = useActionState(createCollection, INITIAL_CREATE_COLLECTION_STATE)
	const [updateState, updateAction, isUpdatePending] = useActionState(updateCollection, INITIAL_UPDATE_COLLECTION_STATE)

	const isEdit = mode === 'edit'
	const state = isEdit ? updateState : createState
	const action = isEdit ? updateAction : createAction
	const isPending = isEdit ? isUpdatePending : isCreatePending

	const [name, setName] = useState(initialName)
	const [description, setDescription] = useState(initialDescription ?? '')

	useEffect(() => {
		onPendingChange(isPending)
		return () => onPendingChange(false)
	}, [isPending, onPendingChange])

	useEffect(() => {
		if (!state.successful) return

		router.refresh()

		const timeoutId = window.setTimeout(() => {
			onSuccess()
		}, 2000)

		return () => window.clearTimeout(timeoutId)
	}, [onSuccess, router, state.successful])

	function getFieldError(field: string) {
		return state.fieldErrors?.[field as keyof typeof state.fieldErrors]
	}

	const title = isEdit ? 'Editar colección' : 'Nueva colección'
	const descriptionText = isEdit
		? 'Modifica los datos de la colección.'
		: 'Completa los datos para crear una nueva colección.'
	const successTitle = isEdit
		? 'Colección actualizada correctamente.'
		: 'Colección creada correctamente.'
	const successSubtitle = isEdit
		? 'El diálogo se cerrará automáticamente en unos segundos.'
		: 'El diálogo se cerrará automáticamente en unos segundos.'

	if (state.successful) {
		return (
			<>
				<DialogHeader className='sr-only'>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{successTitle}</DialogDescription>
				</DialogHeader>
				<div className='flex min-h-[360px] flex-col items-center justify-center gap-4 px-8 py-12 text-center'>
					<div className='flex size-14 items-center justify-center rounded-2xl border border-[#06B6D4] text-[#06B6D4]'>
						<CheckCircle2 className='size-7' />
					</div>
					<div className='space-y-2'>
						<h2 className='text-xl font-semibold text-foreground'>{successTitle}</h2>
						<p className='text-sm text-muted-foreground'>{successSubtitle}</p>
					</div>
				</div>
			</>
		)
	}

	return (
		<form action={action} className='flex max-h-[90vh] flex-col' noValidate>
			{isEdit ? <input type='hidden' name='collectionId' value={collectionId} /> : null}

			<DialogHeader className='border-b border-border/70 pr-14'>
				<div className='flex items-start gap-3'>
					<div className='flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[#06B6D4] bg-background text-[#06B6D4]'>
						<FolderHeart className='size-5' />
					</div>
					<div className='min-w-0 space-y-1'>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{descriptionText}</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className='flex-1 overflow-y-auto px-6 py-6'>
				<div className='flex flex-col gap-6'>
					{state.error ? (
						<div
							className='rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-foreground'
							role='alert'
							aria-live='assertive'
						>
							{state.error}
						</div>
					) : null}

					<section className='flex flex-col gap-4 rounded-3xl border border-border bg-card/60 p-5'>
						<div className='flex flex-col gap-2'>
							<label htmlFor={`${formId}-name`} className='text-sm font-medium text-foreground'>
								Nombre
							</label>
							<Input
								id={`${formId}-name`}
								name='name'
								value={name}
								onChange={event => setName(event.target.value)}
								disabled={isPending}
								autoFocus
								required
								className='h-11 rounded-xl bg-background/60 px-4'
								aria-invalid={getFieldError('name') ? true : undefined}
							/>
							{getFieldError('name') ? <p className='text-sm text-destructive'>{getFieldError('name')}</p> : null}
						</div>

						<div className='flex flex-col gap-2'>
							<label htmlFor={`${formId}-description`} className='text-sm font-medium text-foreground'>
								Descripción
							</label>
							<textarea
								id={`${formId}-description`}
								name='description'
								value={description}
								onChange={event => setDescription(event.target.value)}
								disabled={isPending}
								className={textareaClassName}
								placeholder='Añade una descripción breve'
								aria-invalid={getFieldError('description') ? true : undefined}
							/>
							{getFieldError('description') ? (
								<p className='text-sm text-destructive'>{getFieldError('description')}</p>
							) : null}
						</div>
					</section>
				</div>
			</div>

			<DialogFooter>
				<Button type='button' variant='outline' className='h-11 rounded-2xl' onClick={onCancel} disabled={isPending}>
					<X data-icon='inline-start' />
					Cancelar
				</Button>
				<Button type='submit' className='h-11 rounded-2xl px-5' disabled={isPending}>
					{isPending ? <LoaderCircle className='size-4 animate-spin' /> : <Save data-icon='inline-start' />}
					Guardar
				</Button>
			</DialogFooter>
		</form>
	)
}
