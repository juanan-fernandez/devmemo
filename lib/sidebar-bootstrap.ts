import { cache } from 'react'

import { getSidebarCollections, type SidebarCollectionsData } from '@/lib/db/collections'
import { getSidebarItemTypes, type SidebarItemType } from '@/lib/db/items'
import { getSidebarUser, type SidebarUser } from '@/lib/db/user'
import { getSearchIndex, type SearchIndex } from '@/lib/db/search'

export type SidebarBootstrap = {
	sidebarItemTypes: SidebarItemType[]
	sidebarCollections: SidebarCollectionsData
	sidebarUser: SidebarUser | null
	searchIndex: SearchIndex
}

export const getSidebarBootstrap = cache(async (userId: string): Promise<SidebarBootstrap> => {
	const [sidebarItemTypes, sidebarCollections, sidebarUser, searchIndex] = await Promise.all([
		getSidebarItemTypes(userId),
		getSidebarCollections(userId),
		getSidebarUser(userId),
		getSearchIndex(userId)
	])

	return { sidebarItemTypes, sidebarCollections, sidebarUser, searchIndex }
})
