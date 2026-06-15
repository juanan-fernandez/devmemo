'use client'

import dynamic from 'next/dynamic'
import { Check, Copy } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { getMonacoLanguage } from '@/lib/items/code-editor'
import { cn } from '@/lib/utils'

type MonacoEditorProps = {
	height?: number | string
	language?: string
	loading?: React.ReactNode
	onChange?: (value: string | undefined) => void
	options?: Record<string, unknown>
	theme?: 'light' | 'vs-dark'
	value?: string
	width?: number | string
}

type LanguageOption = {
	label: string
	value: string
}

type CodeEditorProps = {
	className?: string
	disabled?: boolean
	heightClassName?: string
	invalid?: boolean
	language?: string | null
	languageOptions?: readonly LanguageOption[]
	onChange?: (value: string) => void
	onLanguageChange?: (value: string) => void
	readOnly?: boolean
	value: string
}

const MonacoEditor = dynamic<MonacoEditorProps>(() => import('@monaco-editor/react').then(module => module.default), {
	ssr: false,
	loading: () => <div className='h-full w-full animate-pulse bg-[#18181b]' aria-hidden='true' />
})

export function CodeEditor({
	className,
	disabled = false,
	heightClassName = 'h-60',
	invalid = false,
	language,
	languageOptions,
	onChange,
	onLanguageChange,
	readOnly = false,
	value
}: CodeEditorProps) {
	const [hasCopied, setHasCopied] = useState(false)
	const resolvedLanguage = useMemo(() => getMonacoLanguage(language), [language])
	const languageValue = language?.trim() ? language : 'none'
	const languageLabel = language?.trim() ? language : 'Sin lenguaje'

	const editorOptions = useMemo(
		() => ({
			automaticLayout: true,
			fontSize: 13,
			lineNumbersMinChars: 3,
			minimap: { enabled: false },
			padding: { top: 12, bottom: 12 },
			readOnly,
			renderLineHighlight: 'none',
			scrollBeyondLastLine: false,
			scrollbar: {
				horizontal: 'hidden',
				horizontalScrollbarSize: 0,
				verticalScrollbarSize: 10
			},
			wordWrap: 'on',
			wrappingIndent: 'same'
		}),
		[readOnly]
	)

	async function handleCopy() {
		if (!value || disabled) {
			return
		}

		await navigator.clipboard.writeText(value)
		setHasCopied(true)

		window.setTimeout(() => {
			setHasCopied(false)
		}, 1600)
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
				<div className='flex min-w-0 items-center gap-2'>
					<span className='text-sm font-medium text-foreground'>Contenido</span>
					{languageOptions && onLanguageChange ? (
						<div className='flex items-center gap-2'>
							<span className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>Lenguaje</span>
							<Select value={languageValue} onValueChange={nextValue => onLanguageChange(nextValue === 'none' ? '' : nextValue)}>
								<SelectTrigger className='h-8 min-w-36 rounded-lg bg-background/80 text-xs' disabled={disabled}>
									<SelectValue placeholder='Sin lenguaje' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='none'>Sin lenguaje</SelectItem>
									{languageOptions.map(option => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					) : (
						<span className='rounded-md border border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground'>
							{languageLabel}
						</span>
					)}
				</div>

				<Button type='button' variant='outline' size='sm' onClick={() => void handleCopy()} disabled={disabled || !value}>
					{hasCopied ? <Check className='size-3.5' /> : <Copy className='size-3.5' />}
					{hasCopied ? 'Copiado' : 'Copiar'}
				</Button>
			</div>

			<div className={cn('max-h-[400px] overflow-hidden', heightClassName)}>
				<MonacoEditor
					height='100%'
					width='100%'
					language={resolvedLanguage}
					theme='vs-dark'
					value={value}
					onChange={nextValue => onChange?.(nextValue ?? '')}
					options={editorOptions}
				/>
			</div>
		</div>
	)
}
