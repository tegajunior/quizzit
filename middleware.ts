import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname
  const { pathname } = request.nextUrl

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/quiz', '/results', '/profile']
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // If it's a protected route, check for token
  if (isProtectedRoute) {
    const token = request.cookies.get('authToken')?.value

    if (!token) {
      // Redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Note: Token verification is handled by API routes
    // Middleware only checks for token presence due to Edge Runtime limitations
  }

  // If accessing auth pages while logged in, redirect to dashboard
  const authRoutes = ['/login', '/register', '/verify-email']
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  if (isAuthRoute) {
    const token = request.cookies.get('authToken')?.value
    if (token) {
      // Basic check - detailed verification happens in the dashboard page
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
