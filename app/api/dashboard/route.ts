import { NextResponse } from 'next/server'
import { getSession, frappeUrl } from '@/lib/frappe-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function frappeGet(url: string, sid: string) {
  const response = await fetch(url, {
    headers: { Cookie: 'sid=' + sid, Accept: 'application/json' },
    cache: 'no-store',
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok || payload?.exc) return null
  return payload
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 })

  try {
    const base = frappeUrl()
    const user = encodeURIComponent(session.user)
    const profileUrl = base + '/api/method/frappe.client.get_value?doctype=User&filters=' +
      encodeURIComponent(JSON.stringify({ name: session.user })) +
      '&fieldname=' + encodeURIComponent(JSON.stringify(['full_name', 'user_image']))

    const profilePayload = await frappeGet(profileUrl, session.sid)
    const profile = profilePayload?.message || {}

    const enrollmentUrl = base + '/api/method/frappe.client.get_list?doctype=LMS%20Enrollment&fields=' +
      encodeURIComponent(JSON.stringify(['name', 'course', 'progress', 'status', 'creation'])) +
      '&filters=' + encodeURIComponent(JSON.stringify([['member', '=', session.user]])) +
      '&order_by=creation%20desc&limit_page_length=50'
    const enrollmentPayload = await frappeGet(enrollmentUrl, session.sid)
    const enrollments = Array.isArray(enrollmentPayload?.message) ? enrollmentPayload.message : []

    return NextResponse.json({
      user: {
        id: session.user,
        email: session.user,
        name: profile.full_name || session.user.split('@')[0] || 'Learner',
        image: profile.user_image || null,
      },
      enrollments: enrollments.map((item: Record<string, unknown>) => ({
        id: String(item.name || ''),
        course: String(item.course || 'Course'),
        progress: Math.max(0, Math.min(100, Number(item.progress || 0))),
        status: String(item.status || ''),
        createdAt: String(item.creation || ''),
      })),
      stats: {
        enrolledCourses: enrollments.length,
        completedCourses: enrollments.filter((item: Record<string, unknown>) => Number(item.progress || 0) >= 100 || String(item.status || '').toLowerCase() === 'completed').length,
      },
    }, { headers: { 'Cache-Control': 'private, no-store, max-age=0' } })
  } catch {
    return NextResponse.json({ error: 'We could not load your LMS dashboard. Please refresh and try again.' }, { status: 502 })
  }
}
