import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/lib/generated/prisma/client'

const connectionString =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DIRECT_URL or DATABASE_URL is required')
}

async function main() {
  const adapter = new PrismaPg({ connectionString })
  const prisma = new PrismaClient({ adapter })

  console.log('🔌 Testing database connection...')

  const result = await prisma.$queryRaw<{ now: Date }[]>`SELECT now()`
  console.log('✅ Connected — server time:', result[0].now)

  const typeCount = await prisma.itemType.count()
  console.log(`📦 Item types in DB: ${typeCount}`)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error('❌ Connection failed:', e)
  process.exit(1)
})
