import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

type DashboardSummaryCardProps = {
	label: string
	value: number
	color: string
	icon: LucideIcon
	href?: string
}

export function DashboardSummaryCard({ label, value, color, icon: Icon, href }: DashboardSummaryCardProps) {
	const content = (
		<>
			<div className='flex size-12 items-center justify-center rounded-lg' style={{ backgroundColor: `${color}1A` }}>
				<Icon className='size-6' style={{ color }} />
			</div>
			<div>
				<p className='text-2xl font-bold' style={{ color }}>
					{value}
				</p>
				<p className='text-sm text-muted-foreground'>{label}</p>
			</div>
		</>
	)

	const className = 'flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent/30'

	if (href) {
		return (
			<Link href={href} className={className}>
				{content}
			</Link>
		)
	}

	return <div className={className}>{content}</div>
}
