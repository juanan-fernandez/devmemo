'use server'

import { revalidateItemPaths } from '@/lib/revalidation'

import { auth } from '@/auth/auth'
import { prisma } from '@/lib/db/prisma'
import { deleteUploadForItem } from '@/lib/storage/file-uploads'

export type DeleteItemState = {
	success?: string
	error?: string | null
	successful?: boolean
}

export async function deleteItemAction(
	itemId: string,
	_prevState: DeleteItemState
): Promise<DeleteItemState> {
	void _prevState

	const session = await auth()

	if (!session?.user?.id) {
		return { error: 'Debes iniciar sesión para eliminar items.' }
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
		return { error: 'No tienes permiso para eliminar este item.' }
	}

	await deleteUploadForItem({
		itemId,
		userId: session.user.id
	})

	await prisma.item.delete({
		where: { id: itemId }
	})

	revalidateItemPaths()

	return {
		success: 'Item eliminado correctamente.',
		error: null,
		successful: true
	}
}
