import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'

import authConfig from '@/auth/auth.config'

const { auth } = NextAuth(authConfig)

export const proxy = auth(request => {
	const pathname = request.nextUrl.pathname
	const isDashboardRoute = pathname === '/dashboard' || pathname.startsWith('/dashboard/')
	const isProfileRoute = pathname === '/profile'
	const isItemsRoute = pathname.startsWith('/items/')

	if (!request.auth && (isDashboardRoute || isProfileRoute || isItemsRoute)) {
		const signInUrl = new URL('/login', request.nextUrl)

		return NextResponse.redirect(signInUrl)
	}

	return NextResponse.next()
})

export const config = {
	matcher: ['/dashboard', '/dashboard/:path*', '/profile', '/items/:path*', '/collections', '/collections/:path*']
}
