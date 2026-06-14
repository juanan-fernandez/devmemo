'use server'

import { revalidatePath } from 'next/cache'

import { auth } from '@/auth/auth'
import { prisma } from '@/lib/db/prisma'

type TogglePinnedState = {
	success?: string
	error?: string | null
	successful?: boolean
	isPinned?: boolean
}

export async function togglePinnedAction(
	itemId: string,
	currentState: boolean,
	_prevState: TogglePinnedState
): Promise<TogglePinnedState> {
	void _prevState

	const session = await auth()

	if (!session?.user?.id) {
		return { error: 'Debes iniciar sesión para fijar items.' }
	}

	if (!itemId) {
		return { error: 'ID de item no válido.' }
	}

	const item = await prisma.item.findUnique({
		where: { id: itemId },
		select: { userId: true }
	})

	if (!item) {
		return { error: 'Item no encontrado.' }
	}

	if (item.userId !== session.user.id) {
		return { error: 'No tienes permiso para modificar este item.' }
	}

	const newState = !currentState

	await prisma.item.update({
		where: { id: itemId },
		data: { isPinned: newState }
	})

	revalidatePath('/dashboard')
	revalidatePath('/profile')
	revalidatePath('/items', 'layout')

	return {
		success: newState ? 'Item fijado correctamente.' : 'Item desfijado correctamente.',
		error: null,
		successful: true,
		isPinned: newState
	}
}
