import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
	const connectionString = process.env.DATABASE_URL

	if (!connectionString) {
		throw new Error('DATABASE_URL is required to initialize Prisma')
	}

	const adapter = new PrismaPg({ connectionString })
	return new PrismaClient({ adapter })
}

const prismaClient = process.env.NODE_ENV === 'production'
	? globalForPrisma.prisma ?? prismaClientSingleton()
	: prismaClientSingleton()

if (process.env.NODE_ENV === 'production') {
	globalForPrisma.prisma = prismaClient
}

export const prisma = prismaClient
