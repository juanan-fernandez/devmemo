import { Resend } from 'resend'

type SendMailParams = {
	to: string
	subject: string
	html: string
	text: string
}

function getRequiredEnv(name: 'RESEND_API_KEY' | 'EMAIL_FROM') {
	const value = process.env[name]?.trim()

	if (!value && process.env.NODE_ENV !== 'test') {
		throw new Error(`${name} is required to send transactional emails`)
	}

	return value ?? ''
}

let resendClient: Resend | null = null

function getResendClient() {
	if (!resendClient) {
		resendClient = new Resend(getRequiredEnv('RESEND_API_KEY'))
	}

	return resendClient
}

export async function sendMail({ to, subject, html, text }: SendMailParams) {
	const resend = getResendClient()
	const from = getRequiredEnv('EMAIL_FROM')

	const { error } = await resend.emails.send({
		from,
		to: [to],
		subject,
		html,
		text
	})

	if (error) {
		throw new Error(error.message)
	}
}
