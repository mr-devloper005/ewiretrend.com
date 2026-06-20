'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, LogOut, Menu, Search, UserRound, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { mediaDistributionRoute } from '@/config/media-distribution-route'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

function BrandMark() {
  const name = SITE_CONFIG.name || 'Media'
  const initial = name.trim().charAt(0).toUpperCase() || 'M'
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label={name}>
      <span className="flex h-11 w-11 items-center justify-center bg-[var(--slot4-accent)] text-lg font-black text-white shadow-[0_8px_22px_rgba(165,91,75,.34)] transition group-hover:rotate-[-4deg]">
        {initial}
      </span>
      <span className="editorial-brand max-w-[44vw] truncate text-2xl leading-none text-[var(--slot4-page-text)] sm:text-[1.65rem]">
        {name}
      </span>
    </Link>
  )
}

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Newsroom', href: mediaDistributionRoute },
    { label: 'Search', href: '/search' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur">
      <div
        className={`mx-auto flex max-w-[var(--editable-container)] items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          scrolled ? 'py-2.5' : 'py-4'
        }`}
      >
        <BrandMark />

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={isActive(item.href)}
              className="nav-underline text-[13px] font-black uppercase tracking-[0.14em] text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)] data-[active=true]:text-[var(--slot4-accent)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center border border-black/15 text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:flex"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <div className="hidden items-center gap-3 lg:flex">
              <span className="inline-flex items-center gap-2 border border-black/15 px-3 py-2.5 text-[11px] font-black uppercase tracking-[0.12em]">
                <UserRound className="h-3.5 w-3.5 text-[var(--slot4-accent)]" />
                {session.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="nav-underline hidden text-[11px] font-black uppercase tracking-[0.12em] lg:block"
            >
              Log in
            </Link>
          )}

          <Link
            href={session ? '/create' : '/signup'}
            className="group hidden items-center gap-2 bg-[var(--slot4-accent)] px-5 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-[var(--slot4-dark-bg)] sm:inline-flex"
          >
            {session ? 'Publish' : 'Subscribe'}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center border border-black/15 lg:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-black/10 bg-white px-4 py-4 lg:hidden">
          <div className="grid gap-px bg-black/10">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="bg-white px-4 py-3.5 text-sm font-black uppercase tracking-[0.1em]"
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/create" onClick={() => setOpen(false)} className="bg-white px-4 py-3.5 text-sm font-black uppercase tracking-[0.1em]">Publish</Link>
                <button
                  type="button"
                  onClick={() => { logout(); setOpen(false) }}
                  className="bg-white px-4 py-3.5 text-left text-sm font-black uppercase tracking-[0.1em] text-[var(--slot4-accent)]"
                >
                  Logout ({session.name})
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="bg-white px-4 py-3.5 text-sm font-black uppercase tracking-[0.1em]">Log in</Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="bg-white px-4 py-3.5 text-sm font-black uppercase tracking-[0.1em] text-[var(--slot4-accent)]">Sign up</Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
