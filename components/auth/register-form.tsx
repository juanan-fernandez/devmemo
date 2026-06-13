'use client'

import { AlertCircle, LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useId, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type FieldErrors = Partial<Record<'name' | 'email' | 'password' | 'passwordConfirm', string>>

type RegisterFormValues = {
	name: string
	email: string
	password: string
	passwordConfirm: string
}

type RegisterSuccessResponse = {
	requiresEmailVerification?: boolean
}

const INITIAL_VALUES: RegisterFormValues = {
	name: '',
	email: '',
	password: '',
	passwordConfirm: ''
}

function validateValues(values: RegisterFormValues) {
	const errors: FieldErrors = {}

	if (!values.name.trim()) {
		errors.name = 'Escribe tu nombre.'
	}

	if (!values.email.trim()) {
		errors.email = 'Escribe tu correo electrónico.'
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
		errors.email = 'Escribe un correo electrónico válido.'
	}

	if (!values.password) {
		errors.password = 'Escribe una contraseña.'
	} else if (values.password.length < 8) {
		errors.password = 'La contraseña debe tener al menos 8 caracteres.'
	} else if (!/[\d\W_]/.test(values.password)) {
		errors.password = 'Añade al menos un número o símbolo a la contraseña.'
	}

	if (!values.passwordConfirm) {
		errors.passwordConfirm = 'Confirma tu contraseña.'
	} else if (values.password !== values.passwordConfirm) {
		errors.passwordConfirm = 'Las contraseñas no coinciden.'
	}

	return errors
}

function getApiErrorMessage(status: number, payload: unknown) {
	if (typeof payload === 'object' && payload !== null && 'error' in payload && typeof payload.error === 'string') {
		if (status === 409) {
			return 'Ya existe una cuenta con ese correo electrónico.'
		}

		if (payload.error === 'Faltan campos obligatorios.') {
			return 'Completa todos los campos antes de continuar.'
		}

		if (payload.error === 'El correo electrónico no es válido.') {
			return 'Escribe un correo electrónico válido.'
		}

		if (payload.error === 'La contraseña debe tener al menos 8 caracteres y un número o símbolo.') {
			return 'La contraseña debe tener al menos 8 caracteres y un número o símbolo.'
		}

		if (payload.error === 'Las contraseñas no coinciden.') {
			return 'Las contraseñas no coinciden.'
		}

		return 'No pudimos crear tu cuenta. Revisa los datos e inténtalo de nuevo.'
	}

	return 'No pudimos crear tu cuenta. Inténtalo de nuevo en unos minutos.'
}

export function RegisterForm() {
	const router = useRouter()
	const nameId = useId()
	const emailId = useId()
	const passwordId = useId()
	const passwordConfirmId = useId()
	const [values, setValues] = useState(INITIAL_VALUES)
	const [errors, setErrors] = useState<FieldErrors>({})
	const [submitError, setSubmitError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	function updateValue(field: keyof RegisterFormValues, value: string) {
		setValues(current => ({ ...current, [field]: value }))
		setErrors(current => {
			if (!current[field]) {
				return current
			}

			const nextErrors = { ...current }
			delete nextErrors[field]
			if ((field === 'password' || field === 'passwordConfirm') && nextErrors.passwordConfirm) {
				delete nextErrors.passwordConfirm
			}
			return nextErrors
		})
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setSubmitError(null)
		const validationErrors = validateValues(values)
		setErrors(validationErrors)

		if (Object.keys(validationErrors).length > 0) {
			return
		}

		setIsSubmitting(true)

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(values)
			})

			if (!response.ok) {
				const payload = (await response.json().catch(() => null)) as unknown
				setSubmitError(getApiErrorMessage(response.status, payload))
				setIsSubmitting(false)
				return
			}

			const payload = (await response.json().catch(() => null)) as RegisterSuccessResponse | null
			const loginUrl = payload?.requiresEmailVerification ? '/login?registered=true' : '/login'

			router.push(loginUrl)
			router.refresh()
		} catch {
			setSubmitError('No pudimos crear tu cuenta. Revisa tu conexión e inténtalo de nuevo.')
			setIsSubmitting(false)
		}
	}

	return (
		<form className='space-y-5' onSubmit={handleSubmit} noValidate>
			{submitError ? (
				<div
					className='flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-foreground'
					role='alert'
					aria-live='assertive'
				>
					<AlertCircle className='mt-0.5 size-4 shrink-0 text-destructive' />
					<p>{submitError}</p>
				</div>
			) : null}

			<div className='space-y-2'>
				<label htmlFor={nameId} className='text-sm font-medium text-foreground'>
					Nombre
				</label>
				<Input
					id={nameId}
					name='name'
					type='text'
					autoComplete='name'
					required
					disabled={isSubmitting}
					value={values.name}
					onChange={event => updateValue('name', event.target.value)}
					placeholder='Tu nombre'
					className='h-12 rounded-2xl bg-background/60 px-4'
					aria-invalid={Boolean(errors.name)}
					aria-describedby={errors.name ? `${nameId}-error` : undefined}
				/>
				{errors.name ? (
					<p id={`${nameId}-error`} className='text-sm text-destructive'>
						{errors.name}
					</p>
				) : null}
			</div>

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
					disabled={isSubmitting}
					value={values.email}
					onChange={event => updateValue('email', event.target.value)}
					placeholder='tu@correo.com'
					className='h-12 rounded-2xl bg-background/60 px-4'
					aria-invalid={Boolean(errors.email)}
					aria-describedby={errors.email ? `${emailId}-error` : undefined}
				/>
				{errors.email ? (
					<p id={`${emailId}-error`} className='text-sm text-destructive'>
						{errors.email}
					</p>
				) : null}
			</div>

			<div className='grid gap-5 sm:grid-cols-2'>
				<div className='space-y-2'>
					<label htmlFor={passwordId} className='text-sm font-medium text-foreground'>
						Contraseña
					</label>
					<Input
						id={passwordId}
						name='password'
						type='password'
						autoComplete='new-password'
						required
						disabled={isSubmitting}
						value={values.password}
						onChange={event => updateValue('password', event.target.value)}
						placeholder='Mínimo 8 caracteres'
						className='h-12 rounded-2xl bg-background/60 px-4'
						aria-invalid={Boolean(errors.password)}
						aria-describedby={errors.password ? `${passwordId}-error` : `${passwordId}-hint`}
					/>
					<p id={`${passwordId}-hint`} className='text-xs text-muted-foreground'>
						Usa al menos 8 caracteres e incluye un número o símbolo.
					</p>
					{errors.password ? (
						<p id={`${passwordId}-error`} className='text-sm text-destructive'>
							{errors.password}
						</p>
					) : null}
				</div>

				<div className='space-y-2'>
					<label htmlFor={passwordConfirmId} className='text-sm font-medium text-foreground'>
						Confirmar contraseña
					</label>
					<Input
						id={passwordConfirmId}
						name='passwordConfirm'
						type='password'
						autoComplete='new-password'
						required
						disabled={isSubmitting}
						value={values.passwordConfirm}
						onChange={event => updateValue('passwordConfirm', event.target.value)}
						placeholder='Repite tu contraseña'
						className='h-12 rounded-2xl bg-background/60 px-4'
						aria-invalid={Boolean(errors.passwordConfirm)}
						aria-describedby={errors.passwordConfirm ? `${passwordConfirmId}-error` : undefined}
					/>
					{errors.passwordConfirm ? (
						<p id={`${passwordConfirmId}-error`} className='text-sm text-destructive'>
							{errors.passwordConfirm}
						</p>
					) : null}
				</div>
			</div>

			<Button
				type='submit'
				size='lg'
				disabled={isSubmitting}
				className='h-12 w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/85'
			>
				{isSubmitting ? <LoaderCircle className='size-4 animate-spin' /> : null}
				Crear cuenta
			</Button>
		</form>
	)
}
