import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/auth/auth'

type HomePageProps = {
	searchParams: Promise<{
		accountDeleted?: string
	}>
}

export default async function Home({ searchParams }: HomePageProps) {
	const session = await auth()

	if (session?.user) {
		redirect('/dashboard')
	}

	const params = await searchParams
	const showAccountDeletedMessage = params.accountDeleted === 'true'

	return (
		<div className='min-h-screen bg-zinc-950 text-[#f4f4f5]'>
			{/* 1. Top Navigation Bar */}
			<nav className='sticky top-0 z-50 flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950/95 px-6 backdrop-blur'>
				<Link href='/' className='font-heading text-lg font-bold tracking-tight'>
					DevMemo
				</Link>
				<div className='flex items-center gap-4'>
					<Link
						href='/login'
						className='text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-200'
					>
						LOGIN
					</Link>
					<Link
						href='/register'
						className='rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200'
					>
						EMPEZAR GRATIS
					</Link>
				</div>
			</nav>

			{/* Account Deleted Message */}
			{showAccountDeletedMessage && (
				<div className='mx-auto mt-4 max-w-3xl px-6'>
					<div
						className='rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-5 py-3 text-center text-sm text-emerald-400'
						role='status'
						aria-live='polite'
					>
						Tu cuenta se ha eliminado correctamente.
					</div>
				</div>
			)}

			{/* 2. Hero Section */}
			<section className='mx-auto mt-28 max-w-[900px] px-6 text-center md:mt-36'>
				<h1 className='font-heading text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] text-[#f4f4f5] sm:text-6xl md:text-[76px]'>
					Tu segundo cerebro.
					<br />
					Todo en un lugar.
				</h1>
				<p className='mx-auto mt-6 max-w-[720px] text-base leading-relaxed text-zinc-400 md:text-lg'>
					Guarda links, código, comandos, prompts, imágenes y documentos en una bóveda digital diseñada
					para la velocidad y la precisión editorial.
				</p>
			</section>

			{/* 3. Item Preview Cards */}
			<section className='mx-auto mt-10 max-w-[860px] px-6 md:mt-12'>
				<div className='flex flex-col justify-center gap-8 md:flex-row'>
					{/* Snippet Card */}
					<div className='relative flex-1 rounded-xl border border-lime-500/40 bg-[#151518] p-5 shadow-[0_8px_30px_rgba(132,204,22,0.08)]'>
						<div className='absolute left-0 top-0 h-full w-1 rounded-l-xl bg-lime-500' />
						<div className='flex items-start justify-between'>
							<span className='font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-lime-400'>
								SNIPPET
							</span>
						</div>
						<h3 className='mt-3 font-heading text-lg font-semibold text-[#f4f4f5]'>Tailwind Config</h3>
						<pre className='mt-3 overflow-hidden rounded-lg bg-zinc-900/80 p-3 font-mono text-[11px] leading-relaxed text-zinc-400'>
							<code>{`module.exports = {\n  theme: { ... },\n  plugins: [],\n}`}</code>
						</pre>
					</div>

					{/* Link Card */}
					<div className='relative flex-1 rounded-xl border border-blue-500/40 bg-[#151518] p-5 shadow-[0_8px_30px_rgba(59,130,246,0.08)]'>
						<div className='absolute left-0 top-0 h-full w-1 rounded-l-xl bg-blue-500' />
						<div className='flex items-start justify-between'>
							<span className='font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-blue-400'>
								LINK
							</span>
						</div>
						<h3 className='mt-3 font-heading text-lg font-semibold text-[#f4f4f5]'>
							Aesthetic UI References
						</h3>
						<p className='mt-2 text-sm leading-relaxed text-zinc-500'>
							Curated list of premium design patterns for modern SaaS apps...
						</p>
					</div>

					{/* Prompt Card */}
					<div className='relative flex-1 rounded-xl border border-purple-500/40 bg-[#151518] p-5 shadow-[0_8px_30px_rgba(139,92,246,0.08)]'>
						<div className='absolute left-0 top-0 h-full w-1 rounded-l-xl bg-purple-500' />
						<div className='flex items-start justify-between'>
							<span className='font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-purple-400'>
								PROMPT
							</span>
						</div>
						<h3 className='mt-3 font-heading text-lg font-semibold text-[#f4f4f5]'>
							Midjourney Editorial
						</h3>
						<p className='mt-2 font-mono text-sm leading-relaxed text-zinc-400'>
							/imagine prompt: minimalist obsidian texture...
						</p>
					</div>
				</div>
			</section>

			{/* 4. Main CTA Button */}
			<div className='mx-auto mt-10 flex justify-center px-6 md:mt-12'>
				<Link
					href='/register'
					className='inline-flex h-16 w-[180px] items-center justify-center rounded-md bg-white text-base font-semibold text-zinc-900 shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all hover:bg-zinc-200 hover:shadow-[0_0_60px_rgba(255,255,255,0.15)]'
				>
					Empezar gratis
				</Link>
			</div>

			{/* 5. Item-Type Pill Row */}
			<section className='mx-auto mt-52 max-w-[700px] px-6 text-center md:mt-56'>
				<div className='flex flex-wrap items-center justify-center gap-3'>
					{[
						{ label: 'SNIPPETS', color: 'border-lime-500/50 text-lime-400' },
						{ label: 'LINKS', color: 'border-blue-500/50 text-blue-400' },
						{ label: 'PROMPTS', color: 'border-purple-500/50 text-purple-400' },
						{ label: 'DOCS', color: 'border-amber-500/50 text-amber-400' },
						{ label: 'COMMANDS', color: 'border-orange-500/50 text-orange-400' },
						{ label: 'ASSETS', color: 'border-pink-500/50 text-pink-400' }
					].map(pill => (
						<span
							key={pill.label}
							className={`inline-flex h-8 items-center rounded-full border bg-transparent px-4 font-mono text-[11px] font-medium uppercase tracking-[0.05em] ${pill.color}`}
						>
							{pill.label}
						</span>
					))}
				</div>
			</section>

			{/* 6. Auth Card */}
			<section className='mx-auto mt-20 max-w-[500px] px-6 md:mt-24'>
				<div className='rounded-2xl border border-zinc-800 bg-[#18181b] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.4)]'>
					{/* Tabs */}
					<div className='flex border-b border-zinc-800'>
						<Link
							href='/login'
							className='flex-1 border-b-2 border-white pb-3 text-center text-base font-semibold text-white'
						>
							Iniciar sesión
						</Link>
						<Link
							href='/register'
							className='flex-1 pb-3 text-center text-base font-medium text-zinc-500 transition-colors hover:text-zinc-300'
						>
							Crear cuenta
						</Link>
					</div>

					{/* Form Preview */}
					<div className='mt-6 space-y-4'>
						<div>
							<label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-[0.05em] text-zinc-500'>
								EMAIL
							</label>
							<Link href='/login' className='block'>
								<div className='flex h-11 w-full items-center rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 text-sm text-zinc-500 transition-colors hover:border-zinc-600'>
									dev@stash.io
								</div>
							</Link>
						</div>
						<div>
							<label className='mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-[0.05em] text-zinc-500'>
								CONTRASEÑA
							</label>
							<Link href='/login' className='block'>
								<div className='flex h-11 w-full items-center rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 text-sm text-zinc-600 transition-colors hover:border-zinc-600'>
									••••••••
								</div>
							</Link>
						</div>

						<Link
							href='/login'
							className='flex h-11 w-full items-center justify-center rounded-lg bg-white text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200'
						>
							Acceder al Hub
						</Link>

						<div className='flex items-center gap-3'>
							<div className='h-px flex-1 bg-zinc-800' />
							<span className='font-mono text-[11px] font-medium uppercase tracking-[0.05em] text-zinc-600'>
								O CONTINUA CON
							</span>
							<div className='h-px flex-1 bg-zinc-800' />
						</div>

						<Link
							href='/login'
							className='flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/60 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800'
						>
							<svg className='size-4' viewBox='0 0 16 16' fill='currentColor'>
								<path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z' />
							</svg>
							GitHub Account
						</Link>
					</div>
				</div>
			</section>

			{/* 7. Footer */}
			<footer className='mx-auto mt-32 max-w-6xl border-t border-zinc-800 px-6 py-7 md:mt-40'>
				<div className='flex flex-col items-center gap-4 md:flex-row md:justify-between'>
					<div className='text-center md:text-left'>
						<span className='font-heading text-base font-bold text-[#f4f4f5]'>DevMemo</span>
						<p className='mt-1 text-sm text-zinc-500'>The Editorial Hub for Developers & Thinkers.</p>
					</div>
					<div className='flex items-center gap-6 font-mono text-[11px] font-medium uppercase tracking-[0.05em] text-zinc-600'>
						<span>PRIVACIDAD</span>
						<span>© 2024 DEVMEMO CORE</span>
					</div>
				</div>
			</footer>
		</div>
	)
}
