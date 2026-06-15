'use client'

import { CheckCircle2, LoaderCircle, Plus, Save, X } from 'lucide-react'
import { useActionState, useEffect, useId, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { createItem, type CreateItemState } from '@/actions/items/create-item'
import type { SelectableCollection } from '@/lib/db/collections'
import {
	CREATE_ITEM_LANGUAGE_OPTIONS,
	getCreateItemCapabilities,
	type CreateItemField
} from '@/lib/items/create-item'
import { supportsCodeEditor } from '@/lib/items/code-editor'
import { ItemTypeIcon } from '@/lib/item-type-icons'
import type { CanonicalSystemItemType } from '@/lib/item-types'
import { CodeEditor } from '@/components/items/code-editor'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

const INITIAL_CREATE_ITEM_STATE: CreateItemState = {
	error: null,
	successful: false,
	fieldErrors: {}
}

const textareaClassName =
	'min-h-28 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'

type CreateItemDialogProps = {
	canonicalType: CanonicalSystemItemType
	collections: SelectableCollection[]
}

type CreateItemFormProps = CreateItemDialogProps & {
	onCancel: () => void
	onSuccess: () => void
	onPendingChange: (isPending: boolean) => void
}

function getCreateLabel(canonicalType: CanonicalSystemItemType) {
	return `Nue${canonicalType.gender === 'feminine' ? 'va' : 'vo'} ${canonicalType.singularLabel}`
}

export function CreateItemDialog({ canonicalType, collections }: CreateItemDialogProps) {
	const [open, setOpen] = useState(false)
	const [isPending, setIsPending] = useState(false)
	const [formKey, setFormKey] = useState(0)

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen && isPending) {
			return
		}

		setOpen(nextOpen)

		if (!nextOpen) {
			setFormKey(currentKey => currentKey + 1)
		}
	}

	return (
		<>
			<Button type='button' className='h-10 rounded-xl px-4' onClick={() => setOpen(true)}>
				<Plus data-icon='inline-start' />
				{getCreateLabel(canonicalType)}
			</Button>

			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent className='max-h-[90vh] p-0'>
					<CreateItemForm
						key={formKey}
						canonicalType={canonicalType}
						collections={collections}
						onCancel={() => handleOpenChange(false)}
						onSuccess={() => handleOpenChange(false)}
						onPendingChange={setIsPending}
					/>
				</DialogContent>
			</Dialog>
		</>
	)
}

function CreateItemForm({ canonicalType, collections, onCancel, onSuccess, onPendingChange }: CreateItemFormProps) {
	const router = useRouter()
	const formId = useId()
	const [state, action, isPending] = useActionState(createItem, INITIAL_CREATE_ITEM_STATE)
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [tags, setTags] = useState('')
	const [content, setContent] = useState('')
	const [language, setLanguage] = useState('none')
	const [url, setUrl] = useState('')
	const [collectionId, setCollectionId] = useState('none')
	const capabilities = useMemo(() => getCreateItemCapabilities(canonicalType.key), [canonicalType.key])
	const usesCodeEditor = useMemo(() => supportsCodeEditor(canonicalType.key), [canonicalType.key])

	useEffect(() => {
		onPendingChange(isPending)
		return () => onPendingChange(false)
	}, [isPending, onPendingChange])

	useEffect(() => {
		if (!state.successful) {
			return
		}

		router.refresh()

		const timeoutId = window.setTimeout(() => {
			onSuccess()
		}, 2000)

		return () => window.clearTimeout(timeoutId)
	}, [onSuccess, router, state.successful])

	function getFieldError(field: CreateItemField) {
		return state.fieldErrors?.[field]
	}

	if (state.successful) {
		return (
			<>
				<DialogHeader className='sr-only'>
					<DialogTitle>{getCreateLabel(canonicalType)}</DialogTitle>
					<DialogDescription>Item creado correctamente.</DialogDescription>
				</DialogHeader>
				<div className='flex min-h-[360px] flex-col items-center justify-center gap-4 px-8 py-12 text-center'>
					<div
						className='flex size-14 items-center justify-center rounded-2xl border'
						style={{ borderColor: canonicalType.color, color: canonicalType.color }}
					>
						<CheckCircle2 className='size-7' />
					</div>
					<div className='space-y-2'>
						<h2 className='text-xl font-semibold text-foreground'>Item creado correctamente.</h2>
						<p className='text-sm text-muted-foreground'>El diálogo se cerrará automáticamente en unos segundos.</p>
					</div>
				</div>
			</>
		)
	}

	return (
		<form action={action} className='flex max-h-[90vh] flex-col' noValidate>
			<input type='hidden' name='type' value={canonicalType.key} />
			<input type='hidden' name='language' value={language === 'none' ? '' : language} />
			<input type='hidden' name='collectionId' value={collectionId === 'none' ? '' : collectionId} />
			{capabilities.canCreateContent && usesCodeEditor ? <input type='hidden' name='content' value={content} /> : null}

			<DialogHeader className='border-b border-border/70 pr-14'>
				<div className='flex items-start gap-3'>
					<div
						className='flex size-11 shrink-0 items-center justify-center rounded-2xl border bg-background'
						style={{ borderColor: canonicalType.color, color: canonicalType.color }}
					>
						<ItemTypeIcon iconName={canonicalType.icon} className='size-5' color={canonicalType.color} />
					</div>
					<div className='min-w-0 space-y-1'>
						<DialogTitle>{getCreateLabel(canonicalType)}</DialogTitle>
						<DialogDescription>
							Completa los datos para crear un nuevo {canonicalType.singularLabel.toLowerCase()}.
						</DialogDescription>
					</div>
				</div>
			</DialogHeader>

			<div className='flex-1 overflow-y-auto px-6 py-6'>
				<div className='flex flex-col gap-6'>
					{state.error ? (
						<div
							className='rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-foreground'
							role='alert'
							aria-live='assertive'
						>
							{state.error}
						</div>
					) : null}

					<section className='flex flex-col gap-4 rounded-3xl border border-border bg-card/60 p-5'>
						<div className='flex flex-col gap-2'>
							<label htmlFor={`${formId}-title`} className='text-sm font-medium text-foreground'>
								Título
							</label>
							<Input
								id={`${formId}-title`}
								name='title'
								value={title}
								onChange={event => setTitle(event.target.value)}
								disabled={isPending}
								autoFocus
								required
								className='h-11 rounded-xl bg-background/60 px-4'
								aria-invalid={getFieldError('title') ? true : undefined}
							/>
							{getFieldError('title') ? <p className='text-sm text-destructive'>{getFieldError('title')}</p> : null}
						</div>

						<div className='flex flex-col gap-2'>
							<label htmlFor={`${formId}-description`} className='text-sm font-medium text-foreground'>
								Descripción
							</label>
							<Input
								id={`${formId}-description`}
								name='description'
								value={description}
								onChange={event => setDescription(event.target.value)}
								disabled={isPending}
								className='h-11 rounded-xl bg-background/60 px-4'
								placeholder='Añade una descripción breve'
								aria-invalid={getFieldError('description') ? true : undefined}
							/>
							{getFieldError('description') ? <p className='text-sm text-destructive'>{getFieldError('description')}</p> : null}
						</div>

						<div className='flex flex-col gap-2'>
							<label htmlFor={`${formId}-tags`} className='text-sm font-medium text-foreground'>
								Etiquetas
							</label>
							<Input
								id={`${formId}-tags`}
								name='tags'
								value={tags}
								onChange={event => setTags(event.target.value)}
								disabled={isPending}
								className='h-11 rounded-xl bg-background/60 px-4'
								placeholder='react, nextjs, prisma (debes separar las etiquetas con comas)'
								aria-invalid={getFieldError('tags') ? true : undefined}
							/>
							{getFieldError('tags') ? <p className='text-sm text-destructive'>{getFieldError('tags')}</p> : null}
						</div>
					</section>

					{capabilities.canCreateContent ? (
						<section className='flex flex-col gap-4 rounded-3xl border border-border bg-card/60 p-5'>
							{usesCodeEditor ? (
								<CodeEditor
									value={content}
									language={language === 'none' ? '' : language}
									onChange={setContent}
									onLanguageChange={setLanguage}
									languageOptions={CREATE_ITEM_LANGUAGE_OPTIONS}
									disabled={isPending}
									invalid={getFieldError('content') || getFieldError('language') ? true : undefined}
									heightClassName='h-[240px]'
								/>
							) : (
								<>
									<label htmlFor={`${formId}-content`} className='text-sm font-medium text-foreground'>
										Contenido
									</label>
									<textarea
										id={`${formId}-content`}
										name='content'
										value={content}
										onChange={event => setContent(event.target.value)}
										disabled={isPending}
										className={textareaClassName}
										placeholder='Escribe el contenido del item'
										aria-invalid={getFieldError('content') ? true : undefined}
									/>
								</>
							)}
							{getFieldError('content') ? <p className='text-sm text-destructive'>{getFieldError('content')}</p> : null}
						</section>
					) : null}

					{capabilities.canCreateLanguage && !usesCodeEditor ? (
						<section className='flex flex-col gap-4 rounded-3xl border border-border bg-card/60 p-5'>
							<label htmlFor={`${formId}-language`} className='text-sm font-medium text-foreground'>
								Lenguaje
							</label>
							<Select value={language} onValueChange={setLanguage}>
								<SelectTrigger id={`${formId}-language`} aria-invalid={getFieldError('language') ? true : undefined}>
									<SelectValue placeholder='Sin lenguaje' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='none'>Sin lenguaje</SelectItem>
									{CREATE_ITEM_LANGUAGE_OPTIONS.map(option => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{getFieldError('language') ? <p className='text-sm text-destructive'>{getFieldError('language')}</p> : null}
						</section>
					) : null}

					{capabilities.canCreateUrl ? (
						<section className='flex flex-col gap-4 rounded-3xl border border-border bg-card/60 p-5'>
							<label htmlFor={`${formId}-url`} className='text-sm font-medium text-foreground'>
								URL
							</label>
							<Input
								id={`${formId}-url`}
								name='url'
								type='url'
								value={url}
								onChange={event => setUrl(event.target.value)}
								disabled={isPending}
								required
								className='h-11 rounded-xl bg-background/60 px-4'
								placeholder='https://example.com'
								aria-invalid={getFieldError('url') ? true : undefined}
							/>
							{getFieldError('url') ? <p className='text-sm text-destructive'>{getFieldError('url')}</p> : null}
						</section>
					) : null}

					<section className='flex flex-col gap-4 rounded-3xl border border-border bg-card/60 p-5'>
						<label htmlFor={`${formId}-collection`} className='text-sm font-medium text-foreground'>
							Colección
						</label>
						<Select value={collectionId} onValueChange={setCollectionId}>
							<SelectTrigger id={`${formId}-collection`} aria-invalid={getFieldError('collectionId') ? true : undefined}>
								<SelectValue placeholder='Sin colección' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='none'>Sin colección</SelectItem>
								{collections.map(collection => (
									<SelectItem key={collection.id} value={collection.id}>
										{collection.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{getFieldError('collectionId') ? <p className='text-sm text-destructive'>{getFieldError('collectionId')}</p> : null}
					</section>
				</div>
			</div>

			<DialogFooter>
				<Button type='button' variant='outline' className='h-11 rounded-2xl' onClick={onCancel} disabled={isPending}>
					<X data-icon='inline-start' />
					Cancelar
				</Button>
				<Button type='submit' className='h-11 rounded-2xl px-5' disabled={isPending}>
					{isPending ? <LoaderCircle className='size-4 animate-spin' /> : <Save data-icon='inline-start' />}
					Guardar
				</Button>
			</DialogFooter>
		</form>
	)
}
