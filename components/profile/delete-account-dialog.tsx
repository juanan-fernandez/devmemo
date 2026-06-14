'use client'

import { AlertTriangle, LoaderCircle, ShieldAlert, Trash2, X } from 'lucide-react'
import { useActionState, useEffect, useId, useState } from 'react'

import { deleteAccountAction, type DeleteAccountState } from '@/actions/profile/delete-account'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const INITIAL_DELETE_ACCOUNT_STATE: DeleteAccountState = {
	error: null
}

type DeleteAccountDialogProps = {
	email: string
}

export function DeleteAccountDialog({ email }: DeleteAccountDialogProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [formKey, setFormKey] = useState(0)
	const [isSubmitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		if (!isOpen) {
			return
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && !isSubmitting) {
				setIsOpen(false)
				setFormKey(current => current + 1)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, isSubmitting])

	function handleOpen() {
		setIsSubmitting(false)
		setFormKey(current => current + 1)
		setIsOpen(true)
	}

	function handleClose() {
		if (isSubmitting) {
			return
		}

		setIsOpen(false)
		setIsSubmitting(false)
		setFormKey(current => current + 1)
	}

	return (
		<>
			<Button
				variant='destructive'
				size='sm'
				className='rounded-xl border border-destructive/30 bg-destructive/10 px-3 text-destructive shadow-[0_0_0_1px_color-mix(in_oklch,var(--destructive),transparent_82%)] hover:border-destructive/45 hover:bg-destructive/15'
				onClick={handleOpen}
			>
				<Trash2 className='size-3.5' />
				Eliminar cuenta
			</Button>

			{isOpen ? (
				<div
					className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm'
					role='presentation'
					onClick={handleClose}
				>
					<div
						role='dialog'
						aria-modal='true'
						aria-labelledby='delete-account-title'
						className='relative w-full max-w-lg overflow-hidden rounded-[28px] border border-destructive/20 bg-card shadow-2xl'
						onClick={event => event.stopPropagation()}
					>
						<div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-destructive/50 to-transparent' />
						<div className='flex items-start justify-between gap-4 border-b border-border/70 px-6 py-5'>
							<div className='flex items-start gap-3'>
								<div className='flex size-11 items-center justify-center rounded-2xl border border-destructive/25 bg-destructive/10 text-destructive'>
									<ShieldAlert className='size-5' />
								</div>
								<div className='space-y-1'>
									<h2 id='delete-account-title' className='text-xl font-semibold text-foreground'>
										Eliminar cuenta
									</h2>
									<p className='text-sm text-muted-foreground'>
										Esta acción cerrará tu sesión y no se puede deshacer.
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

						<DeleteAccountForm
							key={formKey}
							email={email}
							onCancel={handleClose}
							onPendingChange={setIsSubmitting}
						/>
					</div>
				</div>
			) : null}
		</>
	)
}

type DeleteAccountFormProps = {
	email: string
	onCancel: () => void
	onPendingChange: (isPending: boolean) => void
}

function DeleteAccountForm({ email, onCancel, onPendingChange }: DeleteAccountFormProps) {
	const confirmationId = useId()
	const [confirmation, setConfirmation] = useState('')
	const [state, action, isPending] = useActionState(deleteAccountAction, INITIAL_DELETE_ACCOUNT_STATE)
	const isConfirmationValid = confirmation === 'BORRAR'

	useEffect(() => {
		onPendingChange(isPending)
		return () => onPendingChange(false)
	}, [isPending, onPendingChange])

	return (
		<form action={action} className='space-y-6 px-6 py-6' noValidate>
			<div className='rounded-2xl border border-destructive/20 bg-destructive/5 p-4'>
				<div className='flex items-start gap-3'>
					<AlertTriangle className='mt-0.5 size-5 shrink-0 text-destructive' />
					<div className='space-y-2'>
						<p className='text-sm font-medium text-foreground'>
							Se perderá toda la información de la cuenta de forma permanente e irreversible.
						</p>
						<p className='text-sm text-muted-foreground'>
							Vas a eliminar el acceso asociado a <span className='font-medium text-foreground'>{email}</span>.
						</p>
					</div>
				</div>
			</div>

			<div className='space-y-2'>
				<label htmlFor={confirmationId} className='text-sm font-medium text-foreground'>
					Escribe BORRAR para confirmar
				</label>
				<Input
					id={confirmationId}
					name='confirmation'
					value={confirmation}
					onChange={event => setConfirmation(event.target.value)}
					disabled={isPending}
					autoFocus
					autoComplete='off'
					placeholder='BORRAR'
					className='h-12 rounded-2xl border-destructive/20 bg-background/70 px-4 text-base tracking-[0.18em] uppercase'
					aria-describedby={`${confirmationId}-hint`}
				/>
				<p id={`${confirmationId}-hint`} className='text-xs text-muted-foreground'>
					El botón Continuar solo se activará cuando escribas BORRAR exactamente.
				</p>
			</div>

			{state.error ? (
				<div
					className='flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-foreground'
					role='alert'
					aria-live='assertive'
				>
					<AlertTriangle className='mt-0.5 size-4 shrink-0 text-destructive' />
					<p>{state.error}</p>
				</div>
			) : null}

			<div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
				<Button
					type='button'
					variant='outline'
					className='h-11 rounded-2xl'
					onClick={onCancel}
					disabled={isPending}
				>
					Cancelar
				</Button>
				<Button
					type='submit'
					variant='destructive'
					className='h-11 rounded-2xl px-5'
					disabled={!isConfirmationValid || isPending}
				>
					{isPending ? <LoaderCircle className='size-4 animate-spin' /> : <Trash2 className='size-4' />}
					Continuar
				</Button>
			</div>
		</form>
	)
}
