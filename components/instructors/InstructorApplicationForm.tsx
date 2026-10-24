'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, CheckCircle2, LoaderCircle, ShieldCheck } from 'lucide-react'

const inputClass = 'mt-2 w-full rounded-xl border border-[#dbe5df] bg-white px-4 py-3.5 text-sm text-[#12251b] outline-none transition placeholder:text-[#9aa79f] focus:border-[#00b982] focus:ring-4 focus:ring-[#00d38d]/10'
const labelClass = 'block text-sm font-semibold text-[#20372a]'

export function InstructorApplicationForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [applicationId, setApplicationId] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(formData.entries())

    try {
      const response = await fetch('/api/instructor-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'We could not send your application. Please try again.')
        setStatus('error')
        return
      }

      setApplicationId(result.name || '')
      setStatus('success')
      form.reset()
    } catch {
      setError('Connection issue. Please check your internet and try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-[#ccebd9] bg-white p-8 text-center shadow-[0_24px_70px_rgba(9,53,31,.08)] sm:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#e8fbf1] text-[#087b4c]">
          <CheckCircle2 size={32} />
        </div>
        <p className="tv-mono mt-6 text-xs uppercase text-[#087b4c]">Application submitted</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#10271b]">Thanks for stepping up.</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#65766b]">
          Your instructor application has been sent to the TechVision team. We’ll review your details and contact you about possible next steps.
        </p>
        {applicationId && <p className="mt-4 text-xs text-[#7b8b81]">Reference: {applicationId}</p>}
        <button onClick={() => setStatus('idle')} className="mt-8 rounded-xl bg-[#00d38d] px-6 py-3 text-sm font-bold text-[#062719] transition hover:bg-[#00bd7d]">
          Submit another application
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-[#e0e9e3] bg-white p-5 shadow-[0_24px_70px_rgba(9,53,31,.08)] sm:p-8">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <p className="tv-mono text-[10px] uppercase text-[#078653]">Instructor application</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#10271b] sm:text-3xl">Tell us about yourself</h2>
          <p className="mt-2 text-sm leading-6 text-[#718077]">It takes about 3 minutes. Fields marked * are required.</p>
        </div>
        <div className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e8fbf1] text-[#087b4c] sm:grid">
          <ShieldCheck size={22} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelClass}>
          Full name *
          <input className={inputClass} name="fullName" autoComplete="name" placeholder="Your full name" required minLength={2} maxLength={120} />
        </label>
        <label className={labelClass}>
          Email address *
          <input className={inputClass} name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={180} />
        </label>
        <label className={labelClass}>
          Phone number *
          <input className={inputClass} name="phone" type="tel" autoComplete="tel" placeholder="+251 9..." required minLength={7} maxLength={40} />
        </label>
        <label className={labelClass}>
          Main teaching area *
          <select className={inputClass} name="expertise" required defaultValue="">
            <option value="" disabled>Select your subject</option>
            <option>Frontend development</option>
            <option>Backend development</option>
            <option>Full-stack development</option>
            <option>Data structures & algorithms</option>
            <option>Python / Data science</option>
            <option>AI & machine learning</option>
            <option>UI/UX design</option>
            <option>ICT / Digital skills</option>
            <option>Other</option>
          </select>
        </label>
        <label className={labelClass}>
          Teaching experience *
          <select className={inputClass} name="experience" required defaultValue="">
            <option value="" disabled>Select experience</option>
            <option>Just getting started</option>
            <option>Less than 1 year</option>
            <option>1–3 years</option>
            <option>3–5 years</option>
            <option>5+ years</option>
          </select>
        </label>
        <label className={labelClass}>
          Preferred teaching format *
          <select className={inputClass} name="format" required defaultValue="">
            <option value="" disabled>Choose a format</option>
            <option>Live online classes</option>
            <option>Recorded courses</option>
            <option>Both live and recorded</option>
            <option>Flexible / open to discuss</option>
          </select>
        </label>
        <label className={labelClass + ' sm:col-span-2'}>
          Portfolio, LinkedIn or GitHub <span className="font-normal text-[#829087]">(optional)</span>
          <input className={inputClass} name="portfolio" type="url" placeholder="https://..." maxLength={300} />
        </label>
        <label className={labelClass + ' sm:col-span-2'}>
          What would you like to teach? *
          <textarea className={inputClass + ' min-h-32 resize-y'} name="message" placeholder="Share your course idea, the learners you want to help, and what makes your teaching approach useful." required minLength={20} maxLength={3000} />
          <span className="mt-2 block text-xs font-normal text-[#829087]">A few sentences is enough to get started.</span>
        </label>
        <div className="hidden" aria-hidden="true">
          <label>Leave this field empty<input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label>
        </div>
      </div>

      {status === 'error' && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <button type="submit" disabled={status === 'sending'} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00d38d] px-6 py-4 text-sm font-extrabold text-[#062719] transition hover:-translate-y-0.5 hover:bg-[#00bd7d] disabled:cursor-not-allowed disabled:opacity-60">
        {status === 'sending' ? <><LoaderCircle size={18} className="animate-spin" /> Sending application…</> : <>Send my application <ArrowRight size={18} /> </>}
      </button>
      <p className="mt-4 text-center text-xs leading-5 text-[#8a968e]">Your information is used to review your instructor application and contact you about it.</p>
    </form>
  )
}
