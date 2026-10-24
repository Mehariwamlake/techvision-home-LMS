'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { CountUpStats } from '@/components/home/CountUpStats'

export function LandingHero() {
  return (
    <section className="mx-auto max-w-7xl overflow-hidden px-6 pb-12 pt-28 text-center sm:pt-36">
      <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } }}>
        <motion.h1 variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }} className="text-5xl font-black tracking-[-.045em] sm:text-6xl lg:text-7xl">
          Launch Your <span className="text-[#00d38d]">Tech Career</span>
        </motion.h1>
        <motion.p variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } }} className="tv-mono mx-auto mt-12 max-w-2xl text-xs uppercase text-[#68736d] sm:text-sm">
          Build real projects and learn from mentors
        </motion.p>
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } }} className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/login" className="flex min-w-48 items-center justify-center gap-2 bg-[#00d38d] px-7 py-4 text-sm font-semibold text-[#0b1510] transition-transform duration-200 hover:-translate-y-0.5">
            Start Learning <ArrowRight size={16} />
          </Link>
          <Link href="https://learn.techvision.edu.et/batch-application/new" className="flex min-w-48 items-center justify-center gap-2 border border-[#69736d] px-7 py-4 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5">
            <Play size={15} className="text-[#00d38d]" /> Apply For Next Batch
          </Link>
        </motion.div>
      </motion.div>
      <CountUpStats />
    </section>
  )
}
