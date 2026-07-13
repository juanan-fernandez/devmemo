'use server'

import { revalidateCollectionPaths } from '@/lib/revalidation'

import { auth } from '@/auth/auth'
import { prisma } from '@/lib/db/prisma'
import { logServerError } from '@/lib/logger'

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
	} catch (error) {
		logServerError('toggleCollectionFavorite', error)
		return { error: 'No se ha podido actualizar la colección.' }
	}

	revalidateCollectionPaths()

	return { isFavorite: !collection.isFavorite }
}
