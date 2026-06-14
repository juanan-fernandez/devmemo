'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ExternalLink, FileText, LoaderCircle, PencilLine } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { updateItemAction } from '@/actions/items/update-item'
import type { DashboardItem, ItemDetail } from '@/lib/db/items'
import {
	getEditableItemCapabilities,
	parseTagsInput,
	EDITABLE_ITEM_LANGUAGE_OPTIONS
} from '@/lib/items/editable-item'
import { getCanonicalItemTypeBySlug } from '@/lib/item-types'
import { ItemTypeIcon } from '@/lib/item-type-icons'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { ItemActions } from '@/components/items/item-actions'

type ItemDetailSheetProps = {
	item: DashboardItem
	open: boolean
	onOpenChange: (open: boolean) => void
	onDelete?: () => void
}

type ItemEditFormValues = {
	title: string
	description: string
	tags: string
	content: string
	language: string
	url: string
}

type ItemEditFieldErrors = Partial<Record<'title' | 'description' | 'tags' | 'content' | 'language' | 'url', string>>

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

function buildFormValues(source: DashboardItem | ItemDetail | null): ItemEditFormValues {
	if (!source) {
		return {
			title: '',
			description: '',
			tags: '',
			content: '',
			language: '',
			url: ''
		}
	}

	return {
		title: source.title,
		description: source.description ?? '',
		tags: 'tags' in source ? source.tags.map(tag => tag.name).join(', ') : '',
		content: 'content' in source ? source.content ?? '' : '',
		language: source.language ?? '',
		url: 'url' in source ? source.url ?? '' : ''
	}
}

const textareaClassName =
	'min-h-28 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'

function getCanonicalTypeKey(href: string) {
	const slug = href.split('/').filter(Boolean).at(-1)
	return slug ? getCanonicalItemTypeBySlug(slug)?.key ?? null : null
}

export function ItemDetailSheet({ item, open, onOpenChange, onDelete }: ItemDetailSheetProps) {
	const router = useRouter()
	const [detail, setDetail] = useState<ItemDetail | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [isEditing, setIsEditing] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [saveError, setSaveError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [fieldErrors, setFieldErrors] = useState<ItemEditFieldErrors>({})
	const [formValues, setFormValues] = useState<ItemEditFormValues>(() => buildFormValues(item))

	function handleSheetOpenChange(nextOpen: boolean) {
		if (nextOpen) {
			setIsEditing(false)
			setSaveError(null)
			setFieldErrors({})
			setSuccessMessage(null)
			setFormValues(buildFormValues(detail ?? item))
		}

		onOpenChange(nextOpen)
	}

	const fetchDetail = useCallback(async () => {
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

			return data as ItemDetail
		} finally {
			setLoading(false)
		}
	}, [item.id])

	useEffect(() => {
		if (!open) {
			return
		}

		let cancelled = false

		async function loadSheetDetail() {
			try {
				const data = await fetchDetail()

				if (!cancelled) {
					setDetail(data)
					setFormValues(buildFormValues(data))
				}
			} catch (loadError) {
				if (!cancelled) {
					setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el detalle del item.')
				}
			}
		}

		void loadSheetDetail()

		return () => {
			cancelled = true
		}
	}, [fetchDetail, open])

	const activeItem = detail ?? item
	const hasTags = detail?.tags && detail.tags.length > 0
	const fileSize = detail ? formatFileSize(detail.fileSize) : null
	const createdAt = useMemo(() => formatDate(activeItem.createdAt), [activeItem.createdAt])
	const updatedAt = detail ? formatDate(detail.updatedAt) : null
	const capabilities = useMemo(() => getEditableItemCapabilities(getCanonicalTypeKey(activeItem.type.href)), [activeItem.type.href])

	function handleStartEditing() {
		setSuccessMessage(null)
		setSaveError(null)
		setFieldErrors({})
		setFormValues(buildFormValues(detail ?? item))
		setIsEditing(true)
	}

	function handleCancelEditing() {
		setFormValues(buildFormValues(detail ?? item))
		setFieldErrors({})
		setSaveError(null)
		setIsEditing(false)
	}

	function handleFieldChange(field: keyof ItemEditFormValues, value: string) {
		setFormValues(currentValues => ({
			...currentValues,
			[field]: value
		}))

		setFieldErrors(currentErrors => ({
			...currentErrors,
			[field]: undefined
		}))
	}

	async function handleSave() {
		setIsSaving(true)
		setSaveError(null)
		setSuccessMessage(null)
		setFieldErrors({})

		try {
			const result = await updateItemAction({
				itemId: activeItem.id,
				title: formValues.title,
				description: formValues.description,
				tags: parseTagsInput(formValues.tags),
				content: capabilities.canEditContent ? formValues.content : null,
				language: capabilities.canEditLanguage ? formValues.language : null,
				url: capabilities.canEditUrl ? formValues.url : null
			})

			if (!result.successful) {
				setSaveError(result.error || 'No se han podido guardar los cambios.')
				setFieldErrors(result.fieldErrors ?? {})
				return
			}

			const refreshedDetail = await fetchDetail()
			setDetail(refreshedDetail)
			setFormValues(buildFormValues(refreshedDetail))
			router.refresh()
			setIsEditing(false)
			setSuccessMessage(result.success || 'Cambios guardados correctamente.')
		} catch {
			// Router refresh will reconcile the visible UI even if the immediate refetch fails.
			router.refresh()
			setIsEditing(false)
			setSuccessMessage('Cambios guardados correctamente.')
		} finally {
			setIsSaving(false)
		}
	}

	function renderFieldError(field: keyof ItemEditFieldErrors) {
		const message = fieldErrors[field]

		if (!message) {
			return null
		}

		return <p className='text-sm text-destructive'>{message}</p>
	}

	return (
		<Sheet open={open} onOpenChange={handleSheetOpenChange}>
			<SheetContent className='gap-0 p-0 sm:max-w-2xl'>
				<SheetHeader className='border-b border-border'>
					<div className='flex items-start gap-3 pr-14'>
						<div
							className='flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-background'
							style={{ color: activeItem.type.color ?? undefined }}
						>
							<ItemTypeIcon iconName={activeItem.type.icon} className='size-5' color={activeItem.type.color} />
						</div>
						<div className='min-w-0 space-y-1'>
							<SheetTitle className='truncate text-xl'>{isEditing ? 'Editar item' : activeItem.title}</SheetTitle>
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

					<div className='flex items-center justify-end gap-2 pt-3'>
						{isEditing ? (
							<>
								<Button type='button' variant='outline' onClick={handleCancelEditing} disabled={isSaving}>
									Cancelar
								</Button>
								<Button type='button' onClick={handleSave} disabled={isSaving}>
									{isSaving ? <LoaderCircle className='size-4 animate-spin' /> : null}
									Guardar
								</Button>
							</>
						) : (
							<>
								<Button
									type='button'
									variant='ghost'
									size='icon'
									onClick={handleStartEditing}
									disabled={loading || !!error || !detail}
									aria-label='Editar'
									title='Editar'
								>
									<PencilLine className='size-4' />
								</Button>
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
							</>
						)}
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
							{successMessage ? (
								<div
									className='flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-foreground'
									role='status'
									aria-live='polite'
								>
									<CheckCircle2 className='mt-0.5 size-4 shrink-0 text-emerald-400' />
									<p>{successMessage}</p>
								</div>
							) : null}

							{saveError ? (
								<div
									className='rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-foreground'
									role='alert'
									aria-live='assertive'
								>
									{saveError}
								</div>
							) : null}

							{isEditing ? (
								<div className='space-y-6'>
									<section className='space-y-6 rounded-3xl border border-border bg-card/60 p-5'>
										<div className='space-y-4'>
											<label className='text-sm font-medium text-foreground' htmlFor='item-edit-title'>
												Título
											</label>
											<Input
												id='item-edit-title'
												value={formValues.title}
												onChange={event => handleFieldChange('title', event.target.value)}
												className='h-11 rounded-xl bg-background/60 px-4'
												aria-invalid={fieldErrors.title ? true : undefined}
											/>
											{renderFieldError('title')}
										</div>

										<div className='space-y-4'>
											<label className='text-sm font-medium text-foreground' htmlFor='item-edit-description'>
												Descripción
											</label>
											<textarea
												id='item-edit-description'
												value={formValues.description}
												onChange={event => handleFieldChange('description', event.target.value)}
												className={textareaClassName}
												placeholder='Añade una descripción breve'
												aria-invalid={fieldErrors.description ? true : undefined}
											/>
											{renderFieldError('description')}
										</div>

										<div className='space-y-4'>
											<label className='text-sm font-medium text-foreground' htmlFor='item-edit-tags'>
												Etiquetas
											</label>
											<Input
												id='item-edit-tags'
												value={formValues.tags}
												onChange={event => handleFieldChange('tags', event.target.value)}
												className='h-11 rounded-xl bg-background/60 px-4'
												placeholder='react, nextjs, prisma'
												aria-invalid={fieldErrors.tags ? true : undefined}
											/>
											<p className='text-xs text-muted-foreground'>Separa las etiquetas con comas.</p>
											{renderFieldError('tags')}
										</div>
									</section>

									{capabilities.canEditContent ? (
										<section className='space-y-4 rounded-3xl border border-border bg-card/60 p-5'>
											<label className='text-sm font-medium text-foreground' htmlFor='item-edit-content'>
												Contenido
											</label>
											<textarea
												id='item-edit-content'
												value={formValues.content}
												onChange={event => handleFieldChange('content', event.target.value)}
												className={textareaClassName}
												placeholder='Escribe el contenido del item'
												aria-invalid={fieldErrors.content ? true : undefined}
											/>
											{renderFieldError('content')}
										</section>
									) : null}

									{capabilities.canEditLanguage ? (
										<section className='space-y-4 rounded-3xl border border-border bg-card/60 p-5'>
											<label className='text-sm font-medium text-foreground' htmlFor='item-edit-language'>
												Lenguaje
											</label>
											<Select
												value={formValues.language || 'none'}
												onValueChange={value => handleFieldChange('language', value === 'none' ? '' : value)}
												aria-invalid={fieldErrors.language ? true : undefined}
											>
												<SelectTrigger id='item-edit-language'>
													<SelectValue placeholder='Sin lenguaje' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='none'>Sin lenguaje</SelectItem>
													{EDITABLE_ITEM_LANGUAGE_OPTIONS.map(option => (
														<SelectItem key={option.value} value={option.value}>
															{option.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											{renderFieldError('language')}
										</section>
									) : null}

									{capabilities.canEditUrl ? (
										<section className='space-y-4 rounded-3xl border border-border bg-card/60 p-5'>
											<label className='text-sm font-medium text-foreground' htmlFor='item-edit-url'>
												URL
											</label>
											<Input
												id='item-edit-url'
												type='url'
												value={formValues.url}
												onChange={event => handleFieldChange('url', event.target.value)}
												className='h-11 rounded-xl bg-background/60 px-4'
												placeholder='https://example.com'
												aria-invalid={fieldErrors.url ? true : undefined}
											/>
											{renderFieldError('url')}
										</section>
									) : null}

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
							) : activeItem.description ? (
								<section className='space-y-2'>
									<h3 className='text-sm font-semibold text-foreground'>Descripción</h3>
									<p className='text-sm leading-6 text-muted-foreground'>{activeItem.description}</p>
								</section>
							) : null}

							{!isEditing && detail?.content ? (
								<section className='space-y-2'>
									<h3 className='text-sm font-semibold text-foreground'>Contenido</h3>
									<div className='overflow-x-auto rounded-2xl border border-border bg-background p-4'>
										<pre className='whitespace-pre-wrap break-words text-sm leading-6 text-foreground'>{detail.content}</pre>
									</div>
								</section>
							) : null}

							{!isEditing && detail?.url ? (
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

							{!isEditing && detail && (detail.fileName || detail.fileUrl || fileSize) ? (
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
								{!isEditing && detail?.collection ? (
									<section className='rounded-2xl border border-border bg-background p-4'>
										<h3 className='text-sm font-semibold text-foreground'>Colección</h3>
										<p className='mt-2 text-sm text-muted-foreground'>{detail.collection.name}</p>
									</section>
								) : null}

								{!isEditing && hasTags ? (
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

							{!isEditing ? (
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
							) : null}
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	)
}
