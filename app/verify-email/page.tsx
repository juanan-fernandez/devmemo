import Link from 'next/link'

import { AuthLayoutShell } from '@/components/auth/auth-layout-shell'
import { buttonVariants } from '@/components/ui/button'
import {
	VERIFICATION_ERROR_MESSAGE,
	VERIFICATION_SUCCESS_MESSAGE
} from '@/lib/auth/email-verification-messages'
import { verifyEmailToken } from '@/lib/auth/email-verification'
import { cn } from '@/lib/utils'

type VerifyEmailPageProps = {
	searchParams: Promise<{
		token?: string
	}>
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
	const { token } = await searchParams

	const result = token
		? await verifyEmailToken(token)
		: { success: false as const, message: VERIFICATION_ERROR_MESSAGE }

	return (
		<AuthLayoutShell
			badge='Verificación por e-mail'
			title={result.success ? 'Tu e-mail ya está confirmado' : 'No pudimos validar tu enlace'}
			description={
				result.success
					? VERIFICATION_SUCCESS_MESSAGE
					: 'Comprueba el enlace que has abierto o solicita un nuevo e-mail de verificación desde el acceso.'
			}
			footer={
				<div className='flex flex-wrap items-center gap-3'>
					<Link
						href='/login'
						className={cn(buttonVariants({ size: 'lg' }), 'rounded-2xl')}
					>
						Ir a iniciar sesión
					</Link>
					<Link
						href='/register'
						className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'rounded-2xl')}
					>
						Crear otra cuenta
					</Link>
				</div>
			}
		>
			<div
				className={`rounded-2xl border px-4 py-4 text-sm ${
					result.success
						? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
						: 'border-destructive/30 bg-destructive/10 text-foreground'
				}`}
				role='status'
				aria-live='polite'
			>
				{result.success ? VERIFICATION_SUCCESS_MESSAGE : result.message}
			</div>
		</AuthLayoutShell>
	)
}
