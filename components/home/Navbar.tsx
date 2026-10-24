'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { ThemeMenu } from '@/components/ThemeMenu'
import { BrandLogo } from '@/components/BrandLogo'

export function Navbar({ hideCourses = false }: { hideCourses?: boolean }) {
  const [mobile, setMobile] = useState(false)

  const navLink = 'tv-nav-link text-[15px] font-medium transition-colors duration-200'

  return (
    <header className="tv-navbar sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-7">
        <BrandLogo className="h-7 w-auto" />

        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/" className={navLink}>Home</Link>
          {!hideCourses && <Link href="/courses" className={navLink}>Courses</Link>}
          <Link href="/stories" className={navLink}>Stories</Link>
          <Link href="/pricing" className={navLink}>Pricing</Link>
          <Link href="/contest" className={navLink}>Contest</Link>
          <Link href="/instructors/apply" className={navLink}>Teach with us</Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeMenu compact />
          <Link href="https://learn.techvision.edu.et/login" className={navLink}>Login</Link>
          <Link href="/instructors/apply" className="rounded-xl bg-[#00d38d] px-5 py-2.5 text-sm font-extrabold text-[#062719] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#00bd7d]">
            Become an Instructor
          </Link>
        </div>

        <button type="button" onClick={() => setMobile((value) => !value)} className="tv-mobile-menu-button lg:hidden" aria-label={mobile ? 'Close menu' : 'Open menu'} aria-expanded={mobile}>
          {mobile ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {mobile && (
        <div className="tv-mobile-nav border-t px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-4 text-sm">
            <Link href="/" className={navLink} onClick={() => setMobile(false)}>Home</Link>
            {!hideCourses && <Link href="/courses" className={navLink} onClick={() => setMobile(false)}>Courses</Link>}
            <Link href="/stories" className={navLink} onClick={() => setMobile(false)}>Student Stories</Link>
            <Link href="/pricing" className={navLink} onClick={() => setMobile(false)}>Pricing</Link>
            <Link href="/contest" className={navLink} onClick={() => setMobile(false)}>Contest</Link>
            <Link href="/instructors/apply" className={navLink} onClick={() => setMobile(false)}>Teach with us</Link>
            <div className="tv-mobile-theme-row flex items-center justify-between border-y py-3">
              <span>Theme</span>
              <ThemeMenu />
            </div>
            <Link href="https://learn.techvision.edu.et/login" className={navLink} onClick={() => setMobile(false)}>Login</Link>
            <Link href="/instructors/apply" onClick={() => setMobile(false)} className="w-fit rounded-xl bg-[#00d38d] px-5 py-3 font-extrabold text-[#062719]">Become an Instructor →</Link>
          </div>
        </div>
      )}
    </header>
  )
}
