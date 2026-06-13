'use client'

import { AlertCircle, CheckCircle2, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { useActionState, useEffect, useId, useRef, useState } from 'react'

import { changePasswordAction } from '@/actions/auth/change-password'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PASSWORD_ERROR_MESSAGE } from '@/lib/auth/password-policy'

const INITIAL_CHANGE_PASSWORD_STATE = {
	success: undefined,
	error: null,
	successful: false
}

type ChangePasswordFormProps = {
	onSuccess?: () => void
}

export function ChangePasswordForm({ onSuccess }: ChangePasswordFormProps) {
	const prevSuccessfulRef = useRef(false)
	const formId = useId()
	const [showCurrent, setShowCurrent] = useState(false)
	const [showNew, setShowNew] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)
	const [state, action, isPending] = useActionState(
		changePasswordAction,
		INITIAL_CHANGE_PASSWORD_STATE
	)

	useEffect(() => {
		const isSuccessful = state.successful ?? false

		if (isSuccessful && !prevSuccessfulRef.current) {
			onSuccess?.()
		}
		prevSuccessfulRef.current = isSuccessful
	}, [state.successful, onSuccess])

	if (state.successful) {
		return (
			<div className='flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4'>
				<CheckCircle2 className='mt-0.5 size-5 shrink-0 text-emerald-400' />
				<p className='text-sm text-foreground'>{state.success}</p>
			</div>
		)
	}

	return (
		<form action={action} className='space-y-4' noValidate>
			<div className='space-y-2'>
				<label htmlFor={`${formId}-current`} className='text-sm font-medium text-foreground'>
					Contraseña actual
				</label>
				<div className='relative'>
					<Input
						id={`${formId}-current`}
						name='currentPassword'
						type={showCurrent ? 'text' : 'password'}
						autoComplete='current-password'
						required
						disabled={isPending}
						placeholder='Tu contraseña actual'
						className='h-11 rounded-xl bg-background/60 pe-11 ps-4'
					/>
					<Button
						type='button'
						variant='ghost'
						size='icon'
						onClick={() => setShowCurrent(c => !c)}
						className='absolute right-1 top-1 h-9 w-9 rounded-xl'
						aria-label={showCurrent ? 'Ocultar contraseña actual' : 'Mostrar contraseña actual'}
					>
						{showCurrent ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
					</Button>
				</div>
			</div>

			<div className='space-y-2'>
				<label htmlFor={`${formId}-new`} className='text-sm font-medium text-foreground'>
					Nueva contraseña
				</label>
				<div className='relative'>
					<Input
						id={`${formId}-new`}
						name='newPassword'
						type={showNew ? 'text' : 'password'}
						autoComplete='new-password'
						required
						disabled={isPending}
						placeholder='Mínimo 8 caracteres'
						className='h-11 rounded-xl bg-background/60 pe-11 ps-4'
						aria-describedby={`${formId}-hint`}
					/>
					<Button
						type='button'
						variant='ghost'
						size='icon'
						onClick={() => setShowNew(c => !c)}
						className='absolute right-1 top-1 h-9 w-9 rounded-xl'
						aria-label={showNew ? 'Ocultar nueva contraseña' : 'Mostrar nueva contraseña'}
					>
						{showNew ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
					</Button>
				</div>
				<p id={`${formId}-hint`} className='text-xs text-muted-foreground'>
					{PASSWORD_ERROR_MESSAGE}
				</p>
			</div>

			<div className='space-y-2'>
				<label htmlFor={`${formId}-confirm`} className='text-sm font-medium text-foreground'>
					Confirmar nueva contraseña
				</label>
				<div className='relative'>
					<Input
						id={`${formId}-confirm`}
						name='confirmPassword'
						type={showConfirm ? 'text' : 'password'}
						autoComplete='new-password'
						required
						disabled={isPending}
						placeholder='Repite tu nueva contraseña'
						className='h-11 rounded-xl bg-background/60 pe-11 ps-4'
					/>
					<Button
						type='button'
						variant='ghost'
						size='icon'
						onClick={() => setShowConfirm(c => !c)}
						className='absolute right-1 top-1 h-9 w-9 rounded-xl'
						aria-label={showConfirm ? 'Ocultar confirmación' : 'Mostrar confirmación'}
					>
						{showConfirm ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
					</Button>
				</div>
			</div>

			{state.error ? (
				<div
					className='flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-foreground'
					role='alert'
					aria-live='assertive'
				>
					<AlertCircle className='mt-0.5 size-4 shrink-0 text-destructive' />
					<p>{state.error}</p>
				</div>
			) : null}

			<Button
				type='submit'
				size='lg'
				disabled={isPending}
				className='h-11 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/85'
			>
				{isPending ? <LoaderCircle className='size-4 animate-spin' /> : null}
				Guardar nueva contraseña
			</Button>
		</form>
	)
}
