import { createHash, randomBytes } from 'node:crypto'

import {
	RESEND_VERIFICATION_MESSAGE,
	VERIFICATION_EMAIL_SUBJECT,
	VERIFICATION_ERROR_MESSAGE,
	VERIFICATION_SUCCESS_MESSAGE
} from '@/lib/auth/email-verification-messages'
import { isEmailVerificationEnabled } from '@/lib/auth/email-verification-config'
import { prisma } from '@/lib/db/prisma'
import { sendMail } from '@/lib/mail/resend'

const VERIFICATION_TOKEN_TTL_HOURS = 24

function getAppUrl() {
	const appUrl = process.env.APP_URL?.trim()

	if (!appUrl && process.env.NODE_ENV !== 'test') {
		throw new Error('APP_URL is required to build email verification links')
	}

	return appUrl ?? 'http://localhost:3000'
}

export function normalizeEmail(email: string) {
	return email.trim().toLowerCase()
}

export function hashEmailVerificationToken(token: string) {
	return createHash('sha256').update(token).digest('hex')
}

function buildVerificationUrl(token: string) {
	const url = new URL('/verify-email', getAppUrl())
	url.searchParams.set('token', token)
	return url.toString()
}

function buildVerificationEmail({
	name,
	verificationUrl
}: {
	name?: string | null
	verificationUrl: string
}) {
	const greeting = name?.trim() ? `Hola ${name.trim()},` : 'Hola,'

	return {
		html: `<p>${greeting}</p><p>Gracias por registrarte. Para confirmar tu dirección de e-mail, haz clic en el siguiente enlace:</p><p><a href="${verificationUrl}">Confirmar mi e-mail</a></p><p>Este enlace caduca en 24 horas.</p><p>Si no has creado una cuenta, puedes ignorar este mensaje.</p>`,
		text: `${greeting}\n\nGracias por registrarte. Para confirmar tu dirección de e-mail, abre este enlace:\n${verificationUrl}\n\nEste enlace caduca en 24 horas.\n\nSi no has creado una cuenta, puedes ignorar este mensaje.`
	}
}

export async function createEmailVerificationToken(email: string) {
	const normalizedEmail = normalizeEmail(email)
	const rawToken = randomBytes(32).toString('hex')
	const tokenHash = hashEmailVerificationToken(rawToken)
	const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_HOURS * 60 * 60 * 1000)

	await prisma.$transaction([
		prisma.emailVerificationToken.deleteMany({
			where: { email: normalizedEmail }
		}),
		prisma.emailVerificationToken.create({
			data: {
				email: normalizedEmail,
				tokenHash,
				expiresAt
			}
		})
	])

	return { rawToken, tokenHash, expiresAt }
}

export async function sendVerificationEmail(params: { email: string; name?: string | null }) {
	const normalizedEmail = normalizeEmail(params.email)
	const { rawToken, tokenHash } = await createEmailVerificationToken(normalizedEmail)
	const verificationUrl = buildVerificationUrl(rawToken)
	const message = buildVerificationEmail({
		name: params.name,
		verificationUrl
	})

	try {
		await sendMail({
			to: normalizedEmail,
			subject: VERIFICATION_EMAIL_SUBJECT,
			html: message.html,
			text: message.text
		})
	} catch (error) {
		await prisma.emailVerificationToken.deleteMany({
			where: { tokenHash }
		})

		throw error
	}
}

export async function verifyEmailToken(rawToken: string) {
	const tokenHash = hashEmailVerificationToken(rawToken)
	const verificationToken = await prisma.emailVerificationToken.findUnique({
		where: { tokenHash }
	})

	if (!verificationToken) {
		return {
			success: false as const,
			message: VERIFICATION_ERROR_MESSAGE
		}
	}

	if (verificationToken.expiresAt <= new Date()) {
		await prisma.emailVerificationToken.delete({
			where: { id: verificationToken.id }
		})

		return {
			success: false as const,
			message: VERIFICATION_ERROR_MESSAGE
		}
	}

	const normalizedEmail = normalizeEmail(verificationToken.email)

	await prisma.$transaction([
		prisma.user.update({
			where: { email: normalizedEmail },
			data: {
				emailVerified: new Date()
			}
		}),
		prisma.emailVerificationToken.delete({
			where: { id: verificationToken.id }
		}),
		prisma.emailVerificationToken.deleteMany({
			where: {
				email: normalizedEmail
			}
		})
	])

	return {
		success: true as const,
		message: VERIFICATION_SUCCESS_MESSAGE
	}
}

export async function resendVerificationEmail(email: string) {
	if (!isEmailVerificationEnabled()) {
		return {
			success: true as const,
			message: RESEND_VERIFICATION_MESSAGE
		}
	}

	const normalizedEmail = normalizeEmail(email)
	const user = await prisma.user.findUnique({
		where: { email: normalizedEmail },
		select: {
			email: true,
			name: true,
			emailVerified: true
		}
	})

	if (!user || user.emailVerified) {
		return {
			success: true as const,
			message: RESEND_VERIFICATION_MESSAGE
		}
	}

	await sendVerificationEmail({
		email: user.email,
		name: user.name
	})

	return {
		success: true as const,
		message: RESEND_VERIFICATION_MESSAGE
	}
}
