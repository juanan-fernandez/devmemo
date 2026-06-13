'use client'

import { AlertCircle, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useId, useState } from 'react'
import { signIn } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GitHubMark } from '@/components/auth/github-mark'

type LoginFormProps = {
	errorMessage: string | null
	showRegisteredMessage: boolean
}

export function LoginForm({ errorMessage, showRegisteredMessage }: LoginFormProps) {
	const router = useRouter()
	const emailId = useId()
	const passwordId = useId()
	const [formError, setFormError] = useState<string | null>(errorMessage)
	const [isCredentialsPending, setIsCredentialsPending] = useState(false)
	const [isGitHubPending, setIsGitHubPending] = useState(false)

	async function handleCredentialsSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setFormError(null)
		setIsCredentialsPending(true)
		const formData = new FormData(event.currentTarget)

		const email = formData.get('email')
		const password = formData.get('password')

		if (typeof email !== 'string' || typeof password !== 'string') {
			setFormError('Completa tu correo y tu contraseña para continuar.')
			setIsCredentialsPending(false)
			return
		}

		const result = await signIn('credentials', {
			email,
			password,
			redirect: false,
			redirectTo: '/dashboard'
		})

		if (!result || result.error) {
			setFormError('Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.')
			setIsCredentialsPending(false)
			return
		}

		router.push(result.url ?? '/dashboard')
		router.refresh()
	}

	async function handleGitHubSignIn() {
		setFormError(null)
		setIsGitHubPending(true)

		await signIn('github', {
			redirectTo: '/dashboard'
		})

		setIsGitHubPending(false)
	}

	return (
		<div className='space-y-6'>
			{showRegisteredMessage ? (
				<div
					className='rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100'
					role='status'
					aria-live='polite'
				>
					Tu cuenta se creó correctamente. Ya puedes iniciar sesión.
				</div>
			) : null}

			{formError ? (
				<div
					className='flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-foreground'
					role='alert'
					aria-live='assertive'
				>
					<AlertCircle className='mt-0.5 size-4 shrink-0 text-destructive' />
					<p>{formError}</p>
				</div>
			) : null}

			<Button
				type='button'
				variant='outline'
				size='lg'
				onClick={handleGitHubSignIn}
				disabled={isCredentialsPending || isGitHubPending}
				className='h-12 w-full justify-center rounded-2xl border-border/80 bg-background/70 text-sm font-semibold hover:bg-accent'
				aria-label='Continuar con GitHub'
			>
				{isGitHubPending ? <LoaderCircle className='size-4 animate-spin' /> : <GitHubMark />}
				Continuar con GitHub
			</Button>

			<div className='relative'>
				<div className='absolute inset-0 flex items-center'>
					<div className='w-full border-t border-border/70' />
				</div>
				<div className='relative flex justify-center'>
					<span className='bg-card px-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground'>
						O usa tu correo
					</span>
				</div>
			</div>

			<form
				onSubmit={handleCredentialsSubmit}
				className='space-y-5'
				aria-describedby={formError ? 'login-form-error' : undefined}
			>
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
						disabled={isCredentialsPending || isGitHubPending}
						placeholder='tu@correo.com'
						className='h-12 rounded-2xl bg-background/60 px-4'
					/>
				</div>

				<div className='space-y-2'>
					<div className='flex items-center justify-between gap-3'>
						<label htmlFor={passwordId} className='text-sm font-medium text-foreground'>
							Contraseña
						</label>
						<Link
							href='/forgot-password'
							className='text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card'
						>
							¿Olvidaste tu contraseña?
						</Link>
					</div>
					<Input
						id={passwordId}
						name='password'
						type='password'
						autoComplete='current-password'
						required
						disabled={isCredentialsPending || isGitHubPending}
						placeholder='Escribe tu contraseña'
						className='h-12 rounded-2xl bg-background/60 px-4'
					/>
				</div>

				{formError ? (
					<p id='login-form-error' className='text-sm text-destructive'>
						{formError}
					</p>
				) : null}

				<Button
					type='submit'
					size='lg'
					disabled={isCredentialsPending || isGitHubPending}
					className='h-12 w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/85'
				>
					{isCredentialsPending ? <LoaderCircle className='size-4 animate-spin' /> : null}
					Iniciar sesión
				</Button>
			</form>
		</div>
	)
}
