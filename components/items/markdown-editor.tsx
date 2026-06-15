'use client'

import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type MarkdownEditorProps = {
	className?: string
	disabled?: boolean
	heightClassName?: string
	invalid?: boolean
	name?: string
	onChange?: (value: string) => void
	placeholder?: string
	readOnly?: boolean
	textareaId?: string
	value: string
}

const markdownContentClassName =
	'max-w-none break-words text-sm leading-6 text-foreground selection:bg-primary/20 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded-md [&_code]:bg-muted/70 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold [&_hr]:my-6 [&_hr]:border-border [&_li]:marker:text-muted-foreground [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/40 [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_tbody_tr]:border-t [&_tbody_tr]:border-border [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-border [&_th]:bg-muted/40 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6'

function MarkdownPreview({ value }: { value: string }) {
	if (!value.trim()) {
		return <p className='text-sm text-muted-foreground'>La vista previa aparecerá aquí.</p>
	}

	return (
		<div className={markdownContentClassName}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					a: ({ node, ...props }) => {
						void node
						return <a {...props} rel='noreferrer' target='_blank' />
					}
				}}
			>
				{value}
			</ReactMarkdown>
		</div>
	)
}

export function MarkdownEditor({
	className,
	disabled = false,
	heightClassName = 'min-h-[240px] max-h-[400px]',
	invalid = false,
	name,
	onChange,
	placeholder = 'Escribe el contenido del item en Markdown',
	readOnly = false,
	textareaId,
	value
}: MarkdownEditorProps) {
	const [hasCopied, setHasCopied] = useState(false)
	const [mode, setMode] = useState<'edit' | 'preview'>('edit')

	useEffect(() => {
		if (!hasCopied) {
			return
		}

		const timeoutId = window.setTimeout(() => {
			setHasCopied(false)
		}, 1600)

		return () => window.clearTimeout(timeoutId)
	}, [hasCopied])

	async function handleCopy() {
		if (!value || disabled || typeof navigator === 'undefined' || !navigator.clipboard) {
			return
		}

		await navigator.clipboard.writeText(value)
		setHasCopied(true)
	}

	return (
		<div
			className={cn(
				'overflow-hidden rounded-2xl border bg-background shadow-sm',
				invalid ? 'border-destructive/60' : 'border-border',
				className
			)}
		>
			<div className='flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/95 px-3 py-2'>
				<div className='flex items-center gap-2'>
					<p className='text-sm font-medium text-foreground'>Contenido Markdown</p>

					{!readOnly ? (
						<div className='flex items-center rounded-lg border border-border bg-muted/30 p-1'>
							<Button
								type='button'
								variant={mode === 'edit' ? 'secondary' : 'ghost'}
								size='sm'
								onClick={() => setMode('edit')}
								className='h-7 rounded-md px-2.5 text-xs'
							>
								Edición
							</Button>
							<Button
								type='button'
								variant={mode === 'preview' ? 'secondary' : 'ghost'}
								size='sm'
								onClick={() => setMode('preview')}
								className='h-7 rounded-md px-2.5 text-xs'
							>
								Vista previa
							</Button>
						</div>
					) : null}
				</div>

				<Button type='button' variant='outline' size='sm' onClick={() => void handleCopy()} disabled={disabled || !value}>
					{hasCopied ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
					{hasCopied ? 'Copiado' : 'Copiar'}
				</Button>
			</div>

			{readOnly ? (
				<div className={cn('overflow-auto p-4', heightClassName)}>
					<MarkdownPreview value={value} />
				</div>
			) : (
				<div className='p-4'>
					<div className='overflow-hidden rounded-2xl border border-border bg-background/60'>
						{mode === 'edit' ? (
							<textarea
								id={textareaId}
								name={name}
								value={value}
								onChange={event => onChange?.(event.target.value)}
								disabled={disabled}
								className={cn(
									'h-full w-full resize-none bg-transparent p-4 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
									heightClassName
								)}
								placeholder={placeholder}
								aria-invalid={invalid ? true : undefined}
							/>
						) : (
							<div className={cn('overflow-auto p-4', heightClassName)}>
								<MarkdownPreview value={value} />
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}
