import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/lib/generated/prisma/client'

const connectionString =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DIRECT_URL or DATABASE_URL is required')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const SYSTEM_ITEM_TYPES = [
  { name: 'Snippet', icon: 'Braces', color: '#3B82F6' },
  { name: 'Prompt', icon: 'MessageSquare', color: '#22C55E' },
  { name: 'Note', icon: 'StickyNote', color: '#EAB308' },
  { name: 'Command', icon: 'Terminal', color: '#6B7280' },
  { name: 'File', icon: 'FileText', color: '#F97316' },
  { name: 'Image', icon: 'Image', color: '#EC4899' },
  { name: 'URL', icon: 'Link', color: '#06B6D4' },
] as const

async function main() {
  console.log('🌱  Seeding system item types...')

  const existing = await prisma.itemType.count({
    where: { isSystem: true, userId: null },
  })

  if (existing > 0) {
    console.log(`ℹ️  ${existing} system item types already exist — skipping`)
    return
  }

  await prisma.itemType.createMany({
    data: SYSTEM_ITEM_TYPES.map((type) => ({
      name: type.name,
      icon: type.icon,
      color: type.color,
      isSystem: true,
    })),
  })

  console.log(`✅  Created ${SYSTEM_ITEM_TYPES.length} system item types`)
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
