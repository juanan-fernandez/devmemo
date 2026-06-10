import { prisma } from '@/lib/db/prisma'

export type SidebarUser = {
	email: string
	name: string | null
	image: string | null
}

export async function getSidebarUser(): Promise<SidebarUser | null> {
	const user = await prisma.user.findFirst({
		where: { email: 'demo@devmemo.com' },
		select: { email: true, name: true, image: true }
	})

	return user
}
