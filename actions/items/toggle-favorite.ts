'use server'

import { revalidatePath } from 'next/cache'

import { auth } from '@/auth/auth'
import { prisma } from '@/lib/db/prisma'

type ToggleFavoriteState = {
	success?: string
	error?: string | null
	successful?: boolean
	isFavorite?: boolean
}

export async function toggleFavoriteAction(
	itemId: string,
	currentState: boolean,
	_prevState: ToggleFavoriteState
): Promise<ToggleFavoriteState> {
	void _prevState

	const session = await auth()

	if (!session?.user?.id) {
		return { error: 'Debes iniciar sesión para marcar favoritos.' }
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
		data: { isFavorite: newState }
	})

	revalidatePath('/dashboard')
	revalidatePath('/profile')
	revalidatePath('/items', 'layout')

	return {
		success: newState ? 'Añadido a favoritos.' : 'Quitado de favoritos.',
		error: null,
		successful: true,
		isFavorite: newState
	}
}
