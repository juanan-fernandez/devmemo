import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import { AuthLayoutShell } from '@/components/auth/auth-layout-shell'
import { getAuthErrorMessage } from '@/components/auth/auth-error-messages'
import { LoginForm } from '@/components/auth/login-form'

type LoginPageProps = {
	searchParams: Promise<{
		error?: string
		registered?: string
	}>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const session = await auth()

	if (session?.user) {
		redirect('/dashboard')
	}

	const params = await searchParams
	const errorMessage = getAuthErrorMessage(params.error)
	const showRegisteredMessage = params.registered === 'true'

	return (
		<AuthLayoutShell
			badge='Acceso seguro'
			title='Inicia sesión en tu espacio de trabajo'
			description='Entra con GitHub o con tu correo para recuperar tus snippets, prompts y notas sin perder el hilo.'
			footer={
				<p>
					¿Todavía no tienes cuenta?{' '}
					<Link
						href='/register'
						className='font-semibold text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
					>
						Crear cuenta
					</Link>
				</p>
			}
		>
			<LoginForm errorMessage={errorMessage} showRegisteredMessage={showRegisteredMessage} />
		</AuthLayoutShell>
	)
}
