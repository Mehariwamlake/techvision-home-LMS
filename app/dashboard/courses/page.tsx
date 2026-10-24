'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, GraduationCap, RefreshCw } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

type Enrollment = { id: string; course: string; progress: number; status: string }

export default function Courses() {
  const [courses, setCourses] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/dashboard', { cache: 'no-store' })
      const data = await response.json()
      if (response.status === 401) { window.location.assign('/login'); return }
      if (!response.ok) throw new Error(data.error || 'Could not load your courses.')
      setCourses(data.enrollments || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your courses.')
    } finally { setLoading(false) }
  }

  useEffect(() => { void load() }, [])

  return <DashboardShell>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div><h1 className="text-3xl font-black">My Courses</h1><p className="mt-2 text-sm text-[#6b756f]">Your actual enrollments from TechVision LMS.</p></div>
      <button onClick={() => void load()} disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#dce5df] bg-white px-4 py-2.5 text-sm font-bold"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh</button>
    </div>
    {error && <div role="alert" className="mt-7 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    {loading ? <div className="mt-8 grid gap-4 sm:grid-cols-2">{[1, 2].map((n) => <div key={n} className="h-52 animate-pulse rounded-2xl border border-[#e3ebe6] bg-white" />)}</div>
      : courses.length ? <section className="mt-8 grid gap-5 sm:grid-cols-2">
        {courses.map((course) => <article key={course.id} className="rounded-2xl border border-[#dce5df] bg-white p-6 transition hover:border-[#a7dfbf] hover:shadow-[0_12px_35px_rgba(9,53,31,.06)]">
          <div className="flex items-start gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#eaf8ef] text-[#168452]"><GraduationCap size={23} /></div><div className="min-w-0"><h2 className="font-black leading-6">{course.course.replace(/[._-]+/g, ' ')}</h2><p className="mt-1 text-xs text-[#718077]">{course.status || 'Enrolled'}</p></div></div>
          <div className="mt-6 flex items-center justify-between text-xs"><span className="font-bold text-[#168452]">{course.progress}% complete</span><span className="text-[#718077]">Progress</span></div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e5ece8]"><div className="h-full rounded-full bg-[#00d38d]" style={{ width: course.progress + '%' }} /></div>
          <a href="https://learn.techvision.edu.et" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#10271b] px-4 py-3 text-sm font-bold text-white hover:bg-[#1b4930]">Open LMS course <ArrowRight size={15} /></a>
        </article>)}
      </section> : <section className="mt-8 rounded-2xl border border-dashed border-[#cfded4] bg-white px-6 py-12 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e8fbf1] text-[#168452]"><BookOpen size={25} /></div>
        <h2 className="mt-5 text-lg font-extrabold">No enrolled courses yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718077]">When you enroll in a course through TechVision LMS, it will appear here with the progress reported by the LMS.</p>
        <Link href="https://learn.techvision.edu.et" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#00d38d] px-5 py-3 text-sm font-extrabold text-[#062719]">Explore LMS courses <ArrowRight size={16} /></Link>
      </section>}
  </DashboardShell>
}
