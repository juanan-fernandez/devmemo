import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'
import { AuthLayoutShell } from '@/components/auth/auth-layout-shell'
import { RegisterForm } from '@/components/auth/register-form'

export default async function RegisterPage() {
	const session = await auth()

	if (session?.user) {
		redirect('/dashboard')
	}

	return (
		<AuthLayoutShell
			badge='Registro rápido'
			title='Crea tu cuenta en minutos'
			description='Empieza a guardar conocimiento técnico en un espacio claro, privado y listo para tu flujo diario.'
			footer={
				<p>
					¿Ya tienes cuenta?{' '}
					<Link
						href='/login'
						className='font-semibold text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
					>
						Iniciar sesión
					</Link>
				</p>
			}
		>
			<RegisterForm />
		</AuthLayoutShell>
	)
}
