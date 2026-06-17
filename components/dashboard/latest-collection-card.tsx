import { Star } from 'lucide-react'
import Link from 'next/link'
import { ItemTypeIcon } from '@/lib/item-type-icons'
import type { DashboardCollection } from '@/lib/db/collections'

type LatestCollectionCardProps = {
	collection: DashboardCollection
}

export function LatestCollectionCard({ collection }: LatestCollectionCardProps) {
	const typeColor = collection.predominantType?.color ?? '#666'

	return (
		<Link
			href={`/collections/${collection.id}`}
			className='overflow-hidden rounded-xl border border-border bg-card transition-colors hover:bg-accent/30'
		>
			<div className='h-1.5 w-full' style={{ backgroundColor: typeColor }} />
			<div className='space-y-2 p-4'>
				<div className='flex items-center gap-2'>
					<span style={{ color: typeColor }}>
						<ItemTypeIcon iconName={collection.predominantType?.icon} className='size-5' />
					</span>
					<h3 className='font-semibold text-foreground'>{collection.name}</h3>
				</div>
				<p className='line-clamp-2 text-sm text-muted-foreground'>{collection.description}</p>
				{collection.typeIcons.length > 0 ? (
					<div className='flex items-center gap-1.5'>
						{collection.typeIcons.map(typeIcon => (
							<div
								key={`${collection.id}-${typeIcon.id}`}
								className='size-3.5 rounded'
								style={{ backgroundColor: typeIcon.color ?? '#666' }}
								title={typeIcon.name}
							/>
						))}
					</div>
				) : null}
				<div className='flex items-center gap-3 text-xs text-muted-foreground'>
					<span>{collection.itemCount} elementos</span>
					{collection.isFavorite ? (
						<span className='flex items-center gap-1'>
							<Star className='size-3 fill-yellow-500 text-yellow-500' />
							Favorita
						</span>
					) : null}
				</div>
			</div>
		</Link>
	)
}
