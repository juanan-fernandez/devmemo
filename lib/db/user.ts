import { prisma } from '@/lib/db/prisma'

export type SidebarUser = {
	email: string
	name: string | null
	image: string | null
}

export async function getSidebarUser(userId: string): Promise<SidebarUser | null> {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { email: true, name: true, image: true }
	})

	return user
}
