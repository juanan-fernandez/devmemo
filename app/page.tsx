type HomePageProps = {
	searchParams: Promise<{
		accountDeleted?: string
	}>
}

export default async function Home({ searchParams }: HomePageProps) {
	const params = await searchParams
	const showSuccessMessage = params.accountDeleted === 'true'

	return (
		<main className='min-h-screen bg-background px-6 py-16 text-foreground'>
			<div className='mx-auto flex max-w-4xl flex-col gap-6'>
				{showSuccessMessage ? (
					<div
						className='rounded-3xl border border-emerald-500/25 bg-emerald-500/10 px-5 py-4 text-sm text-foreground shadow-[0_18px_60px_-32px_rgba(16,185,129,0.55)]'
						role='status'
						aria-live='polite'
					>
						Tu cuenta se ha eliminado correctamente.
					</div>
				) : null}

				<div className='rounded-[32px] border border-border/70 bg-card/70 p-8 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.55)] backdrop-blur'>
					<h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>DevMemo</h1>
					<p className='mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base'>
						Guarda, organiza y recupera snippets, notas, prompts, archivos y recursos desde un único lugar.
					</p>
				</div>
			</div>
		</main>
	)
}
