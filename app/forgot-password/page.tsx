import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { AuthLayoutShell } from '@/components/auth/auth-layout-shell'

export default async function ForgotPasswordPage() {
	const session = await auth()

	if (session?.user) {
		redirect('/dashboard')
	}

	return (
		<AuthLayoutShell
			badge='Recuperación segura'
			title='Recuperar contraseña'
			description='Introduce el e-mail con el que te registraste y te enviaremos un enlace para restablecer tu contraseña.'
			footer={
				<p>
					¿Ya recuerdas tu contraseña?{' '}
					<Link
						href='/login'
						className='font-semibold text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
					>
						Volver a iniciar sesión
					</Link>
				</p>
			}
		>
			<ForgotPasswordForm />
		</AuthLayoutShell>
	)
}
