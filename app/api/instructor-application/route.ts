import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function clean(value: unknown, max = 3000) {
  return String(value ?? '').trim().slice(0, max)
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char] || char)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Honeypot: quietly accept bot submissions without storing them.
    if (clean(body.companyWebsite, 200)) {
      return NextResponse.json({ ok: true })
    }

    const fullName = clean(body.fullName, 120)
    const email = clean(body.email, 180).toLowerCase()
    const phone = clean(body.phone, 40)
    const expertise = clean(body.expertise, 120)
    const experience = clean(body.experience, 80)
    const format = clean(body.format, 100)
    const portfolio = clean(body.portfolio, 300)
    const message = clean(body.message, 3000)

    if (fullName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 7 || !expertise || !experience || !format || message.length < 20) {
      return NextResponse.json({ error: 'Please complete all required fields with valid details.' }, { status: 400 })
    }

    const baseUrl = process.env.ERPNEXT_URL?.replace(/\/+$/, '')
    const apiKey = process.env.ERPNEXT_API_KEY
    const apiSecret = process.env.ERPNEXT_API_SECRET

    if (!baseUrl || !apiKey || !apiSecret) {
      console.error('[instructor-application] ERPNext integration is not configured')
      return NextResponse.json({ error: 'The application form is not connected yet. Please try again later or email info@techvision.edu.et.' }, { status: 503 })
    }

    const headers = {
      Authorization: 'token ' + apiKey + ':' + apiSecret,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    const leadResponse = await fetch(baseUrl + '/api/resource/Lead', {
      method: 'POST',
      headers,
      cache: 'no-store',
      body: JSON.stringify({
        doctype: 'Lead',
        lead_name: fullName,
        email_id: email,
        mobile_no: phone,
        source: 'Website',
        job_title: 'Instructor Application — ' + expertise,
        website: portfolio || undefined,
      }),
    })
    const leadPayload = await leadResponse.json().catch(() => ({}))

    if (!leadResponse.ok || !leadPayload?.data?.name) {
      console.error('[instructor-application] ERPNext rejected Lead creation', { status: leadResponse.status })
      return NextResponse.json({ error: 'We could not save your application right now. Please try again shortly.' }, { status: 502 })
    }

    const leadName = String(leadPayload.data.name)
    const details = [
      'Instructor application received from the TechVision website.',
      '',
      'Teaching area: ' + expertise,
      'Experience: ' + experience,
      'Preferred format: ' + format,
      'Portfolio: ' + (portfolio || 'Not provided'),
      '',
      'Course idea / teaching approach:',
      message,
    ].join('\n')

    const commentResponse = await fetch(baseUrl + '/api/resource/Comment', {
      method: 'POST',
      headers,
      cache: 'no-store',
      body: JSON.stringify({
        doctype: 'Comment',
        comment_type: 'Comment',
        reference_doctype: 'Lead',
        reference_name: leadName,
        content: '<pre style="white-space:pre-wrap;font-family:inherit">' + escapeHtml(details) + '</pre>',
      }),
    })

    if (!commentResponse.ok) {
      console.error('[instructor-application] ERPNext could not attach application details', { lead: leadName, status: commentResponse.status })
      return NextResponse.json({ error: 'Your contact was saved, but some application details could not be attached. Please email info@techvision.edu.et and mention reference ' + leadName + '.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true, name: leadName })
  } catch {
    return NextResponse.json({ error: 'Something went wrong while sending your application. Please try again.' }, { status: 500 })
  }
}
