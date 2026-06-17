'use client'

import { CheckCircle2, FolderHeart, LoaderCircle, Save, X } from 'lucide-react'
import { useActionState, useEffect, useId, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
	createCollection,
	type CreateCollectionField,
	type CreateCollectionState
} from '@/actions/collections/create-collection'
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

const textareaClassName =
	'min-h-28 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'

type CreateCollectionDialogProps = {
	children: React.ReactNode
	onSuccess?: () => void
}

type CreateCollectionFormProps = {
	onCancel: () => void
	onSuccess: () => void
	onPendingChange: (isPending: boolean) => void
}

export function CreateCollectionDialog({ children, onSuccess }: CreateCollectionDialogProps) {
	const [open, setOpen] = useState(false)
	const [isPending, setIsPending] = useState(false)
	const [formKey, setFormKey] = useState(0)

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen && isPending) {
			return
		}

		setOpen(nextOpen)

		if (!nextOpen) {
			setFormKey(currentKey => currentKey + 1)
		}
	}

	function handleFormSuccess() {
		handleOpenChange(false)
		onSuccess?.()
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='max-h-[90vh] p-0'>
				<CreateCollectionForm
					key={formKey}
					onCancel={() => handleOpenChange(false)}
					onSuccess={handleFormSuccess}
					onPendingChange={setIsPending}
				/>
			</DialogContent>
		</Dialog>
	)
}

function CreateCollectionForm({ onCancel, onSuccess, onPendingChange }: CreateCollectionFormProps) {
	const router = useRouter()
	const formId = useId()
	const [state, action, isPending] = useActionState(createCollection, INITIAL_CREATE_COLLECTION_STATE)
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')

	useEffect(() => {
		onPendingChange(isPending)
		return () => onPendingChange(false)
	}, [isPending, onPendingChange])

	useEffect(() => {
		if (!state.successful) {
			return
		}

		router.refresh()

		const timeoutId = window.setTimeout(() => {
			onSuccess()
		}, 2000)

		return () => window.clearTimeout(timeoutId)
	}, [onSuccess, router, state.successful])

	function getFieldError(field: CreateCollectionField) {
		return state.fieldErrors?.[field]
	}

	if (state.successful) {
		return (
			<>
				<DialogHeader className='sr-only'>
					<DialogTitle>Nueva colección</DialogTitle>
					<DialogDescription>Colección creada correctamente.</DialogDescription>
				</DialogHeader>
				<div className='flex min-h-[360px] flex-col items-center justify-center gap-4 px-8 py-12 text-center'>
					<div className='flex size-14 items-center justify-center rounded-2xl border border-[#06B6D4] text-[#06B6D4]'>
						<CheckCircle2 className='size-7' />
					</div>
					<div className='space-y-2'>
						<h2 className='text-xl font-semibold text-foreground'>Colección creada correctamente.</h2>
						<p className='text-sm text-muted-foreground'>El diálogo se cerrará automáticamente en unos segundos.</p>
					</div>
				</div>
			</>
		)
	}

	return (
		<form action={action} className='flex max-h-[90vh] flex-col' noValidate>
			<DialogHeader className='border-b border-border/70 pr-14'>
				<div className='flex items-start gap-3'>
					<div className='flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[#06B6D4] bg-background text-[#06B6D4]'>
						<FolderHeart className='size-5' />
					</div>
					<div className='min-w-0 space-y-1'>
						<DialogTitle>Nueva colección</DialogTitle>
						<DialogDescription>Completa los datos para crear una nueva colección.</DialogDescription>
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
