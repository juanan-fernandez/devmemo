type TagTx = {
	tag: {
		upsert: (args: {
			where: { name_userId: { name: string; userId: string } }
			update: Record<string, never>
			create: { name: string; userId: string }
			select: { id: true }
		}) => Promise<{ id: string }>
	}
	itemTag: {
		createMany: (args: {
			data: Array<{ itemId: string; tagId: string }>
			skipDuplicates: true
		}) => Promise<{ count: number }>
		deleteMany: (args: { where: { itemId: string } }) => Promise<{ count: number }>
	}
}

async function upsertTags(
	tx: TagTx,
	tags: string[],
	userId: string
) {
	return Promise.all(
		tags.map(tagName =>
			tx.tag.upsert({
				where: {
					name_userId: {
						name: tagName,
						userId
					}
				},
				update: {},
				create: {
					name: tagName,
					userId
				},
				select: {
					id: true
				}
			})
		)
	)
}

export async function linkTagsToItem(
	tx: TagTx,
	tags: string[],
	itemId: string,
	userId: string
) {
	if (tags.length === 0) return

	const persistedTags = await upsertTags(tx, tags, userId)

	await tx.itemTag.createMany({
		data: persistedTags.map(tag => ({ itemId, tagId: tag.id })),
		skipDuplicates: true
	})
}

export async function relinkTagsToItem(
	tx: TagTx,
	tags: string[],
	itemId: string,
	userId: string
) {
	await tx.itemTag.deleteMany({ where: { itemId } })
	await linkTagsToItem(tx, tags, itemId, userId)
}
