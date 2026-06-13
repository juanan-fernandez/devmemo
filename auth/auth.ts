import { randomUUID } from 'node:crypto'

import { PrismaAdapter } from '@auth/prisma-adapter'
import { hash } from 'bcryptjs'
import NextAuth from 'next-auth'
import type { Adapter } from 'next-auth/adapters'

import authConfig from '@/auth/auth.config'
import { prisma } from '@/lib/db/prisma'

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

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter,
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
	},
	...authConfig
})
