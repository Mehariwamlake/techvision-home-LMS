import { NextResponse } from 'next/server'
import { frappeUrl, sealSession, SESSION_COOKIE, sessionCookieOptions, sessionTtlSeconds } from '@/lib/frappe-auth'

export const runtime = 'nodejs'

function getSessionId(headers: Headers) {
  const setCookies = typeof headers.getSetCookie === 'function'
    ? headers.getSetCookie()
    : [headers.get('set-cookie') || '']

  for (const cookie of setCookies) {
    const match = cookie.match(/(?:^|[,;\s])sid=([^;,\s]+)/)
    if (match?.[1]) return match[1]
  }
  return undefined
}

export async function POST(request: Request) {
  let username = ''
  let password = ''

  try {
    const body = await request.json()
    username = String(body.email || body.username || '').trim()
    password = String(body.password || '')
  } catch {
    return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 })
  }

  if (!username || !password) {
    return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 })
  }

  try {
    const login = await fetch(frappeUrl() + '/api/method/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({ usr: username, pwd: password }),
      cache: 'no-store',
      redirect: 'manual',
    })

    const payload = await login.json().catch(() => ({}))
    const sid = getSessionId(login.headers)
    const loginMessage = String(payload?.message || '').trim().toLowerCase()

    // Some Frappe accounts have no Desk home app. Verify the session instead
    // of treating every response other than "Logged In" as bad credentials.
    if (!login.ok) {
      console.warn('[auth] Frappe login HTTP failure', { status: login.status, message: loginMessage || 'no message' })
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    if (!sid) {
      console.warn('[auth] Frappe login returned no session cookie', { status: login.status, message: loginMessage || 'no message' })
      return NextResponse.json({
        error: loginMessage === 'no app'
          ? 'Frappe did not create a login session for this account. Please use your TechVision LMS account and try again.'
          : 'Unable to establish an LMS session. Please check your login details and try again.',
      }, { status: 401 })
    }

    const verify = await fetch(frappeUrl() + '/api/method/frappe.auth.get_logged_user', {
      headers: { Cookie: 'sid=' + sid, Accept: 'application/json' },
      cache: 'no-store',
    })
    const userPayload = await verify.json().catch(() => ({}))
    const user = userPayload?.message

    if (!verify.ok || !user || user === 'Guest') {
      console.warn('[auth] Frappe session verification failed', { status: verify.status })
      return NextResponse.json({ error: 'Unable to verify your LMS session. Please try again.' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true, user })
    response.cookies.set(
      SESSION_COOKIE,
      sealSession({ sid, user, expiresAt: Date.now() + sessionTtlSeconds * 1000 }),
      sessionCookieOptions(),
    )
    return response
  } catch {
    return NextResponse.json({ error: 'The LMS is unavailable. Please try again.' }, { status: 502 })
  }
}
