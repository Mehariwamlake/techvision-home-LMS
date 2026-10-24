import { NextResponse } from 'next/server'
import { getSession, frappeUrl, SESSION_COOKIE } from '@/lib/frappe-auth'

export const runtime = 'nodejs'

export async function POST() {
  const session = await getSession()
  if (session) {
    try {
      await fetch(`${frappeUrl()}/api/method/logout`, {
        method: 'POST', headers: { Cookie: `sid=${session.sid}`, Accept: 'application/json' }, cache: 'no-store',
      })
    } catch { /* Clear the local cookie even if the LMS is unreachable. */ }
  }
  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 })
  return response
}
