'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, ExternalLink, FileText, LoaderCircle, PencilLine } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { updateItemAction } from '@/actions/items/update-item'
import type { DashboardItem, ItemDetail } from '@/lib/db/items'
import {
	getEditableItemCapabilities,
	parseTagsInput,
	EDITABLE_ITEM_LANGUAGE_OPTIONS
} from '@/lib/items/editable-item'
import { supportsCodeEditor } from '@/lib/items/code-editor'
import { getCanonicalItemTypeBySlug } from '@/lib/item-types'
import { ItemTypeIcon } from '@/lib/item-type-icons'
import { CodeEditor } from '@/components/items/code-editor'
import { MarkdownEditor } from '@/components/items/markdown-editor'
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
	const closeRefreshTimeoutRef = useRef<number | null>(null)
	const [detail, setDetail] = useState<ItemDetail | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [isEditing, setIsEditing] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [saveError, setSaveError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [fieldErrors, setFieldErrors] = useState<ItemEditFieldErrors>({})
	const [formValues, setFormValues] = useState<ItemEditFormValues>(() => buildFormValues(item))
	const [hasPendingListRefresh, setHasPendingListRefresh] = useState(false)

	function handleSheetOpenChange(nextOpen: boolean) {
		if (nextOpen) {
			if (closeRefreshTimeoutRef.current !== null && typeof window !== 'undefined') {
				window.clearTimeout(closeRefreshTimeoutRef.current)
				router.refresh()
				closeRefreshTimeoutRef.current = null
			}

			setIsEditing(false)
			setSaveError(null)
			setFieldErrors({})
			setSuccessMessage(null)
			setFormValues(buildFormValues(detail ?? item))
		}

		onOpenChange(nextOpen)

		if (!nextOpen && hasPendingListRefresh) {
			if (typeof window !== 'undefined') {
				closeRefreshTimeoutRef.current = window.setTimeout(() => {
					router.refresh()
					closeRefreshTimeoutRef.current = null
				}, 340)
			} else {
				router.refresh()
			}

			setHasPendingListRefresh(false)
		}
	}

	useEffect(() => {
		return () => {
			if (closeRefreshTimeoutRef.current !== null && typeof window !== 'undefined') {
				window.clearTimeout(closeRefreshTimeoutRef.current)
			}
		}
	}, [])

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
	const fileSize = detail ? formatFileSize(detail.fileSize) : null
	const createdAt = useMemo(() => formatDate(activeItem.createdAt), [activeItem.createdAt])
	const updatedAt = detail ? formatDate(detail.updatedAt) : null
	const activeItemTypeKey = useMemo(() => getCanonicalTypeKey(activeItem.type.href), [activeItem.type.href])
	const capabilities = useMemo(() => getEditableItemCapabilities(activeItemTypeKey), [activeItemTypeKey])
	const usesCodeEditor = useMemo(() => supportsCodeEditor(activeItemTypeKey), [activeItemTypeKey])
	const usesMarkdownEditor = activeItemTypeKey === 'prompt'
	const collectionName = detail?.collection?.name ?? 'Sin colección'
	const tags = detail?.tags ?? []

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

			setHasPendingListRefresh(true)

			try {
				const refreshedDetail = await fetchDetail()
				setDetail(refreshedDetail)
				setFormValues(buildFormValues(refreshedDetail))
			} catch {
				setDetail(currentDetail => {
					if (!currentDetail) {
						return currentDetail
					}

					return {
						...currentDetail,
						title: formValues.title,
						description: formValues.description,
						content: capabilities.canEditContent ? formValues.content : currentDetail.content,
						language: capabilities.canEditLanguage ? formValues.language : currentDetail.language,
						url: capabilities.canEditUrl ? formValues.url : currentDetail.url,
						tags: parseTagsInput(formValues.tags).map(tagName => ({
							id: `optimistic-${tagName}`,
							name: tagName
						})),
						updatedAt: new Date()
					}
				})
				setFormValues(currentValues => ({ ...currentValues }))
			}

			setIsEditing(false)
			setSuccessMessage(result.success || 'Cambios guardados correctamente.')
		} catch {
			setSaveError('No se han podido guardar los cambios.')
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

	function handleSheetActionStatusChange(nextState: { isFavorite?: boolean; isPinned?: boolean }) {
		setHasPendingListRefresh(true)

		setDetail(currentDetail => {
			if (!currentDetail) {
				return currentDetail
			}

			return {
				...currentDetail,
				...(nextState.isFavorite !== undefined ? { isFavorite: nextState.isFavorite } : {}),
				...(nextState.isPinned !== undefined ? { isPinned: nextState.isPinned } : {})
			}
		})
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
									refreshOnSuccess={false}
									onStatusChange={handleSheetActionStatusChange}
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

									<div className='space-y-2'>
										<label className='text-sm font-medium text-foreground' htmlFor='item-edit-description'>
											Descripción
										</label>
										<textarea
											id='item-edit-description'
											value={formValues.description}
											onChange={event => handleFieldChange('description', event.target.value)}
											className='w-full rounded-xl border border-input bg-background/60 px-4 py-2 text-sm leading-5 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 resize-none'
											rows={2}
											placeholder='Añade una descripción breve'
											aria-invalid={fieldErrors.description ? true : undefined}
										/>
										{renderFieldError('description')}
									</div>

									<div className='space-y-2'>
										<label className='text-sm font-medium text-foreground' htmlFor='item-edit-tags'>
											Etiquetas
										</label>
										<Input
											id='item-edit-tags'
											value={formValues.tags}
											onChange={event => handleFieldChange('tags', event.target.value)}
											className='h-11 rounded-xl bg-background/60 px-4'
											placeholder='react, nextjs, prisma (debes separar las etiquetas con comas)'
											aria-invalid={fieldErrors.tags ? true : undefined}
										/>
										{renderFieldError('tags')}
									</div>
									</section>

									{capabilities.canEditContent ? (
										<section className='space-y-4 rounded-3xl border border-border bg-card/60 p-5'>
											{usesCodeEditor ? (
												<CodeEditor
													value={formValues.content}
													language={formValues.language}
													onChange={value => handleFieldChange('content', value)}
													onLanguageChange={value => handleFieldChange('language', value)}
													languageOptions={EDITABLE_ITEM_LANGUAGE_OPTIONS}
													disabled={isSaving}
													invalid={fieldErrors.content || fieldErrors.language ? true : undefined}
													heightClassName='h-[320px]'
												/>
											) : usesMarkdownEditor ? (
												<MarkdownEditor
													textareaId='item-edit-content'
													value={formValues.content}
													onChange={value => handleFieldChange('content', value)}
													disabled={isSaving}
													invalid={fieldErrors.content ? true : undefined}
													heightClassName='min-h-[280px] max-h-[400px]'
												/>
											) : (
												<>
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
												</>
											)}
											{renderFieldError('content')}
											{usesCodeEditor ? renderFieldError('language') : null}
										</section>
									) : null}

									{capabilities.canEditLanguage && !usesCodeEditor ? (
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

							{!isEditing && detail && (usesMarkdownEditor || detail.content) ? (
								<section className='space-y-2'>
									{usesCodeEditor ? (
										<CodeEditor
											value={detail.content ?? ''}
											language={detail.language}
											readOnly
											heightClassName='h-[320px]'
										/>
									) : usesMarkdownEditor ? (
										<MarkdownEditor value={detail.content ?? ''} readOnly heightClassName='max-h-[400px]' />
									) : (
										<>
											<h3 className='text-sm font-semibold text-foreground'>Contenido</h3>
											<div className='overflow-x-auto rounded-2xl border border-border bg-background p-4'>
												<pre className='whitespace-pre-wrap break-words text-sm leading-6 text-foreground'>{detail.content}</pre>
											</div>
										</>
									)}
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

							{!isEditing ? (
								<section className='rounded-3xl border border-border bg-card/60 p-5'>
									<div className='grid gap-4 sm:grid-cols-2'>
										<div>
											<h3 className='text-sm font-semibold text-foreground'>Creado</h3>
											<p className='mt-2 text-sm text-muted-foreground'>{createdAt}</p>
										</div>
										<div>
											<h3 className='text-sm font-semibold text-foreground'>Colección</h3>
											<p className='mt-2 text-sm text-muted-foreground'>{collectionName}</p>
										</div>
										{updatedAt ? (
											<div>
												<h3 className='text-sm font-semibold text-foreground'>Actualizado</h3>
												<p className='mt-2 text-sm text-muted-foreground'>{updatedAt}</p>
											</div>
										) : null}
									</div>

									<div className='mt-5 border-t border-border/70 pt-5'>
										<h3 className='text-sm font-semibold text-foreground'>Tags</h3>
										{tags.length > 0 ? (
											<div className='mt-2 flex flex-wrap gap-2'>
												{tags.map(tag => (
													<span key={tag.id} className='rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground'>
														{tag.name}
													</span>
												))}
											</div>
										) : (
											<div className='mt-2 min-h-6' aria-hidden='true' />
										)}
									</div>
								</section>
							) : null}
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	)
}
