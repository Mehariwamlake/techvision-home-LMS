import { NextResponse } from 'next/server'
import { getSession, frappeUrl } from '@/lib/frappe-auth'

export const runtime = 'nodejs'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 })
  try {
    const response = await fetch(`${frappeUrl()}/api/method/frappe.auth.get_logged_user`, {
      headers: { Cookie: `sid=${session.sid}`, Accept: 'application/json' }, cache: 'no-store',
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok || data?.message !== session.user) return NextResponse.json({ authenticated: false }, { status: 401 })
    return NextResponse.json({ authenticated: true, user: session.user })
  } catch { return NextResponse.json({ authenticated: false }, { status: 502 }) }
}
