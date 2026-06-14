import { NextResponse } from 'next/server'

import { auth } from '@/auth/auth'
import { getItemDetailById } from '@/lib/db/items'

type RouteContext = {
	params: Promise<{
		id: string
	}>
}

export async function GET(_request: Request, context: RouteContext) {
	const session = await auth()
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Debes iniciar sesión.' }, { status: 401 })
	}

	const { id } = await context.params

	if (!id) {
		return NextResponse.json({ error: 'ID de item no válido.' }, { status: 400 })
	}

	const item = await getItemDetailById(userId, id)

	if (!item) {
		return NextResponse.json({ error: 'Item no encontrado.' }, { status: 404 })
	}

	return NextResponse.json(item)
}
