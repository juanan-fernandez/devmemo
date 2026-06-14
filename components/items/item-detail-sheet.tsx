'use client'

import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, FileText } from 'lucide-react'

import type { DashboardItem, ItemDetail } from '@/lib/db/items'
import { ItemTypeIcon } from '@/lib/item-type-icons'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle
} from '@/components/ui/sheet'
import { ItemActions } from '@/components/items/item-actions'

type ItemDetailSheetProps = {
	item: DashboardItem
	open: boolean
	onOpenChange: (open: boolean) => void
	onDelete?: () => void
}

function formatDate(date: string | Date) {
	return new Intl.DateTimeFormat('es-ES', {
		dateStyle: 'medium',
		timeStyle: 'short'
	}).format(new Date(date))
}

function formatFileSize(bytes: number | null) {
	if (!bytes) return null
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ItemDetailSheet({ item, open, onOpenChange, onDelete }: ItemDetailSheetProps) {
	const [detail, setDetail] = useState<ItemDetail | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!open) {
			return
		}

		let cancelled = false

		async function loadDetail() {
			setLoading(true)
			setError(null)

			try {
				const response = await fetch(`/api/items/${item.id}`, {
					method: 'GET',
					cache: 'no-store'
				})

				const data = await response.json()

				if (!response.ok) {
					throw new Error(data.error || 'No se pudo cargar el detalle del item.')
				}

				if (!cancelled) {
					setDetail(data)
				}
			} catch (loadError) {
				if (!cancelled) {
					setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el detalle del item.')
				}
			} finally {
				if (!cancelled) {
					setLoading(false)
				}
			}
		}

		void loadDetail()

		return () => {
			cancelled = true
		}
	}, [item.id, open])

	const activeItem = detail ?? item
	const hasTags = detail?.tags && detail.tags.length > 0
	const fileSize = detail ? formatFileSize(detail.fileSize) : null
	const createdAt = useMemo(() => formatDate(activeItem.createdAt), [activeItem.createdAt])
	const updatedAt = detail ? formatDate(detail.updatedAt) : null

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className='gap-0 p-0 sm:max-w-2xl'>
				<SheetHeader className='border-b border-border pr-14'>
					<div className='flex items-start justify-between gap-4'>
						<div className='flex min-w-0 items-start gap-3'>
							<div
								className='flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-background'
								style={{ color: activeItem.type.color ?? undefined }}
							>
								<ItemTypeIcon iconName={activeItem.type.icon} className='size-5' color={activeItem.type.color} />
							</div>
							<div className='min-w-0 space-y-1'>
								<SheetTitle className='truncate text-xl'>{activeItem.title}</SheetTitle>
								<SheetDescription className='flex items-center gap-2 text-xs uppercase tracking-wider'>
									<span>Tipo</span>
									<span>·</span>
									<span>{activeItem.type.label}</span>
									{activeItem.language ? (
										<>
											<span>·</span>
											<span>{activeItem.language}</span>
										</>
									) : null}
								</SheetDescription>
							</div>
						</div>
						<ItemActions
							itemId={activeItem.id}
							itemTitle={activeItem.title}
							isFavorite={activeItem.isFavorite}
							isPinned={activeItem.isPinned}
							onDelete={() => {
								onOpenChange(false)
								onDelete?.()
							}}
						/>
					</div>
				</SheetHeader>

				<div className='flex-1 overflow-y-auto px-6 py-5'>
					{loading ? (
						<div className='space-y-4' aria-live='polite'>
							<div className='h-5 w-40 animate-pulse rounded bg-accent' />
							<div className='space-y-2'>
								<div className='h-4 w-full animate-pulse rounded bg-accent' />
								<div className='h-4 w-5/6 animate-pulse rounded bg-accent' />
								<div className='h-4 w-2/3 animate-pulse rounded bg-accent' />
							</div>
							<div className='grid gap-3 sm:grid-cols-2'>
								<div className='h-24 animate-pulse rounded-2xl bg-accent' />
								<div className='h-24 animate-pulse rounded-2xl bg-accent' />
							</div>
						</div>
					) : error ? (
						<div className='rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground'>
							<p className='font-medium text-destructive'>No se pudo cargar el detalle del item.</p>
							<p className='mt-1 text-muted-foreground'>{error}</p>
							<Button className='mt-4' variant='outline' onClick={() => onOpenChange(false)}>
								Cerrar
							</Button>
						</div>
					) : (
						<div className='space-y-6'>
							{activeItem.description ? (
								<section className='space-y-2'>
									<h3 className='text-sm font-semibold text-foreground'>Descripción</h3>
									<p className='text-sm leading-6 text-muted-foreground'>{activeItem.description}</p>
								</section>
							) : null}

							{detail?.content ? (
								<section className='space-y-2'>
									<h3 className='text-sm font-semibold text-foreground'>Contenido</h3>
									<div className='overflow-x-auto rounded-2xl border border-border bg-background p-4'>
										<pre className='whitespace-pre-wrap break-words text-sm leading-6 text-foreground'>{detail.content}</pre>
									</div>
								</section>
							) : null}

							{detail?.url ? (
								<section className='space-y-3'>
									<h3 className='text-sm font-semibold text-foreground'>Enlace</h3>
									<div className='rounded-2xl border border-border bg-background p-4'>
										<p className='break-all text-sm text-muted-foreground'>{detail.url}</p>
										<a
											href={detail.url}
											target='_blank'
											rel='noreferrer'
											className='mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted'
										>
											<ExternalLink className='size-4' />
											Abrir enlace
										</a>
									</div>
								</section>
							) : null}

							{detail && (detail.fileName || detail.fileUrl || fileSize) ? (
								<section className='space-y-3'>
									<h3 className='text-sm font-semibold text-foreground'>Archivo</h3>
									<div className='rounded-2xl border border-border bg-background p-4'>
										<div className='flex items-start gap-3'>
											<FileText className='mt-0.5 size-4 text-muted-foreground' />
											<div className='space-y-1 text-sm text-muted-foreground'>
												{detail.fileName ? <p><span className='font-medium text-foreground'>Nombre:</span> {detail.fileName}</p> : null}
												{fileSize ? <p><span className='font-medium text-foreground'>Tamaño:</span> {fileSize}</p> : null}
												{detail.fileUrl ? <p className='break-all'><span className='font-medium text-foreground'>URL:</span> {detail.fileUrl}</p> : null}
											</div>
										</div>
									</div>
								</section>
							) : null}

							<div className='grid gap-4 sm:grid-cols-2'>
								{detail?.collection ? (
									<section className='rounded-2xl border border-border bg-background p-4'>
										<h3 className='text-sm font-semibold text-foreground'>Colección</h3>
										<p className='mt-2 text-sm text-muted-foreground'>{detail.collection.name}</p>
									</section>
								) : null}

								{hasTags ? (
									<section className='rounded-2xl border border-border bg-background p-4'>
										<h3 className='text-sm font-semibold text-foreground'>Etiquetas</h3>
										<div className='mt-2 flex flex-wrap gap-2'>
											{detail.tags.map(tag => (
												<span key={tag.id} className='rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground'>
													{tag.name}
												</span>
											))}
										</div>
									</section>
								) : null}
							</div>

							<section className='grid gap-4 sm:grid-cols-2'>
								<div className='rounded-2xl border border-border bg-background p-4'>
									<h3 className='text-sm font-semibold text-foreground'>Creado</h3>
									<p className='mt-2 text-sm text-muted-foreground'>{createdAt}</p>
								</div>
								{updatedAt ? (
									<div className='rounded-2xl border border-border bg-background p-4'>
										<h3 className='text-sm font-semibold text-foreground'>Actualizado</h3>
										<p className='mt-2 text-sm text-muted-foreground'>{updatedAt}</p>
									</div>
								) : null}
							</section>
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	)
}
