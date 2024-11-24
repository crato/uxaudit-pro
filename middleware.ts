import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge'

export async function middleware(req: NextRequest) {
  // Skip middleware for auth-related and static paths
  const publicPaths = [
    '/login',
    '/api/auth',
    '/_next',
    '/favicon.ico',
  ]

  if (publicPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check for dashboard access
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    try {
      const session = await getSession(req)
      if (!session?.user) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}