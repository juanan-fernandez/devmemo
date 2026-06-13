import { BarChart3, Folder, Puzzle } from 'lucide-react'

import { ItemTypeIcon } from '@/lib/item-type-icons'
import type { UsageStats } from '@/lib/db/profile'

type UsageStatsCardProps = {
	stats: UsageStats
}

export function UsageStatsCard({ stats }: UsageStatsCardProps) {
	return (
		<section className='rounded-2xl border border-border bg-card p-6'>
			<h2 className='mb-5 flex items-center gap-2 text-lg font-semibold text-foreground'>
				<BarChart3 className='size-5 text-muted-foreground' />
				Estadísticas
			</h2>

			<div className='mb-5 grid grid-cols-2 gap-4'>
				<div className='rounded-xl border border-border/60 bg-background/50 p-4'>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<Puzzle className='size-4' />
						<span>Items guardados</span>
					</div>
					<p className='mt-1 text-2xl font-bold text-foreground'>{stats.totalItems}</p>
				</div>

				<div className='rounded-xl border border-border/60 bg-background/50 p-4'>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<Folder className='size-4' />
						<span>Colecciones</span>
					</div>
					<p className='mt-1 text-2xl font-bold text-foreground'>{stats.totalCollections}</p>
				</div>
			</div>

			{stats.itemsByType.length > 0 && (
				<div>
					<h3 className='mb-3 text-sm font-medium text-muted-foreground'>Por tipo de item</h3>
					<div className='space-y-2'>
						{stats.itemsByType.map(entry => (
							<div
								key={entry.type.id}
								className='flex items-center gap-3 rounded-xl border border-border/40 bg-background/30 px-4 py-2.5'
							>
								<ItemTypeIcon
									iconName={entry.type.icon}
									color={entry.type.color}
									className='size-4'
								/>
								<span className='flex-1 text-sm text-foreground'>{entry.type.label}</span>
								<span className='text-sm font-semibold text-foreground'>{entry.count}</span>
							</div>
						))}
					</div>
				</div>
			)}
		</section>
	)
}
