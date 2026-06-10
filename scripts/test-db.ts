import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../lib/db/generated/prisma/client'

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL

if (!connectionString) {
	throw new Error('DIRECT_URL or DATABASE_URL is required')
}

async function main() {
	const adapter = new PrismaPg({ connectionString })
	const prisma = new PrismaClient({ adapter })

	console.log('🔌 Testing database connection...')

	const result = await prisma.$queryRaw<{ now: Date }[]>`SELECT now()`
	console.log('✅ Connected — server time:', result[0].now)

	const tableChecks = await Promise.all([
		prisma.user.findFirst().then(row => ({ table: 'User', found: Boolean(row) })),
		prisma.account.findFirst().then(row => ({ table: 'Account', found: Boolean(row) })),
		prisma.session.findFirst().then(row => ({ table: 'Session', found: Boolean(row) })),
		prisma.verificationToken.findFirst().then(row => ({ table: 'VerificationToken', found: Boolean(row) })),
		prisma.item.findFirst().then(row => ({ table: 'Item', found: Boolean(row) })),
		prisma.itemType.findFirst().then(row => ({ table: 'ItemType', found: Boolean(row) })),
		prisma.collection.findFirst().then(row => ({ table: 'Collection', found: Boolean(row) })),
		prisma.tag.findFirst().then(row => ({ table: 'Tag', found: Boolean(row) })),
		prisma.itemTag.findFirst().then(row => ({ table: 'ItemTag', found: Boolean(row) }))
	])

	console.log('📚 Table read check:')

	for (const check of tableChecks) {
		console.log(`- ${check.table}: ${check.found ? '1+ row read successfully' : 'table is empty, query succeeded'}`)
	}

	await prisma.$disconnect()
}

main().catch(e => {
	console.error('❌ Connection failed:', e)
	process.exit(1)
})
