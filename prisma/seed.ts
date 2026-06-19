import 'dotenv/config'
import { hash } from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'
import { CANONICAL_SYSTEM_ITEM_TYPES, getCanonicalItemTypeByMockId } from '../lib/item-types'
import { mockCollections, mockItems, mockItemTags, mockTags } from '../lib/mockdata'
import { PrismaClient } from '../lib/db/generated/prisma/client'

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL

if (!connectionString) {
	throw new Error('DIRECT_URL or DATABASE_URL is required')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const DEMO_USER = {
	email: 'demo@devmemo.com',
	name: 'Demo User',
	password: process.env.DEMO_USER_PASSWORD ?? 'demo-password',
	image: 'https://gravatar.com/avatar/6e876962302db3a50286689eb0bef3c5?s=200&d=robohash&r=x'
} as const

function toDate(value: string) {
	return new Date(value)
}

async function ensureSystemItemTypes() {
	const existing = await prisma.itemType.findMany({
		where: { isSystem: true, userId: null }
	})

	const existingNames = new Set(existing.map(type => type.name))
	const missingTypes = CANONICAL_SYSTEM_ITEM_TYPES.filter(type => !existingNames.has(type.dbName))

	if (missingTypes.length > 0) {
		await prisma.itemType.createMany({
			data: missingTypes.map(type => ({
				name: type.dbName,
				icon: type.icon,
				color: type.color,
				isSystem: true
			}))
		})
	}

	const systemTypes = await prisma.itemType.findMany({
		where: { isSystem: true, userId: null }
	})

	return new Map(systemTypes.map(type => [type.name, type]))
}

async function reseedDemoData(systemTypes: Awaited<ReturnType<typeof ensureSystemItemTypes>>) {
	const password = await hash(DEMO_USER.password, 12)

	await prisma.$transaction(async tx => {
		const existingUser = await tx.user.findUnique({
			where: { email: DEMO_USER.email }
		})

		if (existingUser) {
			await tx.user.delete({ where: { id: existingUser.id } })
		}

		const user = await tx.user.create({
			data: {
				email: DEMO_USER.email,
				name: DEMO_USER.name,
				password,
				emailVerified: new Date(),
				image: DEMO_USER.image
			}
		})

		const collectionIdMap = new Map<string, string>()

		for (const collection of mockCollections) {
			const createdCollection = await tx.collection.create({
				data: {
					name: collection.name,
					description: collection.description,
					isFavorite: collection.isFavorite,
					userId: user.id,
					createdAt: toDate(collection.createdAt),
					updatedAt: toDate(collection.updatedAt)
				}
			})

			collectionIdMap.set(collection.id, createdCollection.id)
		}

		const tagIdMap = new Map<string, string>()

		for (const tag of mockTags) {
			const createdTag = await tx.tag.create({
				data: {
					name: tag.name,
					userId: user.id
				}
			})

			tagIdMap.set(tag.id, createdTag.id)
		}

		const itemIdMap = new Map<string, string>()

		for (const item of mockItems) {
			const canonicalType = getCanonicalItemTypeByMockId(item.typeId)

			if (!canonicalType) {
				throw new Error(`Missing canonical item type for mock type: ${item.typeId}`)
			}

			const systemType = systemTypes.get(canonicalType.dbName)

			if (!systemType) {
				throw new Error(`Missing system item type: ${canonicalType.dbName}`)
			}

			const createdItem = await tx.item.create({
				data: {
					title: item.title,
					contentType: item.contentType,
					content: item.content,
					fileUrl: item.fileUrl,
					fileName: item.fileName,
					fileSize: item.fileSize,
					url: item.url,
					description: item.description,
					isFavorite: item.isFavorite,
					isPinned: item.isPinned,
					language: item.language,
					userId: user.id,
					typeId: systemType.id,
					collectionId: item.collectionId ? (collectionIdMap.get(item.collectionId) ?? null) : null,
					createdAt: toDate(item.createdAt),
					updatedAt: toDate(item.updatedAt)
				}
			})

			itemIdMap.set(item.id, createdItem.id)
		}

		for (const itemTag of mockItemTags) {
			const itemId = itemIdMap.get(itemTag.itemId)
			const tagId = tagIdMap.get(itemTag.tagId)

			if (!itemId || !tagId) {
				throw new Error(`Missing item/tag relation for ${itemTag.itemId}:${itemTag.tagId}`)
			}

			await tx.itemTag.create({
				data: {
					itemId,
					tagId
				}
			})
		}
	})
}

async function main() {
	console.log('🌱  Seeding system item types...')
	const systemTypes = await ensureSystemItemTypes()
	console.log(`✅  System item types ready: ${systemTypes.size}`)

	console.log('👤  Seeding demo user, collections, tags, and items...')
	await reseedDemoData(systemTypes)
	console.log('✅  Demo dataset ready')
}

main()
	.catch(error => {
		console.error('❌  Seed failed:', error)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
