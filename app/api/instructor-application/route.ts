import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function clean(value: unknown, max = 3000) {
  return String(value ?? '').trim().slice(0, max)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Honeypot: accept bot submissions without forwarding them.
    if (clean(body.companyWebsite, 200)) return NextResponse.json({ ok: true })

    const application = {
      type: 'instructor_application',
      fullName: clean(body.fullName, 120),
      email: clean(body.email, 180).toLowerCase(),
      phone: clean(body.phone, 40),
      expertise: clean(body.expertise, 120),
      experience: clean(body.experience, 80),
      format: clean(body.format, 100),
      portfolio: clean(body.portfolio, 300),
      message: clean(body.message, 3000),
      submittedAt: new Date().toISOString(),
    }

    if (
      application.fullName.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email) ||
      application.phone.length < 7 ||
      !application.expertise ||
      !application.experience ||
      !application.format ||
      application.message.length < 20
    ) {
      return NextResponse.json({ error: 'Please complete all required fields with valid details.' }, { status: 400 })
    }

    // Forward only to an explicitly configured instructor-application destination.
    // No ERP/CRM is assumed or contacted by this route.
    const destination = process.env.INSTRUCTOR_APPLICATION_WEBHOOK_URL
    if (!destination) {
      console.error('[instructor-application] INSTRUCTOR_APPLICATION_WEBHOOK_URL is not configured')
      return NextResponse.json({
        error: 'The application form is not connected to the instructor application inbox yet. Please email info@techvision.edu.et while we finish setup.',
      }, { status: 503 })
    }

    let endpoint: URL
    try {
      endpoint = new URL(destination)
      if (endpoint.protocol !== 'https:' && process.env.NODE_ENV === 'production') throw new Error('HTTPS is required')
    } catch {
      return NextResponse.json({ error: 'The instructor application service is configured incorrectly. Please try again later.' }, { status: 503 })
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(application),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      console.error('[instructor-application] Destination rejected submission', { status: response.status })
      return NextResponse.json({ error: 'We could not submit your application right now. Please try again shortly.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true, submittedAt: application.submittedAt })
  } catch {
    return NextResponse.json({ error: 'Something went wrong while sending your application. Please try again.' }, { status: 500 })
  }
}
