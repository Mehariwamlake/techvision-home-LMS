import Link from 'next/link'
import { ArrowDown, ArrowRight, BookOpenCheck, BriefcaseBusiness, CircleDollarSign, GraduationCap, Sparkles, Users } from 'lucide-react'
import { Navbar } from '@/components/home/Navbar'
import { Footer } from '@/components/home/Footer'
import { InstructorApplicationForm } from '@/components/instructors/InstructorApplicationForm'

const benefits = [
  { icon: GraduationCap, title: 'Teach what you know', text: 'Build practical lessons around the skills and experience you already have.' },
  { icon: Users, title: 'Reach more learners', text: 'Help students across Ethiopia learn through projects, feedback and mentorship.' },
  { icon: CircleDollarSign, title: 'Earn from your expertise', text: 'Explore paid teaching opportunities and course revenue-sharing arrangements with our team.' },
  { icon: BriefcaseBusiness, title: 'Grow your reputation', text: 'Build your teaching portfolio and become part of a practical learning community.' },
]

export default function InstructorApplicationPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-[#f7fbf8] text-[#10271b]">
        <section className="relative isolate border-b border-[#e1ece5]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -right-24 -top-28 h-96 w-96 rounded-full bg-[#00d38d]/10 blur-3xl" />
            <div className="absolute -left-24 top-40 h-80 w-80 rounded-full bg-[#b6f4d4]/30 blur-3xl" />
            <div className="absolute inset-0 opacity-[.22]" style={{ backgroundImage: 'radial-gradient(#91b6a0 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          </div>
          <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16 lg:py-24">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#cbe8d7] bg-white/80 px-3.5 py-2 text-xs font-bold text-[#087b4c] shadow-sm">
                <Sparkles size={14} /> FOR EDUCATORS, BUILDERS & MENTORS
              </div>
              <h1 className="mt-7 text-5xl font-black leading-[1.02] tracking-[-.055em] sm:text-6xl lg:text-7xl">
                Your skills can <span className="text-[#00a96f]">change</span> someone’s future.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#62746a] sm:text-lg sm:leading-8">
                Teach with TechVision. Share what you know, create practical learning experiences, and help the next generation of Ethiopian talent build real skills.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#apply" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00d38d] px-6 py-4 text-sm font-extrabold text-[#062719] shadow-[0_10px_28px_rgba(0,211,141,.2)] transition hover:-translate-y-0.5 hover:bg-[#00bd7d]">
                  Become an instructor <ArrowRight size={17} />
                </a>
                <Link href="/courses" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d5e3da] bg-white px-6 py-4 text-sm font-bold text-[#294637] transition hover:border-[#9ad8b7] hover:bg-[#f0fbf5]">
                  Explore learning programs <BookOpenCheck size={17} />
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-[#687c70]">
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#00bd7d]" /> Flexible teaching formats</span>
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#00bd7d]" /> Practical, project-based learning</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[#c8f5dc] via-transparent to-[#d7e8ff] blur-2xl opacity-70" />
              <div className="relative overflow-hidden rounded-[2rem] border border-[#d7e8dd] bg-[#10271b] p-6 text-white shadow-[0_30px_90px_rgba(15,55,32,.16)] sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="tv-mono text-[10px] uppercase text-[#7ee6b7]">Make knowledge matter</p>
                    <h2 className="mt-3 max-w-sm text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Teach skills. Open doors.</h2>
                  </div>
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#00d38d] text-[#062719]"><GraduationCap size={25} /></div>
                </div>
                <div className="mt-8 space-y-3">
                  {[
                    ['01', 'Share your expertise', 'Turn your knowledge into a clear learning journey.'],
                    ['02', 'Learn with real projects', 'Help students practice, build and improve.'],
                    ['03', 'Grow with the community', 'Work with a team focused on practical education.'],
                  ].map(([number, title, text]) => (
                    <div key={number} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[.045] p-4">
                      <span className="tv-mono pt-1 text-xs text-[#6de2ad]">{number}</span>
                      <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-5 text-white/60">{text}</p></div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-xs leading-5 text-white/75">
                  <Sparkles size={16} className="shrink-0 text-[#7ee6b7]" />
                  No need to have everything figured out. Tell us what you can teach and we’ll take it from there.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="tv-mono text-[10px] uppercase text-[#078653]">Why teach with us?</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">A platform for your next chapter.</h2>
            <p className="mt-4 text-sm leading-6 text-[#718077] sm:text-base">Bring your skills. We’ll work together to turn them into learning that makes a difference.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-[#e0eae3] bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#a7dfbf] hover:shadow-[0_16px_35px_rgba(9,53,31,.06)]">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#e8fbf1] text-[#087b4c]"><Icon size={21} /></div>
                <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#718077]">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#d9e9df] bg-[#edf9f1] p-5 sm:flex-row sm:items-center sm:p-7">
            <div><p className="font-bold text-[#16452c]">Have teaching experience—or just a strong skill to share?</p><p className="mt-1 text-sm text-[#587564]">We welcome practitioners, educators and working professionals.</p></div>
            <a href="#apply" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#10271b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1b4930]">Start your application <ArrowDown size={16} /></a>
          </div>
        </section>

        <section id="apply" className="scroll-mt-24 border-t border-[#e1ece5] bg-white px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="tv-mono text-[10px] uppercase text-[#078653]">Let’s get started</p>
              <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight sm:text-5xl">Your instructor journey starts here.</h2>
              <p className="mt-5 text-sm leading-7 text-[#718077] sm:text-base">Tell us a little about yourself, what you’d like to teach, and how you want to help learners. Our team will review your application and follow up with you.</p>
              <div className="mt-8 space-y-4">
                <div className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e8fbf1] text-sm font-extrabold text-[#087b4c]">1</span><div><p className="text-sm font-bold">Fill out the form</p><p className="mt-1 text-xs leading-5 text-[#829087]">Share your details and teaching interests.</p></div></div>
                <div className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e8fbf1] text-sm font-extrabold text-[#087b4c]">2</span><div><p className="text-sm font-bold">We review your application</p><p className="mt-1 text-xs leading-5 text-[#829087]">We look at your experience and course idea.</p></div></div>
                <div className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e8fbf1] text-sm font-extrabold text-[#087b4c]">3</span><div><p className="text-sm font-bold">Talk about next steps</p><p className="mt-1 text-xs leading-5 text-[#829087]">If there’s a fit, we’ll contact you to discuss it.</p></div></div>
              </div>
              <p className="mt-8 text-sm text-[#718077]">Questions? <a className="font-bold text-[#078653] hover:underline" href="mailto:info@techvision.edu.et">info@techvision.edu.et</a></p>
            </div>
            <InstructorApplicationForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
