import { prisma } from '@/lib/db/prisma'
import { toAppItemType, type AppItemType } from '@/lib/item-types'

export type ProfileUserData = {
	id: string
	name: string | null
	email: string
	image: string | null
	createdAt: Date
	hasPassword: boolean
}

export type ItemTypeStat = {
	type: AppItemType
	count: number
}

export type UsageStats = {
	totalItems: number
	totalCollections: number
	itemsByType: ItemTypeStat[]
}

export async function getUserProfile(userId: string): Promise<ProfileUserData | null> {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			email: true,
			image: true,
			createdAt: true
		}
	})

	if (!user) return null

	const credentialsAccount = await prisma.account.findFirst({
		where: { userId, provider: 'credentials' },
		select: { id: true }
	})

	return {
		...user,
		hasPassword: credentialsAccount !== null
	}
}

export async function getUserUsageStats(userId: string): Promise<UsageStats> {
	const [totalItems, totalCollections, itemsWithType] = await Promise.all([
		prisma.item.count({ where: { userId } }),
		prisma.collection.count({ where: { userId } }),
		prisma.item.findMany({
			where: { userId },
			select: {
				type: {
					select: {
						id: true,
						name: true,
						icon: true,
						color: true,
						isSystem: true,
						userId: true
					}
				}
			}
		})
	])

	const typeMap = new Map<string, { type: AppItemType; count: number }>()

	for (const item of itemsWithType) {
		const appType = toAppItemType(item.type)
		const existing = typeMap.get(appType.id)

		if (existing) {
			existing.count++
		} else {
			typeMap.set(appType.id, { type: appType, count: 1 })
		}
	}

	const itemsByType = Array.from(typeMap.values()).sort((a, b) => b.count - a.count)

	return {
		totalItems,
		totalCollections,
		itemsByType
	}
}
