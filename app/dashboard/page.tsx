import { redirect } from 'next/navigation'
import {
	Archive,
	Heart,
	FolderHeart,
	Star,
} from 'lucide-react'
import { auth } from '@/auth/auth'
import { getDashboardSummary, getLatestCollections } from '@/lib/db/collections'
import { getDashboardItemsSection } from '@/lib/db/items'

import Link from 'next/link'
import { DashboardSummaryCard } from '@/components/dashboard/dashboard-summary-card'
import { LatestCollectionCard } from '@/components/dashboard/latest-collection-card'
import { PinnedSection } from '@/components/dashboard/pinned-section'

export default async function DashboardPage() {
	const session = await auth()

	if (!session?.user?.id) {
		redirect('/login')
	}

	const userId = session.user.id

	const emptySummary = {
		totalItems: 0,
		totalCollections: 0,
		favoriteItems: 0,
		favoriteCollections: 0
	}

	const emptyItemsSection = {
		title: 'ÚLTIMOS ITEMS' as const,
		mode: 'recent' as const,
		items: []
	}

	const [summary, collections, itemsSection] = await Promise.all([
		userId ? getDashboardSummary(userId) : Promise.resolve(emptySummary),
		userId ? getLatestCollections(userId) : Promise.resolve([]),
		userId ? getDashboardItemsSection(userId) : Promise.resolve(emptyItemsSection)
	])

	const summaryCards = [
		{
			label: 'Total de elementos',
			value: summary.totalItems,
			color: '#84CC16',
			icon: Archive
		},
		{
			label: 'Colecciones',
			value: summary.totalCollections,
			color: '#06B6D4',
			icon: FolderHeart
		},
		{
			label: 'Elementos favoritos',
			value: summary.favoriteItems,
			color: '#EC4899',
			icon: Heart
		},
		{
			label: 'Colecciones favoritas',
			value: summary.favoriteCollections,
			color: '#F59E0B',
			icon: Star
		}
	]

	return (
		<div className='space-y-8'>
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				{summaryCards.map(card => (
					<DashboardSummaryCard key={card.label} {...card} />
				))}
			</div>

			<section>
				<div className='mb-4 flex items-center justify-between'>
					<h2 className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
						Últimas colecciones
					</h2>
					<Link
						href='/collections'
						className='text-xs font-medium text-muted-foreground hover:text-foreground transition-colors'
					>
						VER TODAS
					</Link>
				</div>
				{collections.length > 0 ? (
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{collections.map(collection => (
							<LatestCollectionCard key={collection.id} collection={collection} />
						))}
					</div>
				) : (
					<div className='flex items-center justify-center rounded-xl border-2 border-dashed border-border py-16'>
						<button
							type='button'
							className='inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='16'
								height='16'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								aria-hidden='true'
							>
								<path d='M5 12h14' />
								<path d='M12 5v14' />
							</svg>
							Nueva Colección
						</button>
					</div>
				)}
			</section>

			<PinnedSection items={itemsSection.items} title={itemsSection.title} />
		</div>
	)
}
