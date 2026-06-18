import { notFound, redirect } from 'next/navigation'
import { auth } from '@/auth/auth'
import { getCanonicalItemTypeBySlug } from '@/lib/item-types'
import { getItemsByTypeName } from '@/lib/db/items'
import { getSidebarItemTypes } from '@/lib/db/items'
import { getSidebarCollections } from '@/lib/db/collections'
import { getSidebarUser } from '@/lib/db/user'
import { getSearchIndex } from '@/lib/db/search'
import { DashboardLayoutShell } from '@/components/dashboard/dashboard-layout-shell'
import { ItemCard } from '@/components/items/item-card'

type ItemListPageProps = {
	params: Promise<{ type: string }>
}

export default async function ItemListPage({ params }: ItemListPageProps) {
	const { type: slug } = await params
	const canonicalType = getCanonicalItemTypeBySlug(slug)

	if (!canonicalType) {
		notFound()
	}

	const session = await auth()

	if (!session?.user?.id) {
		redirect('/login')
	}

	const userId = session.user.id

	const [sidebarItemTypes, sidebarCollections, sidebarUser, { items, totalCount }, searchIndex] = await Promise.all([
		getSidebarItemTypes(userId),
		getSidebarCollections(userId),
		getSidebarUser(userId),
		getItemsByTypeName(userId, canonicalType.dbName),
		getSearchIndex(userId)
	])

	return (
		<DashboardLayoutShell
			sidebarItemTypes={sidebarItemTypes}
			sidebarCollections={sidebarCollections}
			sidebarUser={sidebarUser}
			searchIndex={searchIndex}
		>
			<div className='space-y-6'>
				<div className='flex items-center justify-between'>
					<h1 className='text-xl font-semibold text-foreground'>{canonicalType.name}</h1>
				</div>

				{items.length === 0 ? (
					<div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center'>
						<p className='text-sm text-muted-foreground'>No hay {canonicalType.name.toLowerCase()} todavía.</p>
						<p className='mt-1 text-xs text-muted-foreground'>
							Crea tu primer {canonicalType.singularLabel.toLowerCase()} para empezar.
						</p>
					</div>
				) : (
					<>
						<p className='text-xs text-muted-foreground'>
							{totalCount}{' '}
							{totalCount === 1 ? canonicalType.singularLabel.toLowerCase() : canonicalType.name.toLowerCase()}
						</p>
						<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
							{items.map(item => (
								<ItemCard key={item.id} item={item} />
							))}
						</div>
					</>
				)}
			</div>
		</DashboardLayoutShell>
	)
}
