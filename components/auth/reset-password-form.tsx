'use client'

import { AlertCircle, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { useActionState, useId, useState } from 'react'

import { resetPasswordAction } from '@/actions/auth/reset-password'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PASSWORD_ERROR_MESSAGE } from '@/lib/auth/password-policy'

const INITIAL_RESET_PASSWORD_STATE = {
	error: null
}

type ResetPasswordFormProps = {
	token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
	const passwordId = useId()
	const confirmPasswordId = useId()
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [state, action, isPending] = useActionState(
		resetPasswordAction,
		INITIAL_RESET_PASSWORD_STATE
	)

	return (
		<form action={action} className='space-y-5' noValidate>
			<input type='hidden' name='token' value={token} />

			<div className='space-y-2'>
				<label htmlFor={passwordId} className='text-sm font-medium text-foreground'>
					Nueva contraseña
				</label>
				<div className='relative'>
					<Input
						id={passwordId}
						name='password'
						type={showPassword ? 'text' : 'password'}
						autoComplete='new-password'
						required
						disabled={isPending}
						placeholder='Mínimo 8 caracteres'
						className='h-12 rounded-2xl bg-background/60 px-4 pr-12'
						aria-describedby={`${passwordId}-hint`}
					/>
					<Button
						type='button'
						variant='ghost'
						size='icon'
						onClick={() => setShowPassword(current => !current)}
						className='absolute right-1 top-1 h-10 w-10 rounded-2xl'
						aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
					>
						{showPassword ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
					</Button>
				</div>
				<p id={`${passwordId}-hint`} className='text-xs text-muted-foreground'>
					{PASSWORD_ERROR_MESSAGE}
				</p>
			</div>

			<div className='space-y-2'>
				<label htmlFor={confirmPasswordId} className='text-sm font-medium text-foreground'>
					Confirmar contraseña
				</label>
				<div className='relative'>
					<Input
						id={confirmPasswordId}
						name='confirmPassword'
						type={showConfirmPassword ? 'text' : 'password'}
						autoComplete='new-password'
						required
						disabled={isPending}
						placeholder='Repite tu nueva contraseña'
						className='h-12 rounded-2xl bg-background/60 px-4 pr-12'
					/>
					<Button
						type='button'
						variant='ghost'
						size='icon'
						onClick={() => setShowConfirmPassword(current => !current)}
						className='absolute right-1 top-1 h-10 w-10 rounded-2xl'
						aria-label={showConfirmPassword ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña'}
					>
						{showConfirmPassword ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
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
				className='h-12 w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/85'
			>
				{isPending ? <LoaderCircle className='size-4 animate-spin' /> : null}
				Guardar nueva contraseña
			</Button>
		</form>
	)
}
