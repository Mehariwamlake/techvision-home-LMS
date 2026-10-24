'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, RefreshCw, ArrowRight } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

export default function Applications() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/me', { cache: 'no-store' })
      const data = await response.json()
      if (response.status === 401) { window.location.assign('/login'); return }
      if (!response.ok || !data.authenticated) throw new Error('Could not verify your LMS account.')
      setAuthenticated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your applications.')
    } finally { setLoading(false) }
  }

  useEffect(() => { void load() }, [])

  return <DashboardShell>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div><h1 className="text-3xl font-black">My Applications</h1><p className="mt-2 text-sm text-[#6b756f]">Check your training application information.</p></div>
      <button onClick={() => void load()} disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#dce5df] bg-white px-4 py-2.5 text-sm font-bold"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh</button>
    </div>
    {error && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    <section className="mt-8 rounded-2xl border border-dashed border-[#cfded4] bg-white px-6 py-12 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e8fbf1] text-[#168452]"><FileText size={25} /></div>
      <h2 className="mt-5 text-lg font-extrabold">{loading ? 'Checking your account…' : authenticated ? 'Application tracking is not connected yet' : 'Sign in to view applications'}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#718077]">{loading ? 'We are checking your TechVision LMS session.' : 'This dashboard does not yet have access to training-application records, so it will not show invented application statuses. You can continue to TechVision LMS to view available learning and application options.'}</p>
      {!loading && authenticated && <a href="https://learn.techvision.edu.et" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#00d38d] px-5 py-3 text-sm font-extrabold text-[#062719]">Open TechVision LMS <ArrowRight size={16} /></a>}
      {!loading && !authenticated && <Link href="/login" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#00d38d] px-5 py-3 text-sm font-extrabold text-[#062719]">Sign in <ArrowRight size={16} /></Link>}
    </section>
  </DashboardShell>
}
