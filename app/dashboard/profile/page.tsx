'use client'

import { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { RefreshCw, UserRound } from 'lucide-react'

export default function Profile() {
  const [user, setUser] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/me', { cache: 'no-store' })
      const data = await response.json()
      if (response.status === 401) { window.location.assign('/login'); return }
      if (!response.ok || !data.authenticated || !data.user) throw new Error('Could not load your account details.')
      setUser(String(data.user))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your account details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])
  const displayName = user ? (user.includes('@') ? user.split('@')[0] : user).replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : ''
  const initials = displayName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()

  return <DashboardShell>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div><h1 className="text-3xl font-black">Profile & account</h1><p className="mt-2 text-sm text-[#6b756f]">Your account information from TechVision LMS.</p></div>
      <button onClick={() => void load()} disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#dce5df] bg-white px-4 py-2.5 text-sm font-bold"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh</button>
    </div>
    {error && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    <section className="mt-8 rounded-2xl border border-[#dce5df] bg-white p-6 sm:p-8">
      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf8ef] text-xl font-black text-[#168452]">{loading ? <UserRound /> : initials || <UserRound />}</div>
        <div><h2 className="text-xl font-black">{loading ? 'Loading your profile…' : displayName || 'LMS user'}</h2><p className="mt-1 text-sm text-[#6b756f]">TechVision LMS account</p></div>
      </div>
      <hr className="my-7 border-[#e0e7e2]" />
      <div className="grid gap-5 sm:grid-cols-2">
        <div><p className="text-xs font-bold uppercase tracking-wide text-[#829087]">Email / username</p><p className="mt-2 break-all text-sm font-semibold">{loading ? 'Loading…' : user || 'Not available'}</p></div>
        <div><p className="text-xs font-bold uppercase tracking-wide text-[#829087]">Account source</p><p className="mt-2 text-sm font-semibold">TechVision LMS</p></div>
      </div>
      <p className="mt-7 rounded-xl bg-[#f2faf5] p-4 text-xs leading-5 text-[#587564]">Your login details are managed by TechVision LMS. To change your password or other account information, use the LMS account settings.</p>
      <a href="https://learn.techvision.edu.et/me" className="mt-5 inline-flex rounded-xl bg-[#00d38d] px-5 py-3 text-sm font-extrabold text-[#062719] transition hover:bg-[#00bd7d]">Manage account in LMS ↗</a>
    </section>
  </DashboardShell>
}
