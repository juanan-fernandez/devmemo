import { randomUUID } from 'node:crypto'

import { CredentialsSignin } from '@auth/core/errors'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compare, hash } from 'bcryptjs'
import NextAuth from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import Credentials from 'next-auth/providers/credentials'

import authConfig from '@/auth/auth.config'
import { isEmailVerificationEnabled } from '@/lib/auth/email-verification-config'
import { UNVERIFIED_LOGIN_MESSAGE } from '@/lib/auth/email-verification-messages'
import { prisma } from '@/lib/db/prisma'

function normalizeEmail(email: string) {
	return email.trim().toLowerCase()
}

class EmailNotVerifiedError extends CredentialsSignin {
	code = 'email_not_verified'

	constructor() {
		super(UNVERIFIED_LOGIN_MESSAGE)
	}
}

const adapter = {
	...PrismaAdapter(prisma),
	async createUser(user) {
		return prisma.user.create({
			data: {
				...user,
				password: await hash(randomUUID(), 12)
			}
		})
	}
} satisfies Adapter

const credentialsProvider = Credentials({
	credentials: {
		email: {
			label: 'Email',
			type: 'email'
		},
		password: {
			label: 'Password',
			type: 'password'
		}
	},
	authorize: async credentials => {
		if (
			!credentials ||
			typeof credentials.email !== 'string' ||
			typeof credentials.password !== 'string'
		) {
			return null
		}

		const email = normalizeEmail(credentials.email)
		const password = credentials.password

		if (!email || !password) {
			return null
		}

		const user = await prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				name: true,
				email: true,
				password: true,
				emailVerified: true
			}
		})

		if (!user?.password) {
			return null
		}

		const isPasswordValid = await compare(password, user.password)

		if (!isPasswordValid) {
			return null
		}

		if (isEmailVerificationEnabled() && !user.emailVerified) {
			throw new EmailNotVerifiedError()
		}

		return {
			id: user.id,
			name: user.name,
			email: user.email
		}
	}
})

const providers = [
	...(authConfig.providers?.filter(provider => {
		return typeof provider === 'function' || provider.id !== credentialsProvider.id
	}) ?? []),
	credentialsProvider
]

export const { handlers, auth, signIn, signOut } = NextAuth({
	...authConfig,
	adapter,
	providers,
	session: {
		strategy: 'jwt'
	},
	callbacks: {
		async session({ session, token }) {
			if (session.user && token.sub) {
				session.user.id = token.sub
			}

			return session
		}
	}
})
