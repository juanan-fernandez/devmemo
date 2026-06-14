import { createHash, randomBytes } from 'node:crypto'

import { hash } from 'bcryptjs'

import { normalizeEmail } from '@/lib/auth/email-verification'
import {
	FORGOT_PASSWORD_SUCCESS_MESSAGE,
	PASSWORD_RESET_EMAIL_SUBJECT,
	PASSWORD_RESET_INVALID_TOKEN_MESSAGE
} from '@/lib/auth/password-reset-messages'
import { prisma } from '@/lib/db/prisma'
import { sendMail } from '@/lib/mail/resend'

const PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000

function getAppUrl() {
	const appUrl = process.env.APP_URL?.trim()

	if (!appUrl && process.env.NODE_ENV !== 'test') {
		throw new Error('APP_URL is required to build password reset links')
	}

	return appUrl ?? 'http://localhost:3000'
}

export function hashPasswordResetToken(token: string) {
	return createHash('sha256').update(token).digest('hex')
}

function buildPasswordResetUrl(token: string) {
	const url = new URL('/reset-password', getAppUrl())
	url.searchParams.set('token', token)
	return url.toString()
}

function buildPasswordResetEmail(resetUrl: string) {
	return {
		html: `<p>Hola,</p><p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p><p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p><p><a href="${resetUrl}">Restablecer mi contraseña</a></p><p>Este enlace caduca en 1 hora.</p><p>Si no has solicitado este cambio, puedes ignorar este mensaje.</p>`,
		text: `Hola,\n\nHemos recibido una solicitud para restablecer la contraseña de tu cuenta.\n\nAbre este enlace para crear una nueva contraseña:\n${resetUrl}\n\nEste enlace caduca en 1 hora.\n\nSi no has solicitado este cambio, puedes ignorar este mensaje.`
	}
}

async function createPasswordResetToken(email: string) {
	const rawToken = randomBytes(32).toString('hex')
	const tokenHash = hashPasswordResetToken(rawToken)
	const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS)

	await prisma.$transaction([
		prisma.passwordResetToken.deleteMany({
			where: { email }
		}),
		prisma.passwordResetToken.create({
			data: {
				email,
				tokenHash,
				expiresAt
			}
		})
	])

	return { rawToken, tokenHash }
}

export async function requestPasswordReset(email: string) {
	const normalizedEmail = normalizeEmail(email)
	const user = await prisma.user.findUnique({
		where: { email: normalizedEmail },
		select: { email: true }
	})

	if (!user) {
		return {
			success: true as const,
			message: FORGOT_PASSWORD_SUCCESS_MESSAGE
		}
	}

	const { rawToken, tokenHash } = await createPasswordResetToken(user.email)
	const resetUrl = buildPasswordResetUrl(rawToken)
	const message = buildPasswordResetEmail(resetUrl)

	try {
		await sendMail({
			to: user.email,
			subject: PASSWORD_RESET_EMAIL_SUBJECT,
			html: message.html,
			text: message.text
		})
	} catch (error) {
		await prisma.passwordResetToken.deleteMany({
			where: { tokenHash }
		})

		throw error
	}

	return {
		success: true as const,
		message: FORGOT_PASSWORD_SUCCESS_MESSAGE
	}
}

export async function validatePasswordResetToken(rawToken: string) {
	const tokenHash = hashPasswordResetToken(rawToken)
	const passwordResetToken = await prisma.passwordResetToken.findUnique({
		where: { tokenHash }
	})

	if (!passwordResetToken) {
		return null
	}

	if (passwordResetToken.expiresAt <= new Date()) {
		await prisma.passwordResetToken.delete({
			where: { id: passwordResetToken.id }
		})

		return null
	}

	return passwordResetToken
}

export async function resetPassword(rawToken: string, password: string) {
	const passwordResetToken = await validatePasswordResetToken(rawToken)

	if (!passwordResetToken) {
		return {
			success: false as const,
			message: PASSWORD_RESET_INVALID_TOKEN_MESSAGE
		}
	}

	const normalizedEmail = normalizeEmail(passwordResetToken.email)
	const passwordHash = await hash(password, 12)

	try {
		await prisma.$transaction([
			prisma.user.update({
				where: { email: normalizedEmail },
				data: { password: passwordHash }
			}),
			prisma.passwordResetToken.delete({
				where: { id: passwordResetToken.id }
			}),
			prisma.passwordResetToken.deleteMany({
				where: { email: normalizedEmail }
			})
		])
	} catch {
		await prisma.passwordResetToken.deleteMany({
			where: { email: normalizedEmail }
		})

		return {
			success: false as const,
			message: PASSWORD_RESET_INVALID_TOKEN_MESSAGE
		}
	}

	return {
		success: true as const
	}
}
