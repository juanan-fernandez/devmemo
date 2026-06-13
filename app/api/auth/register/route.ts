import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'

import {
	normalizeEmail,
	sendVerificationEmail
} from '@/lib/auth/email-verification'
import { REGISTRATION_VERIFICATION_MESSAGE } from '@/lib/auth/email-verification-messages'
import { prisma } from '@/lib/db/prisma'

const PASSWORD_ERROR =
	'La contraseña debe tener al menos 8 caracteres y un número o símbolo.'

type RegisterRequestBody = {
	name?: unknown
	email?: unknown
	password?: unknown
	passwordConfirm?: unknown
}

function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0
}

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPassword(password: string) {
	return password.length >= 8 && /[\d\W_]/.test(password)
}

function isUniqueConstraintError(error: unknown) {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		error.code === 'P2002'
	)
}

export async function POST(request: Request) {
	let body: RegisterRequestBody

	try {
		body = (await request.json()) as RegisterRequestBody
	} catch {
		return NextResponse.json({ error: 'El cuerpo de la solicitud no es válido.' }, { status: 400 })
	}

	const { name, email, password, passwordConfirm } = body

	if (
		!isNonEmptyString(name) ||
		!isNonEmptyString(email) ||
		typeof password !== 'string' ||
		typeof passwordConfirm !== 'string'
	) {
		return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 })
	}

	const normalizedName = name.trim()
	const normalizedEmail = normalizeEmail(email)

	if (!isValidEmail(normalizedEmail)) {
		return NextResponse.json({ error: 'El correo electrónico no es válido.' }, { status: 400 })
	}

	if (!isValidPassword(password)) {
		return NextResponse.json({ error: PASSWORD_ERROR }, { status: 400 })
	}

	if (password !== passwordConfirm) {
		return NextResponse.json({ error: 'Las contraseñas no coinciden.' }, { status: 400 })
	}

	const existingUser = await prisma.user.findUnique({
		where: { email: normalizedEmail },
		select: { id: true }
	})

	if (existingUser) {
		return NextResponse.json({ error: 'Ya existe una cuenta con ese correo electrónico.' }, { status: 409 })
	}

	try {
		const passwordHash = await hash(password, 10)

		const user = await prisma.user.create({
			data: {
				name: normalizedName,
				email: normalizedEmail,
				password: passwordHash,
				emailVerified: null
			},
			select: {
				id: true,
				name: true,
				email: true
			}
		})

		await sendVerificationEmail({
			email: user.email,
			name: user.name
		})

		return NextResponse.json(
			{
				message: REGISTRATION_VERIFICATION_MESSAGE,
				user
			},
			{ status: 201 }
		)
	} catch (error) {
		if (isUniqueConstraintError(error)) {
			return NextResponse.json({ error: 'Ya existe una cuenta con ese correo electrónico.' }, { status: 409 })
		}

		throw error
	}
}
