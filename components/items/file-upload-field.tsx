'use client'

import Image from 'next/image'
import { LoaderCircle, Trash2, Upload } from 'lucide-react'
import { upload } from '@vercel/blob/client'
import { useRef, useState, useTransition, type ChangeEvent } from 'react'

import { deleteFileAction } from '@/actions/storage/delete-file'
import { createUploadDraftAction } from '@/actions/storage/create-upload-draft'
import { finalizeClientUploadAction } from '@/actions/storage/finalize-client-upload'
import { uploadFileAction } from '@/actions/storage/upload-file'
import { Button } from '@/components/ui/button'
import {
	formatBytes,
	getFileValidationConfig,
	shouldUseClientUpload,
	type UploadItemTypeKey,
	validateFileUploadSelection
} from '@/lib/storage/file-validation'

export type UploadedFileValue = {
	contentType: string
	id: string
	name: string
	pathname: string
	size: number
	url: string
}

type FileUploadFieldProps = {
	disabled: boolean
	error?: string
	label: string
	typeKey: UploadItemTypeKey
	value: UploadedFileValue | null
	onChange: (value: UploadedFileValue | null) => void
}

export function FileUploadField({ disabled, error, label, typeKey, value, onChange }: FileUploadFieldProps) {
	const inputRef = useRef<HTMLInputElement | null>(null)
	const [uploadError, setUploadError] = useState<string | null>(null)
	const [uploadMessage, setUploadMessage] = useState<string | null>(null)
	const [isUploading, startUploadTransition] = useTransition()
	const [isDeleting, setIsDeleting] = useState(false)
	const config = getFileValidationConfig(typeKey)

	function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]

		if (!file) {
			return
		}

		startUploadTransition(async () => {
			setUploadError(null)
			setUploadMessage(null)

			const validation = validateFileUploadSelection({
				name: file.name,
				size: file.size,
				type: file.type,
				typeKey
			})

			if (!validation.success) {
				setUploadError(validation.error)
				resetInputValue()
				return
			}

			if (value) {
				await deleteUploadedFile(value.id)
			}

			try {
				const nextUpload = shouldUseClientUpload(file.size)
					? await uploadFromClient(file, typeKey)
					: await uploadFromServer(file, typeKey)

				onChange(nextUpload)
				setUploadMessage(
					shouldUseClientUpload(file.size)
						? 'Archivo subido directamente desde el navegador.'
						: 'Archivo subido correctamente.'
				)
			} catch (uploadError) {
				setUploadError(uploadError instanceof Error ? uploadError.message : 'No se ha podido subir el archivo.')
				resetInputValue()
			}
		})
	}

	async function handleDeleteClick() {
		if (!value) {
			return
		}

		await deleteUploadedFile(value.id)
		onChange(null)
		setUploadMessage(null)
		resetInputValue()
	}

	async function deleteUploadedFile(uploadId: string) {
		setIsDeleting(true)

		try {
			const result = await deleteFileAction(uploadId)

			if (!result.successful) {
				setUploadError(result.error)
			}
		} finally {
			setIsDeleting(false)
		}
	}

	function resetInputValue() {
		if (inputRef.current) {
			inputRef.current.value = ''
		}
	}

	return (
		<div className='flex flex-col gap-4 rounded-3xl border border-border bg-card/60 p-5'>
			<div className='space-y-2'>
				<label className='text-sm font-medium text-foreground' htmlFor={`file-upload-${typeKey}`}>
					{label}
				</label>
				<p className='text-sm text-muted-foreground'>
					Máximo 10 MB. Las subidas grandes se enviarán directamente desde el navegador.
				</p>
			</div>

			<input
				id={`file-upload-${typeKey}`}
				ref={inputRef}
				type='file'
				accept={config.accept}
				disabled={disabled || isUploading || isDeleting}
				onChange={handleFileChange}
				aria-invalid={error || uploadError ? true : undefined}
				className='flex h-auto w-full min-w-0 rounded-2xl border border-input bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition-colors file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
			/>

			{uploadMessage ? <p className='text-sm text-emerald-500'>{uploadMessage}</p> : null}
			{uploadError ? <p className='text-sm text-destructive'>{uploadError}</p> : null}
			{error ? <p className='text-sm text-destructive'>{error}</p> : null}

			{isUploading ? (
				<div className='flex items-center gap-2 rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm text-muted-foreground'>
					<LoaderCircle className='size-4 animate-spin' />
					Subiendo archivo…
				</div>
			) : null}

			{value ? (
				<div className='space-y-4 rounded-2xl border border-border bg-background/70 p-4'>
					{typeKey === 'image' ? (
						<div className='overflow-hidden rounded-2xl border border-border bg-muted/20'>
							<Image
								src={value.url}
								alt={value.name}
								width={960}
								height={640}
								className='h-auto w-full object-cover'
								sizes='(max-width: 768px) 100vw, 640px'
							/>
						</div>
					) : null}

					<div className='space-y-1 text-sm text-muted-foreground'>
						<p className='font-medium text-foreground'>{value.name}</p>
						<p>{formatBytes(value.size)}</p>
						<p className='break-all'>{value.url}</p>
					</div>

					<div className='flex flex-wrap gap-3'>
						<Button
							type='button'
							variant='outline'
							className='h-10 rounded-2xl'
							onClick={() => inputRef.current?.click()}
							disabled={disabled || isUploading || isDeleting}
						>
							<Upload data-icon='inline-start' />
							Cambiar archivo
						</Button>
						<Button
							type='button'
							variant='outline'
							className='h-10 rounded-2xl text-destructive hover:text-destructive'
							onClick={handleDeleteClick}
							disabled={disabled || isUploading || isDeleting}
						>
							{isDeleting ? (
								<LoaderCircle className='size-4 animate-spin' />
							) : (
								<Trash2 data-icon='inline-start' />
							)}
							Eliminar archivo
						</Button>
					</div>
				</div>
			) : null}
		</div>
	)
}

async function uploadFromServer(file: File, typeKey: UploadItemTypeKey) {
	const formData = new FormData()
	formData.set('type', typeKey)
	formData.set('file', file)

	const result = await uploadFileAction(formData)

	if (!result.successful || !result.upload) {
		throw new Error(result.error ?? 'No se ha podido subir el archivo.')
	}

	return {
		id: result.upload.id,
		url: result.upload.url,
		name: result.upload.name,
		size: result.upload.size,
		contentType: result.upload.contentType,
		pathname: result.upload.pathname
	} satisfies UploadedFileValue
}

async function uploadFromClient(file: File, typeKey: UploadItemTypeKey) {
	// Phase 1: Create the draft on the server to get the structured pathname
	const draftResult = await createUploadDraftAction(typeKey, file.name, file.type, file.size)

	if (!draftResult.successful || !draftResult.uploadId || !draftResult.pathname) {
		throw new Error(draftResult.error ?? 'No se ha podido preparar la subida del archivo.')
	}

	// Phase 2: Upload the file to Vercel Blob using the structured pathname
	const blob = await upload(draftResult.pathname, file, {
		access: 'public',
		handleUploadUrl: '/api/storage/upload',
		clientPayload: JSON.stringify({
			contentType: file.type,
			fileName: file.name,
			size: file.size,
			type: typeKey,
			uploadId: draftResult.uploadId
		})
	})

	// Phase 3: Finalize the upload record via Server Action
	// (onUploadCompleted webhook won't fire in local dev, so we finalize here)
	const finalizeResult = await finalizeClientUploadAction({
		blobUrl: blob.url,
		downloadUrl: blob.downloadUrl,
		pathname: blob.pathname,
		contentType: file.type,
		size: file.size,
		uploadId: draftResult.uploadId
	})

	if (!finalizeResult.successful) {
		throw new Error(finalizeResult.error ?? 'No se ha podido finalizar la subida del archivo.')
	}

	return {
		id: draftResult.uploadId,
		url: blob.url,
		name: file.name,
		size: file.size,
		contentType: file.type,
		pathname: blob.pathname
	} satisfies UploadedFileValue
}
