import type { Metadata } from 'next'
import Link from 'next/link'
import { Globe2, Rocket, Users } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { SITE_CONFIG } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

const highlights = [
  { icon: Globe2, value: '5K+', label: 'Outlets' },
  { icon: Users, value: '10M+', label: 'Reach' },
  { icon: Rocket, value: '24h', label: 'Turnaround' },
]

export default function SignupPage() {
  const copy = pagesContent.auth.signup
  return (
    <EditableSiteShell>
      <main className="bg-white text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] border-x border-black/10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-center border-b border-black/10 p-7 sm:p-12 lg:border-b-0 lg:border-r lg:p-16" data-reveal="left">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Create account</p>
            <h1 className="editorial-serif mt-3 text-4xl font-black tracking-[-0.03em]">{copy.formTitle}</h1>
            <EditableLocalSignupForm />
            <p className="mt-6 border-t border-black/10 pt-5 text-sm text-black/55">
              Already with {SITE_CONFIG.name}? <Link href="/login" className="font-black text-[var(--slot4-accent)] underline-offset-4 hover:underline">{copy.loginCta}</Link>
            </p>
          </div>
          <div className="relative flex flex-col justify-center overflow-hidden bg-[var(--slot4-accent)] p-8 text-white sm:p-12 lg:p-16" data-reveal="right">
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(0deg,rgba(255,255,255,.4)_1px,transparent_1px)] [background-size:100%_44px]" />
            <div className="relative">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/85">{copy.badge}</p>
              <h2 className="editorial-brand mt-5 max-w-xl text-5xl leading-[0.92] tracking-[-0.035em] sm:text-7xl">{copy.title}</h2>
              <p className="mt-6 max-w-md text-sm font-semibold leading-8 text-white/80">{copy.description}</p>
              <div className="mt-10 grid grid-cols-3 gap-px bg-white/25">
                {highlights.map((item) => (
                  <div key={item.label} className="bg-[var(--slot4-accent)] p-4 text-center">
                    <item.icon className="mx-auto h-5 w-5" />
                    <p className="mt-2 text-2xl font-black tracking-[-0.04em]">{item.value}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/70">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
