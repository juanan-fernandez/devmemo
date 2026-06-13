import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import { AuthLayoutShell } from '@/components/auth/auth-layout-shell'
import { buttonVariants } from '@/components/ui/button'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import { validatePasswordResetToken } from '@/lib/auth/password-reset'
import { PASSWORD_RESET_INVALID_TOKEN_MESSAGE } from '@/lib/auth/password-reset-messages'
import { cn } from '@/lib/utils'

type ResetPasswordPageProps = {
	searchParams: Promise<{
		token?: string
	}>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
	const session = await auth()

	if (session?.user) {
		redirect('/dashboard')
	}

	const { token } = await searchParams
	const hasValidToken = typeof token === 'string' && token.trim()
		? Boolean(await validatePasswordResetToken(token))
		: false

	return (
		<AuthLayoutShell
			badge='Actualización segura'
			title={hasValidToken ? 'Crear nueva contraseña' : 'No pudimos validar tu enlace'}
			description={
				hasValidToken
					? 'Introduce tu nueva contraseña.'
					: 'Solicita un nuevo enlace de recuperación para volver a intentarlo.'
			}
			footer={
				<div className='flex flex-wrap items-center gap-3'>
					<Link href='/login' className={cn(buttonVariants({ size: 'lg' }), 'rounded-2xl')}>
						Ir a iniciar sesión
					</Link>
					<Link
						href='/forgot-password'
						className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'rounded-2xl')}
					>
						Solicitar otro enlace
					</Link>
				</div>
			}
		>
			{hasValidToken && token ? (
				<ResetPasswordForm token={token} />
			) : (
				<div
					className='rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-4 text-sm text-foreground'
					role='alert'
					aria-live='assertive'
				>
					{PASSWORD_RESET_INVALID_TOKEN_MESSAGE}
				</div>
			)}
		</AuthLayoutShell>
	)
}
