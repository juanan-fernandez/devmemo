'use server'

import { revalidateCollectionPaths } from '@/lib/revalidation'

import { auth } from '@/auth/auth'
import { prisma } from '@/lib/db/prisma'
import { logServerError } from '@/lib/logger'

export async function deleteCollectionAction(collectionId: string) {
	const session = await auth()

	if (!session?.user?.id) {
		return { error: 'Debes iniciar sesión.' }
	}

	const collection = await prisma.collection.findFirst({
		where: { id: collectionId, userId: session.user.id },
		select: { id: true }
	})

	if (!collection) {
		return { error: 'Colección no encontrada.' }
	}

	try {
		await prisma.$transaction(async tx => {
			await tx.item.updateMany({
				where: { collectionId },
				data: { collectionId: null }
			})

			await tx.collection.delete({
				where: { id: collectionId }
			})
		})
	} catch (error) {
		logServerError('deleteCollection', error)
		return { error: 'No se ha podido eliminar la colección.' }
	}

	revalidateCollectionPaths()

	return { success: true }
}
