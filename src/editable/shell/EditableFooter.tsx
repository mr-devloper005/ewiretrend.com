'use client'

import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { mediaDistributionRoute } from '@/config/media-distribution-route'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const name = SITE_CONFIG.name
  const initial = (name || 'M').trim().charAt(0).toUpperCase()

  const exploreLinks = [
    { label: 'Newsroom', href: mediaDistributionRoute },
    { label: 'Press Releases', href: '/press-release' },
    { label: 'Search Archive', href: '/search' },
  ]

  return (
    <footer className="border-t-[6px] border-[var(--slot4-accent)] bg-[var(--slot4-dark-bg)] text-white">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_.7fr_.7fr_.9fr]">
          <div data-reveal>
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center bg-[var(--slot4-accent)] text-xl font-black text-white">{initial}</span>
              <span className="editorial-brand text-3xl">{name}</span>
            </Link>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/55">
              {globalContent.footer?.description || SITE_CONFIG.description}
            </p>
            <form action="/signup" className="mt-7 flex max-w-md border border-white/20">
              <input
                name="email"
                type="email"
                placeholder="Email for distribution updates"
                className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-white/35"
              />
              <button className="bg-[var(--slot4-accent)] px-5 text-[11px] font-black uppercase tracking-[0.14em] transition hover:bg-white hover:text-black">
                Join
              </button>
            </form>
          </div>

          <div data-reveal style={delay(90)}>
            <h3 className="border-b border-white/15 pb-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/45">Distribute</h3>
            <div className="mt-5 grid gap-3.5">
              {exploreLinks.map((item) => (
                <Link key={item.href} href={item.href} className="group inline-flex items-center justify-between text-sm font-black uppercase tracking-[0.06em] text-white/80 transition hover:text-[var(--slot4-accent)]">
                  {item.label}
                  <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>

          <div data-reveal style={delay(160)}>
            <h3 className="border-b border-white/15 pb-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/45">Company</h3>
            <div className="mt-5 grid gap-3.5">
              <Link href="/about" className="text-sm font-black uppercase tracking-[0.06em] text-white/80 transition hover:text-[var(--slot4-accent)]">About</Link>
              <Link href="/contact" className="text-sm font-black uppercase tracking-[0.06em] text-white/80 transition hover:text-[var(--slot4-accent)]">Contact</Link>
              {session ? (
                <>
                  <Link href="/create" className="text-sm font-black uppercase tracking-[0.06em] text-white/80 transition hover:text-[var(--slot4-accent)]">Publish</Link>
                  <button onClick={logout} className="text-left text-sm font-black uppercase tracking-[0.06em] text-white/80 transition hover:text-[var(--slot4-accent)]">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-black uppercase tracking-[0.06em] text-white/80 transition hover:text-[var(--slot4-accent)]">Log in</Link>
                  <Link href="/signup" className="text-sm font-black uppercase tracking-[0.06em] text-white/80 transition hover:text-[var(--slot4-accent)]">Sign up</Link>
                </>
              )}
            </div>
          </div>

          <div data-reveal style={delay(230)}>
            <h3 className="border-b border-white/15 pb-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/45">Newsdesk</h3>
            <div className="mt-5 grid gap-3.5 text-sm text-white/70">
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[var(--slot4-accent)]" /> Global distribution network</span>
              <span className="text-white/45">Newswire · Syndication · PR</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
        © {year} {name}. {globalContent.footer?.bottomNote || 'Built for fast, category-led media distribution.'}
      </div>
    </footer>
  )
}
