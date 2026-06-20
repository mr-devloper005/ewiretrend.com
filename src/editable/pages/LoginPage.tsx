import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Send, BarChart3 } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { SITE_CONFIG } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Log in', description: pagesContent.auth.login.metadataDescription })
}

const perks = [
  { icon: Send, label: 'Submit and schedule releases' },
  { icon: BarChart3, label: 'Track distribution pickup' },
  { icon: ShieldCheck, label: 'Verified outlet network' },
]

export default function LoginPage() {
  const copy = pagesContent.auth.login
  return (
    <EditableSiteShell>
      <main className="bg-white text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] border-x border-black/10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative flex flex-col justify-center overflow-hidden border-b border-black/10 bg-[var(--slot4-dark-bg)] p-8 text-white sm:p-12 lg:border-b-0 lg:border-r lg:p-16" data-reveal="left">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(220,160,109,.25),transparent_55%)]" />
            <span aria-hidden className="floaty absolute right-12 top-16 h-5 w-5 bg-[var(--slot4-accent)]" />
            <div className="relative">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{copy.badge}</p>
              <h1 className="editorial-brand mt-5 max-w-xl text-5xl leading-[0.92] tracking-[-0.035em] sm:text-7xl">{copy.title}</h1>
              <p className="mt-6 max-w-md text-sm font-semibold leading-8 text-white/60">{copy.description}</p>
              <ul className="mt-10 grid gap-3">
                {perks.map((perk) => (
                  <li key={perk.label} className="flex items-center gap-3 text-sm font-bold text-white/75">
                    <span className="flex h-9 w-9 items-center justify-center bg-[var(--slot4-accent)]/15 text-[var(--slot4-accent)]"><perk.icon className="h-4 w-4" /></span>
                    {perk.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16" data-reveal="right">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Member access</p>
            <h2 className="editorial-serif mt-3 text-4xl font-black tracking-[-0.03em]">{copy.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-6 border-t border-black/10 pt-5 text-sm text-black/55">
              New to {SITE_CONFIG.name}? <Link href="/signup" className="font-black text-[var(--slot4-accent)] underline-offset-4 hover:underline">{copy.createCta}</Link>
            </p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
