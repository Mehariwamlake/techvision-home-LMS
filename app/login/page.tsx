'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { BrandLogo } from '@/components/BrandLogo'

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Unable to sign in. Please check your details.')
        return
      }
      const next = searchParams.get('next')
      router.replace(next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard')
      router.refresh()
    } catch {
      setError('Could not connect to TechVision LMS. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-[#f7faf8] px-5 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <BrandLogo className="h-8" />
        <section className="mx-auto mt-10 max-w-xl rounded-xl border border-[#dce5df] bg-white p-8 shadow-[0_18px_50px_rgba(26,55,40,.08)] sm:mt-14 sm:p-12">
          <div className="text-center">
            <h1 className="text-4xl font-black">Welcome back</h1>
            <p className="mt-3 text-sm text-[#6a756e]">Sign in to continue to your TechVision account.</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <label className="block text-sm font-bold">Email
              <input autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-md border border-[#cfd9d3] bg-[#fbfcfb] px-4 py-3.5 font-normal outline-none focus:border-[#00d38d]" placeholder="Enter your email address" type="email" />
            </label>
            <label className="block text-sm font-bold">Password
              <input autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-md border border-[#cfd9d3] bg-[#fbfcfb] px-4 py-3.5 font-normal outline-none focus:border-[#00d38d]" placeholder="Enter your password" type="password" />
            </label>
            <div className="flex items-center justify-between text-xs text-[#68736d]">
              <label className="flex items-center gap-2"><input type="checkbox" /> Remember me</label>
              <a href="https://learn.techvision.edu.et/login#forgot-password" className="font-semibold text-[#168452]">Forgot password?</a>
            </div>
            {error && <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <button disabled={loading} type="submit" className="block w-full rounded-md bg-[#00d38d] py-3.5 text-center font-bold text-[#002333] transition hover:bg-[#00bf80] disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Signing in…' : 'Login →'}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-[#68736d]">Don&apos;t have an account? <Link href="/signup" className="font-bold text-[#168452]">Create one</Link></p>
        </section>
      </div>
    </main>
  )
}
