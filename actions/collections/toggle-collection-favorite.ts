'use server'

import { revalidatePath } from 'next/cache'

import { auth } from '@/auth/auth'
import { prisma } from '@/lib/db/prisma'

export async function toggleCollectionFavoriteAction(collectionId: string) {
	const session = await auth()

	if (!session?.user?.id) {
		return { error: 'Debes iniciar sesión.' }
	}

	const collection = await prisma.collection.findFirst({
		where: { id: collectionId, userId: session.user.id },
		select: { isFavorite: true }
	})

	if (!collection) {
		return { error: 'Colección no encontrada.' }
	}

	try {
		await prisma.collection.update({
			where: { id: collectionId },
			data: { isFavorite: !collection.isFavorite }
		})
	} catch {
		return { error: 'No se ha podido actualizar la colección.' }
	}

	revalidatePath('/dashboard')
	revalidatePath('/collections')

	return { isFavorite: !collection.isFavorite }
}
