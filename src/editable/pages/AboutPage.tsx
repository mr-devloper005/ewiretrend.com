import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

export default function AboutPage() {
  const about = pagesContent.about
  return (
    <EditableSiteShell>
      <main className="bg-white text-[var(--slot4-page-text)]">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-black/10 bg-[var(--slot4-dark-bg)] text-white">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_90%_-10%,rgba(220,160,109,.22),transparent_55%)]" />
          <span aria-hidden className="floaty absolute right-[12%] top-[28%] h-5 w-5 bg-[var(--slot4-accent)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <p className="hero-rise text-[11px] font-black uppercase tracking-[0.3em] text-[var(--slot4-accent)]">{about.eyebrow}</p>
            <h1 className="hero-rise editorial-brand mt-5 max-w-5xl text-5xl leading-[0.9] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
              <span className="text-[var(--slot4-accent)]/60">[</span>{about.heroTitle}<span className="text-[var(--slot4-accent)]/60">]</span>
            </h1>
          </div>
        </section>

        {/* Stats strip */}
        <section className="border-b border-black/10 bg-[var(--slot4-cream)]">
          <div className="mx-auto grid max-w-[var(--editable-container)] grid-cols-2 gap-px bg-black/10 sm:grid-cols-4">
            {about.stats.map((stat, index) => (
              <div key={stat.label} data-reveal style={delay(index * 90)} className="bg-[var(--slot4-cream)] p-8 text-center">
                <p className="text-4xl font-black tracking-[-0.05em] text-[var(--slot4-accent)] sm:text-5xl">{stat.value}</p>
                <p className="mt-2 text-[11px] font-black uppercase tracking-[0.16em] text-black/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="mx-auto grid max-w-[var(--editable-container)] border-x border-black/10 lg:grid-cols-[1.45fr_0.55fr]">
          <article className="border-b border-black/10 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-16" data-reveal="left">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent)]">About {SITE_CONFIG.name}</p>
            <p className="editorial-serif mt-6 text-3xl font-black leading-[1.18] tracking-[-0.02em] sm:text-4xl">{about.description}</p>
            <div className="article-content mt-10 space-y-6">
              {about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
          <aside className="grid bg-[var(--slot4-cream)]">
            {about.values.map((value, index) => (
              <div key={value.title} data-reveal style={delay(index * 110)} className="border-b border-black/10 p-7 last:border-b-0 sm:p-9">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent)]">0{index + 1}</p>
                <h2 className="editorial-serif mt-4 text-2xl font-black leading-tight">{value.title}</h2>
                <p className="mt-4 text-sm leading-7 text-black/55">{value.description}</p>
              </div>
            ))}
          </aside>
        </section>

        {/* CTA */}
        <section className="border-y border-black/10 bg-[var(--slot4-accent)] text-white">
          <div className="mx-auto flex max-w-[var(--editable-container)] flex-col gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8" data-reveal>
            <h2 className="editorial-brand max-w-3xl text-3xl leading-[1.02] tracking-[-0.03em] sm:text-5xl">Ready to put your announcement on the wire?</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="group inline-flex w-fit items-center gap-2 bg-white px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-black transition hover:bg-[var(--slot4-dark-bg)] hover:text-white">Get a quote <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
              <Link href="/search" className="inline-flex w-fit items-center gap-2 border border-white/50 px-7 py-4 text-xs font-black uppercase tracking-[0.16em] transition hover:bg-white hover:text-[var(--slot4-accent)]">Explore the archive</Link>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
