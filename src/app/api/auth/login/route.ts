import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'horus-secret-key-2026')
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'horus2026'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (password === ADMIN_PASSWORD) {
      const token = await new SignJWT({ role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(SECRET_KEY)

      const response = NextResponse.json({ success: true })
      
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 giorni
        path: '/',
      })

      return response
    }

    return NextResponse.json({ error: 'Password errata' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: 'Errore durante il login' }, { status: 500 })
  }
}
