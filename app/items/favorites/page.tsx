import type { Metadata } from 'next'

import { ItemsPageContent } from '@/components/items/items-page-content'

export const metadata: Metadata = {
	title: 'Items favoritos'
}

export default async function FavoriteItemsPage() {
	return <ItemsPageContent favoritesOnly />
}
