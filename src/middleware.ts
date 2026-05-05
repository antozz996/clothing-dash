import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/request'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'horus-secret-key-2026')

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Escludi login, asset statici e API di auth
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    await jwtVerify(token, SECRET_KEY)
    return NextResponse.next()
  } catch (err) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
