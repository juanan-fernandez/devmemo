import Link from 'next/link'

type AuthLayoutShellProps = {
	children: React.ReactNode
	title: string
	description: string
	badge: string
	footer: React.ReactNode
}

export function AuthLayoutShell({
	children,
	title,
	description,
	badge,
	footer
}: AuthLayoutShellProps) {
	return (
		<main className='relative min-h-dvh overflow-hidden bg-background text-foreground'>
			<div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(227,226,231,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(145,144,149,0.12),transparent_28%)]' />
			<div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:42px_42px] opacity-25' />
			<div className='relative mx-auto flex min-h-dvh max-w-7xl flex-col px-6 py-8 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10 lg:py-10'>
				<section className='hidden min-h-[36rem] flex-col justify-between rounded-[2rem] border border-border/70 bg-card/60 p-10 shadow-[0_32px_120px_rgba(0,0,0,0.28)] backdrop-blur lg:flex'>
					<div className='space-y-6'>
						<div className='inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-background/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground'>
							<span className='size-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,0.85)]' />
							{badge}
						</div>
						<div className='space-y-4'>
							<p className='font-heading text-5xl font-bold leading-none text-balance'>
								Tu memoria técnica, siempre a mano.
							</p>
							<p className='max-w-xl text-base leading-7 text-muted-foreground'>
								Guarda snippets, prompts, notas y recursos en un espacio limpio, rápido y pensado
								para desarrolladores que no quieren perder contexto.
							</p>
						</div>
					</div>
					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='rounded-2xl border border-border/70 bg-background/80 p-5'>
							<p className='text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground'>
								Organiza
							</p>
							<p className='mt-3 text-lg font-semibold'>Colecciones, favoritos y tipos listos para usar</p>
						</div>
						<div className='rounded-2xl border border-border/70 bg-background/80 p-5'>
							<p className='text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground'>
								Recupera
							</p>
							<p className='mt-3 text-lg font-semibold'>Búsqueda rápida para volver a cualquier idea</p>
						</div>
					</div>
				</section>

				<section className='flex min-h-full items-center justify-center py-8 lg:py-0'>
					<div className='w-full max-w-xl rounded-[2rem] border border-border/80 bg-card/88 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.34)] backdrop-blur xl:p-8'>
						<div className='mb-8 flex items-center justify-between gap-4'>
							<div>
								<Link
									href='/'
									className='inline-flex items-center rounded-full border border-border/80 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground transition hover:border-ring hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
								>
									DevMemo
								</Link>
								<h1 className='mt-4 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl'>
									{title}
								</h1>
								<p className='mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base'>
									{description}
								</p>
							</div>
						</div>

						{children}

						<div className='mt-8 border-t border-border/70 pt-5 text-sm text-muted-foreground'>
							{footer}
						</div>
					</div>
				</section>
			</div>
		</main>
	)
}
