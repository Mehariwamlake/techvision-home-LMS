'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, BookOpen, CheckCircle2, Clock3, GraduationCap, RefreshCw } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

type Enrollment = {
  id: string
  course: string
  progress: number
  status: string
  createdAt: string
}

type DashboardData = {
  user: { id: string; email: string; name: string; image: string | null }
  enrollments: Enrollment[]
  stats: { enrolledCourses: number; completedCourses: number }
}

function titleCase(value: string) {
  return value.replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadDashboard() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/dashboard', { cache: 'no-store' })
      const payload = await response.json()
      if (!response.ok) {
        if (response.status === 401) {
          window.location.assign('/login')
          return
        }
        throw new Error(payload.error || 'Unable to load your dashboard.')
      }
      setData(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load your dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadDashboard() }, [])

  const firstName = data?.user.name.trim().split(/\s+/)[0] || 'there'

  return (
    <DashboardShell>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="tv-mono text-[10px] uppercase tracking-[.16em] text-[#168452]">Your learning space</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Welcome back, {firstName} <span aria-hidden="true">👋</span></h1>
          <p className="mt-2 text-sm text-[#6b756f]">Your courses and progress, all in one place.</p>
        </div>
        <button onClick={() => void loadDashboard()} disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#dce5df] bg-white px-4 py-2.5 text-sm font-bold text-[#294637] transition hover:bg-[#f0fbf5] disabled:opacity-60">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {data && (
        <div className="mt-7 flex flex-wrap items-center gap-3 rounded-2xl border border-[#dcebe1] bg-white px-4 py-3.5">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e8fbf1] text-sm font-black text-[#087b4c]">
            {data.user.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#183425]">{data.user.name}</p>
            <p className="truncate text-xs text-[#718077]">{data.user.email}</p>
          </div>
          <span className="ml-auto rounded-full bg-[#e8fbf1] px-3 py-1.5 text-[11px] font-bold text-[#087b4c]">LMS account connected</span>
        </div>
      )}

      {error && (
        <div role="alert" className="mt-7 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <p>{error}</p>
          <button onClick={() => void loadDashboard()} className="w-fit rounded-lg border border-red-200 px-4 py-2 font-bold hover:bg-red-100">Try again</button>
        </div>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          { label: 'ENROLLED COURSES', value: data?.stats.enrolledCourses, icon: BookOpen, note: 'Courses linked to your LMS account' },
          { label: 'COMPLETED COURSES', value: data?.stats.completedCourses, icon: CheckCircle2, note: 'Courses marked as complete' },
        ].map(({ label, value, icon: Icon, note }) => (
          <div key={label} className="rounded-2xl border border-[#dce5df] bg-white p-6 shadow-[0_8px_28px_rgba(20,55,35,.03)]">
            <div className="flex items-center justify-between">
              <span className="tv-mono text-[10px] text-[#7e8a83]">{label}</span>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e8fbf1] text-[#168452]"><Icon size={19} /></span>
            </div>
            <div className="mt-5 text-4xl font-black">{loading ? '—' : value ?? 0}</div>
            <p className="mt-2 text-xs text-[#7e8a83]">{note}</p>
          </div>
        ))}
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><h2 className="text-xl font-black">My courses</h2><p className="mt-1 text-sm text-[#718077]">Your current enrollments from TechVision LMS.</p></div>
        <Link href="/courses" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#168452] hover:underline">Explore courses <ArrowRight size={16} /></Link>
      </div>

      {loading ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[1, 2].map((item) => <div key={item} className="h-44 animate-pulse rounded-2xl border border-[#e3ebe6] bg-white" />)}
        </div>
      ) : data?.enrollments.length ? (
        <section className="mt-5 grid gap-4 sm:grid-cols-2">
          {data.enrollments.map((enrollment) => (
            <article key={enrollment.id} className="rounded-2xl border border-[#dce5df] bg-white p-6 transition hover:border-[#a7dfbf] hover:shadow-[0_12px_35px_rgba(9,53,31,.06)]">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#e8fbf1] text-[#168452]"><GraduationCap size={22} /></div>
                <div className="min-w-0 flex-1"><h3 className="font-extrabold leading-6">{titleCase(enrollment.course)}</h3><p className="mt-1 text-xs text-[#718077]">{enrollment.status ? titleCase(enrollment.status) : 'Enrolled course'}</p></div>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs"><span className="font-bold text-[#168452]">{enrollment.progress}% complete</span><span className="text-[#718077]">Your progress</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8efeb]"><div className="h-full rounded-full bg-[#00bd7d] transition-all" style={{ width: enrollment.progress + '%' }} /></div>
              <Link href={'https://learn.techvision.edu.et'} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#10271b] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1b4930]">Open course <ArrowRight size={15} /></Link>
            </article>
          ))}
        </section>
      ) : (
        <section className="mt-5 rounded-2xl border border-dashed border-[#cfded4] bg-white px-6 py-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e8fbf1] text-[#168452]"><BookOpen size={25} /></div>
          <h3 className="mt-5 text-lg font-extrabold">{loading ? 'Loading your courses…' : 'Your learning journey starts here'}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718077]">{loading ? 'We are syncing your enrollment details from the LMS.' : 'You don’t have any course enrollments showing yet. Explore the available courses and enroll to see your progress here.'}</p>
          {!loading && <Link href="/courses" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#00d38d] px-5 py-3 text-sm font-extrabold text-[#062719] transition hover:bg-[#00bd7d]">Browse courses <ArrowRight size={16} /></Link>}
        </section>
      )}

      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#dcebe1] bg-[#edf9f1] p-5">
        <Clock3 size={18} className="mt-0.5 shrink-0 text-[#168452]" />
        <div><p className="text-sm font-bold text-[#16452c]">Your dashboard updates from your LMS account</p><p className="mt-1 text-xs leading-5 text-[#587564]">Course totals and progress are loaded when you open or refresh this page. If a course is missing, check that you are enrolled in it on the TechVision LMS.</p></div>
      </div>
    </DashboardShell>
  )
}
