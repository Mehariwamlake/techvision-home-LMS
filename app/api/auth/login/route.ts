import { NextResponse } from 'next/server'
import { frappeUrl, sealSession, SESSION_COOKIE, sessionCookieOptions, sessionTtlSeconds } from '@/lib/frappe-auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let email = ''
  let password = ''
  try {
    const body = await request.json()
    email = String(body.email || '').trim()
    password = String(body.password || '')
  } catch { return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 }) }
  if (!email || !password) return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 })
  try {
    const login = await fetch(`${frappeUrl()}/api/method/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: new URLSearchParams({ usr: email, pwd: password }), cache: 'no-store',
    })
    const payload = await login.json().catch(() => ({}))
    const cookies = login.headers.get('set-cookie') || ''
    const sidMatch = cookies.match(/sid=([^;]+)/)
    const sid = sidMatch?.[1]
    if (!login.ok || !sid || payload?.message !== 'Logged In') return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    const verify = await fetch(`${frappeUrl()}/api/method/frappe.auth.get_logged_user`, { headers: { Cookie: `sid=${sid}` }, cache: 'no-store' })
    const userPayload = await verify.json().catch(() => ({}))
    const user = userPayload?.message
    if (!verify.ok || !user || user === 'Guest') return NextResponse.json({ error: 'Unable to verify your LMS account.' }, { status: 401 })
    const response = NextResponse.json({ ok: true, user })
    response.cookies.set(SESSION_COOKIE, sealSession({ sid, user, expiresAt: Date.now() + sessionTtlSeconds * 1000 }), sessionCookieOptions())
    return response
  } catch { return NextResponse.json({ error: 'The LMS is unavailable. Please try again.' }, { status: 502 }) }
}
