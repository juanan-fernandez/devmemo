import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db/prisma'

const PASSWORD_ERROR =
	'Password must be at least 8 characters and include a number or special character.'

type RegisterRequestBody = {
	name?: unknown
	email?: unknown
	password?: unknown
	passwordConfirm?: unknown
}

function normalizeEmail(email: string) {
	return email.trim().toLowerCase()
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
		return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
	}

	const { name, email, password, passwordConfirm } = body

	if (
		!isNonEmptyString(name) ||
		!isNonEmptyString(email) ||
		typeof password !== 'string' ||
		typeof passwordConfirm !== 'string'
	) {
		return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
	}

	const normalizedName = name.trim()
	const normalizedEmail = normalizeEmail(email)

	if (!isValidEmail(normalizedEmail)) {
		return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
	}

	if (!isValidPassword(password)) {
		return NextResponse.json({ error: PASSWORD_ERROR }, { status: 400 })
	}

	if (password !== passwordConfirm) {
		return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 })
	}

	const existingUser = await prisma.user.findUnique({
		where: { email: normalizedEmail },
		select: { id: true }
	})

	if (existingUser) {
		return NextResponse.json({ error: 'Email already registered.' }, { status: 409 })
	}

	try {
		const passwordHash = await hash(password, 10)

		const user = await prisma.user.create({
			data: {
				name: normalizedName,
				email: normalizedEmail,
				password: passwordHash
			},
			select: {
				id: true,
				name: true,
				email: true
			}
		})

		return NextResponse.json(
			{
				message: 'Registration successful.',
				user
			},
			{ status: 201 }
		)
	} catch (error) {
		if (isUniqueConstraintError(error)) {
			return NextResponse.json({ error: 'Email already registered.' }, { status: 409 })
		}

		throw error
	}
}
