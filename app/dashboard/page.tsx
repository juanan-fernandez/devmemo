import {
	Archive,
	Heart,
	Code2,
	FileText,
	FolderHeart,
	Image,
	Link as LinkIcon,
	MoreHorizontal,
	NotebookPen,
	Sparkles,
	Star,
	TerminalSquare
} from 'lucide-react'
import { getDashboardSummary, getLatestCollections } from '@/lib/db/collections'
import { getDashboardItemsSection } from '@/lib/db/items'

import Link from 'next/link'
import { PinnedSection } from '@/components/dashboard/pinned-section'

// Icon map for system types coming from the database
const systemIconMap: Record<string, React.ElementType> = {
	Braces: Code2,
	MessageSquare: Sparkles,
	Terminal: TerminalSquare,
	StickyNote: NotebookPen,
	FileText: FileText,
	Image: Image,
	Link: LinkIcon
}

function getSystemTypeIcon(iconName: string | null, className?: string) {
	if (!iconName) return <MoreHorizontal className={className} />
	const Icon = systemIconMap[iconName] || MoreHorizontal
	return <Icon className={className} />
}

export default async function DashboardPage() {
	const [summary, collections, itemsSection] = await Promise.all([
		getDashboardSummary(),
		getLatestCollections(),
		getDashboardItemsSection()
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
		<div className='space-y-8 px-8 py-6 md:px-10 xl:px-12'>
			{/* Row 1: Summary cards */}
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				{summaryCards.map(card => (
					<div key={card.label} className='flex items-center gap-4 rounded-xl border border-border bg-card p-5'>
						<div
							className='flex size-12 items-center justify-center rounded-lg'
							style={{ backgroundColor: `${card.color}1A` }}
						>
							<card.icon className='size-6' style={{ color: card.color }} />
						</div>
						<div>
							<p className='text-2xl font-bold' style={{ color: card.color }}>
								{card.value}
							</p>
							<p className='text-sm text-muted-foreground'>{card.label}</p>
						</div>
					</div>
				))}
			</div>

			{/* Row 2: Latest collections */}
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
				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{collections.map(col => {
						const typeColor = col.predominantType?.color ?? '#666'
						return (
							<div key={col.id} className='overflow-hidden rounded-xl border border-border bg-card'>
								<div className='h-1.5 w-full' style={{ backgroundColor: typeColor }} />
								<div className='space-y-2 p-4'>
									<div className='flex items-center gap-2'>
										<span style={{ color: typeColor }}>
											{getSystemTypeIcon(col.predominantType?.icon ?? null, 'size-5')}
										</span>
										<h3 className='font-semibold text-foreground'>{col.name}</h3>
									</div>
									<p className='line-clamp-2 text-sm text-muted-foreground'>{col.description}</p>
									{col.typeIcons.length > 0 && (
										<div className='flex items-center gap-1.5'>
											{col.typeIcons.map((ti, i) => (
												<div
													key={i}
													className='size-3.5 rounded'
													style={{ backgroundColor: ti.color ?? '#666' }}
													title={ti.name}
												/>
											))}
										</div>
									)}
									<div className='flex items-center gap-3 text-xs text-muted-foreground'>
										<span>{col.itemCount} elementos</span>
										{col.isFavorite && (
											<span className='flex items-center gap-1'>
												<Star className='size-3 fill-yellow-500 text-yellow-500' />
												Favorita
											</span>
										)}
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</section>

			{/* Row 3: Pinned items */}
			<PinnedSection items={itemsSection.items} title={itemsSection.title} />
		</div>
	)
}
