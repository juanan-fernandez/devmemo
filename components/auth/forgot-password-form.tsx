'use client'

import { AlertCircle, LoaderCircle } from 'lucide-react'
import { useActionState, useId } from 'react'

import { requestPasswordResetAction } from '@/actions/auth/request-password-reset'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const INITIAL_REQUEST_PASSWORD_RESET_STATE = {
	message: null,
	error: null
}

export function ForgotPasswordForm() {
	const emailId = useId()
	const [state, action, isPending] = useActionState(
		requestPasswordResetAction,
		INITIAL_REQUEST_PASSWORD_RESET_STATE
	)

	return (
		<form action={action} className='space-y-5' noValidate>
			<div className='space-y-2'>
				<label htmlFor={emailId} className='text-sm font-medium text-foreground'>
					Correo electrónico
				</label>
				<Input
					id={emailId}
					name='email'
					type='email'
					autoComplete='email'
					required
					disabled={isPending}
					placeholder='tu@correo.com'
					className='h-12 rounded-2xl bg-background/60 px-4'
					aria-invalid={Boolean(state.error)}
					aria-describedby={state.error ? `${emailId}-error` : undefined}
				/>
			</div>

			{state.error ? (
				<div
					className='flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-foreground'
					role='alert'
					aria-live='assertive'
				>
					<AlertCircle className='mt-0.5 size-4 shrink-0 text-destructive' />
					<p id={`${emailId}-error`}>{state.error}</p>
				</div>
			) : null}

			{state.message ? (
				<div
					className='rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100'
					role='status'
					aria-live='polite'
				>
					{state.message}
				</div>
			) : null}

			<Button
				type='submit'
				size='lg'
				disabled={isPending}
				className='h-12 w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/85'
			>
				{isPending ? <LoaderCircle className='size-4 animate-spin' /> : null}
				Enviar enlace de recuperación
			</Button>
		</form>
	)
}
