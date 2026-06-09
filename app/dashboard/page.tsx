import {
	Archive,
	BookHeart,
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
import { mockCollections, mockItems, mockItemTypes, type MockItemType } from '@/lib/mockdata'

import Link from 'next/link'
import { PinnedSection } from '@/components/dashboard/pinned-section'

const iconMap: Record<string, React.ElementType> = {
	'code-2': Code2,
	sparkles: Sparkles,
	'terminal-square': TerminalSquare,
	'notebook-pen': NotebookPen,
	'file-text': FileText,
	image: Image,
	link: LinkIcon
}

function getItemTypeIcon(type: MockItemType | undefined, className?: string) {
	if (!type) return <MoreHorizontal className={className} />
	const Icon = iconMap[type.icon] || MoreHorizontal
	return <Icon className={className} />
}

function getPredominantType(collectionId: string): MockItemType | undefined {
	const collectionItems = mockItems.filter(i => i.collectionId === collectionId)
	if (collectionItems.length === 0) return undefined

	const typeCounts: Record<string, number> = {}
	collectionItems.forEach(i => {
		typeCounts[i.typeId] = (typeCounts[i.typeId] || 0) + 1
	})
	const predominantTypeId = Object.entries(typeCounts).sort(([, a], [, b]) => b - a)[0][0]
	return mockItemTypes.find(t => t.id === predominantTypeId)
}

const summaryCards = [
	{
		label: 'Total de elementos',
		value: mockItems.length,
		color: '#84CC16',
		icon: Archive
	},
	{
		label: 'Colecciones',
		value: mockCollections.length,
		color: '#06B6D4',
		icon: FolderHeart
	},
	{
		label: 'Elementos favoritos',
		value: mockItems.filter(i => i.isFavorite).length,
		color: '#EC4899',
		icon: BookHeart
	},
	{
		label: 'Colecciones favoritas',
		value: mockCollections.filter(c => c.isFavorite).length,
		color: '#F59E0B',
		icon: Star
	}
]

const latestCollections = [...mockCollections]
	.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
	.slice(0, 3)

const pinnedItems = mockItems.filter(i => i.isPinned)

export default function DashboardPage() {
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
					{latestCollections.map(col => {
						const predominantType = getPredominantType(col.id)
						const typeColor = predominantType?.color ?? '#666'
						return (
							<div key={col.id} className='overflow-hidden rounded-xl border border-border bg-card'>
								<div className='h-1.5 w-full' style={{ backgroundColor: typeColor }} />
								<div className='space-y-2 p-4'>
									<div className='flex items-center gap-2'>
										<span style={{ color: typeColor }}>{getItemTypeIcon(predominantType, 'size-5')}</span>
										<h3 className='font-semibold text-foreground'>{col.name}</h3>
									</div>
									<p className='line-clamp-2 text-sm text-muted-foreground'>{col.description}</p>
									<div className='flex items-center gap-3 text-xs text-muted-foreground'>
										<span>{mockItems.filter(i => i.collectionId === col.id).length} elementos</span>
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
			<PinnedSection items={pinnedItems} />
		</div>
	)
}
