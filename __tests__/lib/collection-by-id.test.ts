import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getCollectionById } from '@/lib/db/collections'

const { findFirstMock } = vi.hoisted(() => ({
	findFirstMock: vi.fn()
}))

vi.mock('@/lib/db/prisma', () => ({
	prisma: {
		collection: {
			findFirst: findFirstMock
		}
	}
}))

function makeItemType(overrides: Partial<{ id: string; name: string; icon: string; color: string }> = {}) {
	return {
		id: overrides.id ?? 'type_snippets',
		name: overrides.name ?? 'Snippet',
		icon: overrides.icon ?? 'code-2',
		color: overrides.color ?? '#84CC16',
		isSystem: true,
		userId: null
	}
}

describe('getCollectionById', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('returns null when collection does not exist', async () => {
		findFirstMock.mockResolvedValue(null)

		const result = await getCollectionById('user_1', 'col_999')

		expect(result).toBeNull()
		expect(findFirstMock).toHaveBeenCalledWith({
			where: { id: 'col_999', userId: 'user_1' },
			include: { items: { include: { type: true } } }
		})
	})

	it('returns DashboardCollection when collection exists', async () => {
		findFirstMock.mockResolvedValue({
			id: 'col_1',
			name: 'Test Collection',
			description: 'A test collection',
			isFavorite: true,
			createdAt: new Date('2026-01-01'),
			items: [
				{ type: makeItemType() },
				{ type: makeItemType() },
				{ type: makeItemType({ id: 'type_commands', name: 'Command' }) }
			]
		})

		const result = await getCollectionById('user_1', 'col_1')

		expect(result).not.toBeNull()
		expect(result?.id).toBe('col_1')
		expect(result?.name).toBe('Test Collection')
		expect(result?.description).toBe('A test collection')
		expect(result?.isFavorite).toBe(true)
		expect(result?.itemCount).toBe(3)
		expect(result?.typeIcons).toHaveLength(2) // unique types: snippet, command
	})

	it('returns null for wrong user (ownership check)', async () => {
		findFirstMock.mockResolvedValue(null)

		const result = await getCollectionById('user_other', 'col_1')

		expect(result).toBeNull()
	})

	it('handles collection with no description', async () => {
		findFirstMock.mockResolvedValue({
			id: 'col_1',
			name: 'No Desc',
			description: null,
			isFavorite: false,
			createdAt: new Date('2026-01-01'),
			items: []
		})

		const result = await getCollectionById('user_1', 'col_1')

		expect(result?.description).toBeNull()
		expect(result?.itemCount).toBe(0)
		expect(result?.typeIcons).toHaveLength(0)
		expect(result?.predominantType).toBeNull()
	})
})
