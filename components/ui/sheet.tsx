'use client'

import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
	return <SheetPrimitive.Root data-slot='sheet' {...props} />
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
	return <SheetPrimitive.Trigger data-slot='sheet-trigger' {...props} />
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
	return <SheetPrimitive.Close data-slot='sheet-close' {...props} />
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
	return <SheetPrimitive.Portal data-slot='sheet-portal' {...props} />
}

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
	return (
		<SheetPrimitive.Overlay
			data-slot='sheet-overlay'
			className={cn('fixed inset-0 z-50 bg-black/70', className)}
			{...props}
		/>
	)
}

function SheetContent({ className, children, ...props }: React.ComponentProps<typeof SheetPrimitive.Content>) {
	return (
		<SheetPortal>
			<SheetOverlay />
			<SheetPrimitive.Content
				data-slot='sheet-content'
				className={cn(
					'fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-2xl flex-col border-l border-border bg-card shadow-2xl outline-none',
					className
				)}
				{...props}
			>
				{children}
				<SheetPrimitive.Close className='absolute right-4 top-4 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'>
					<X className='size-4' />
					<span className='sr-only'>Cerrar</span>
				</SheetPrimitive.Close>
			</SheetPrimitive.Content>
		</SheetPortal>
	)
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return <div className={cn('flex flex-col gap-1.5 px-6 py-5', className)} {...props} />
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return <div className={cn('mt-auto flex flex-col gap-2 px-6 py-4', className)} {...props} />
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
	return <SheetPrimitive.Title className={cn('text-lg font-semibold text-foreground', className)} {...props} />
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
	return <SheetPrimitive.Description className={cn('text-sm text-muted-foreground', className)} {...props} />
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription }
