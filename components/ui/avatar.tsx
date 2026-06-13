import Image from 'next/image'
import { cn } from '@/lib/utils'

type AvatarProps = {
	src?: string | null
	name?: string | null
	email?: string | null
	size?: number
	className?: string
	fallbackClassName?: string
}

function getInitials(name: string | null, email: string | null): string {
	const source = name?.trim() || email?.trim() || '?'

	const words = source.split(/\s+/).filter(Boolean)

	if (words.length >= 2) {
		return (words[0][0]?.toUpperCase() ?? '') + (words[1][0]?.toUpperCase() ?? '')
	}

	return words[0]?.[0]?.toUpperCase() ?? '?'
}

export function Avatar({
	src,
	name,
	email,
	size = 44,
	className,
	fallbackClassName
}: AvatarProps) {
	if (src) {
		return (
			<Image
				src={src}
				alt={name ? `Avatar de ${name}` : 'Avatar de usuario'}
				width={size}
				height={size}
				className={cn('size-full shrink-0 overflow-hidden rounded-full object-cover', className)}
			/>
		)
	}

	const initials = getInitials(name ?? null, email ?? null)

	return (
		<span
			aria-hidden='true'
			className={cn(
				'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-background text-sm font-semibold text-sidebar-foreground',
				className
			)}
			style={{ width: size, height: size }}
		>
			<span className={cn('select-none', fallbackClassName)}>{initials}</span>
		</span>
	)
}
