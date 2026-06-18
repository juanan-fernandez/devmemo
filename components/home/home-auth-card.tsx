'use client'

import { AlertCircle, LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useId, useState } from 'react'
import { signIn } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { isValidEmail } from '@/lib/validation/email'
import { isValidPassword, PASSWORD_ERROR_MESSAGE } from '@/lib/auth/password-policy'

type AuthTab = 'login' | 'register'

type FieldErrors = Partial<
	Record<'name' | 'email' | 'password' | 'passwordConfirm' | 'general', string>
>

export function HomeAuthCard() {
	const router = useRouter()
	const [tab, setTab] = useState<AuthTab>('login')
	const [pending, setPending] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)

	// Login fields
	const emailId = useId()
	const passwordId = useId()

	// Register fields
	const regNameId = useId()
	const regEmailId = useId()
	const regPasswordId = useId()
	const regPasswordConfirmId = useId()

	async function handleLogin(formData: FormData) {
		setError(null)
		setPending(true)

		const email = formData.get('email') as string
		const password = formData.get('password') as string

		const fieldErrors: FieldErrors = {}
		if (!email || !isValidEmail(email)) fieldErrors.email = 'Introduce un email válido.'
		if (!password) fieldErrors.password = 'Introduce tu contraseña.'

		if (Object.keys(fieldErrors).length > 0) {
			setError(Object.values(fieldErrors)[0])
			setPending(false)
			return
		}

		try {
			const result = await signIn('credentials', {
				email,
				password,
				redirect: false
			})

			if (result?.error) {
				if (result.error === 'CredentialsSignin') {
					setError('Email o contraseña incorrectos.')
				} else if (result.error === 'EmailNotVerified') {
					setError('Debes verificar tu email antes de iniciar sesión.')
				} else {
					setError('Error al iniciar sesión. Inténtalo de nuevo.')
				}
				setPending(false)
				return
			}

			router.push('/dashboard')
			router.refresh()
		} catch {
			setError('Error de conexión. Inténtalo de nuevo.')
			setPending(false)
		}
	}

	async function handleRegister(formData: FormData) {
		setError(null)
		setPending(true)

		const name = formData.get('name') as string
		const email = formData.get('email') as string
		const password = formData.get('password') as string
		const passwordConfirm = formData.get('passwordConfirm') as string

		const fieldErrors: FieldErrors = {}
		if (!name || name.trim().length < 2) fieldErrors.name = 'El nombre debe tener al menos 2 caracteres.'
		if (!email || !isValidEmail(email)) fieldErrors.email = 'Introduce un email válido.'
		if (!password || !isValidPassword(password)) fieldErrors.password = PASSWORD_ERROR_MESSAGE
		if (password !== passwordConfirm) fieldErrors.passwordConfirm = 'Las contraseñas no coinciden.'

		if (Object.keys(fieldErrors).length > 0) {
			setError(Object.values(fieldErrors)[0])
			setPending(false)
			return
		}

		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password })
			})

			if (!res.ok) {
				const data = await res.json().catch(() => null)
				if (res.status === 409) {
					setError('Este email ya está registrado.')
				} else if (res.status === 429) {
					setError('Demasiados intentos. Espera unos minutos.')
				} else {
					setError(data?.error || 'Error al crear la cuenta.')
				}
				setPending(false)
				return
			}

			setSuccess('Cuenta creada correctamente. Redirigiendo...')
			setTimeout(() => {
				router.push('/login?registered=true')
			}, 1500)
		} catch {
			setError('Error de conexión. Inténtalo de nuevo.')
			setPending(false)
		}
	}

	return (
		<div className='rounded-2xl border border-zinc-800 bg-[#18181b] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.4)]'>
			{/* Tabs */}
			<div className='flex border-b border-zinc-800'>
				<button
					type='button'
					onClick={() => {
						setTab('login')
						setError(null)
						setSuccess(null)
					}}
					className={`flex-1 pb-3 text-center text-base font-semibold transition-colors ${
						tab === 'login'
							? 'border-b-2 border-white text-white'
							: 'font-medium text-zinc-500 hover:text-zinc-300'
					}`}
				>
					Iniciar sesión
				</button>
				<button
					type='button'
					onClick={() => {
						setTab('register')
						setError(null)
						setSuccess(null)
					}}
					className={`flex-1 pb-3 text-center text-base transition-colors ${
						tab === 'register'
							? 'border-b-2 border-white font-semibold text-white'
							: 'font-medium text-zinc-500 hover:text-zinc-300'
					}`}
				>
					Crear cuenta
				</button>
			</div>

			{/* Error / Success */}
			{error && (
				<div className='mt-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400'>
					<AlertCircle className='mt-0.5 size-4 shrink-0' />
					<span>{error}</span>
				</div>
			)}

			{success && (
				<div className='mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-400'>
					{success}
				</div>
			)}

			{/* Login Form */}
			{tab === 'login' && (
				<form action={handleLogin} className='mt-6 space-y-4'>
					<div>
						<label htmlFor={emailId} className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-[0.05em] text-zinc-500'>
							EMAIL
						</label>
						<Input
							id={emailId}
							name='email'
							type='email'
							placeholder='dev@stash.io'
							autoComplete='email'
							className='border-zinc-700 bg-zinc-900/60 text-sm placeholder:text-zinc-600'
						/>
					</div>
					<div>
						<label htmlFor={passwordId} className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-[0.05em] text-zinc-500'>
							CONTRASEÑA
						</label>
						<Input
							id={passwordId}
							name='password'
							type='password'
							placeholder='••••••••'
							autoComplete='current-password'
							className='border-zinc-700 bg-zinc-900/60 text-sm placeholder:text-zinc-600'
						/>
					</div>

					<Button type='submit' disabled={pending} className='h-11 w-full bg-white text-sm font-semibold text-zinc-900 hover:bg-zinc-200'>
						{pending ? <LoaderCircle className='size-4 animate-spin' /> : 'Acceder al Hub'}
					</Button>

					<div className='flex items-center gap-3'>
						<div className='h-px flex-1 bg-zinc-800' />
						<span className='font-mono text-[11px] font-medium uppercase tracking-[0.05em] text-zinc-600'>
							O CONTINUA CON
						</span>
						<div className='h-px flex-1 bg-zinc-800' />
					</div>

					<Button
						type='button'
						variant='ghost'
						disabled={pending}
						onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
						className='h-11 w-full gap-2 border border-zinc-700 bg-zinc-900/60 text-sm font-medium text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'
					>
						<svg className='size-4' viewBox='0 0 16 16' fill='currentColor'>
							<path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z' />
						</svg>
						GitHub Account
					</Button>
				</form>
			)}

			{/* Register Form */}
			{tab === 'register' && (
				<form action={handleRegister} className='mt-6 space-y-4'>
					<div>
						<label htmlFor={regNameId} className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-[0.05em] text-zinc-500'>
							NOMBRE
						</label>
						<Input
							id={regNameId}
							name='name'
							type='text'
							placeholder='Tu nombre'
							autoComplete='name'
							className='border-zinc-700 bg-zinc-900/60 text-sm placeholder:text-zinc-600'
						/>
					</div>
					<div>
						<label htmlFor={regEmailId} className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-[0.05em] text-zinc-500'>
							EMAIL
						</label>
						<Input
							id={regEmailId}
							name='email'
							type='email'
							placeholder='dev@stash.io'
							autoComplete='email'
							className='border-zinc-700 bg-zinc-900/60 text-sm placeholder:text-zinc-600'
						/>
					</div>
					<div>
						<label htmlFor={regPasswordId} className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-[0.05em] text-zinc-500'>
							CONTRASEÑA
						</label>
						<Input
							id={regPasswordId}
							name='password'
							type='password'
							placeholder='••••••••'
							autoComplete='new-password'
							className='border-zinc-700 bg-zinc-900/60 text-sm placeholder:text-zinc-600'
						/>
					</div>
					<div>
						<label htmlFor={regPasswordConfirmId} className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-[0.05em] text-zinc-500'>
							CONFIRMAR CONTRASEÑA
						</label>
						<Input
							id={regPasswordConfirmId}
							name='passwordConfirm'
							type='password'
							placeholder='••••••••'
							autoComplete='new-password'
							className='border-zinc-700 bg-zinc-900/60 text-sm placeholder:text-zinc-600'
						/>
					</div>

					<Button type='submit' disabled={pending} className='h-11 w-full bg-white text-sm font-semibold text-zinc-900 hover:bg-zinc-200'>
						{pending ? <LoaderCircle className='size-4 animate-spin' /> : 'Crear cuenta'}
					</Button>

					<div className='flex items-center gap-3'>
						<div className='h-px flex-1 bg-zinc-800' />
						<span className='font-mono text-[11px] font-medium uppercase tracking-[0.05em] text-zinc-600'>
							O CONTINUA CON
						</span>
						<div className='h-px flex-1 bg-zinc-800' />
					</div>

					<Button
						type='button'
						variant='ghost'
						disabled={pending}
						onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
						className='h-11 w-full gap-2 border border-zinc-700 bg-zinc-900/60 text-sm font-medium text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'
					>
						<svg className='size-4' viewBox='0 0 16 16' fill='currentColor'>
							<path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z' />
						</svg>
						GitHub Account
					</Button>
				</form>
			)}
		</div>
	)
}
