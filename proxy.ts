import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'

import authConfig from '@/auth/auth.config'

const { auth } = NextAuth(authConfig)

export const proxy = auth(request => {
	const isDashboardRoute =
		request.nextUrl.pathname === '/dashboard' ||
		request.nextUrl.pathname.startsWith('/dashboard/')
	const isProfileRoute = request.nextUrl.pathname === '/profile'

	if (!request.auth && (isDashboardRoute || isProfileRoute)) {
		const signInUrl = new URL('/login', request.nextUrl)

		return NextResponse.redirect(signInUrl)
	}

	return NextResponse.next()
})

export const config = {
	matcher: ['/dashboard', '/dashboard/:path*', '/profile']
}
