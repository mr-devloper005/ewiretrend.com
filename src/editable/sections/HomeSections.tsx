import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, BadgeCheck, Crosshair, Globe2, PenTool, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { CompactIndexCard, getEditableExcerpt, postHref, WireTextCard } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties
const rise = (ms: number) => ({ '--rise-delay': `${ms}ms` }) as CSSProperties

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

const benefitIcons = [Globe2, Crosshair, BadgeCheck, PenTool]

/* ============================== HERO + BENEFITS ============================ */
export function EditableHomeHero(_props: HomeSectionProps) {
  const hero = pagesContent.home.hero
  const benefits = pagesContent.home.benefits

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--slot4-dark-bg)] text-white">
        {/* floating accent blocks (Drone-style) */}
        <span aria-hidden className="floaty absolute right-[18%] top-[16%] h-6 w-6 bg-[var(--slot4-accent)]/80" />
        <span aria-hidden className="floaty-slow absolute right-[26%] top-[30%] h-3 w-3 bg-[var(--slot4-accent)]/60" />
        <span aria-hidden className="floaty absolute right-[10%] bottom-[24%] h-4 w-4 bg-[var(--slot4-accent)]/50" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_85%_-10%,rgba(220,160,109,.22),transparent_55%)]" />

        <div className={`relative ${dc.shell.section} py-16 sm:py-20 lg:py-28`}>
          <p className="hero-rise text-[11px] font-black uppercase tracking-[0.32em] text-[var(--slot4-accent)]">{hero.eyebrow}</p>

          <h1 className="mt-6 flex flex-wrap items-start gap-x-6 text-[15vw] font-black uppercase leading-[0.82] tracking-[-0.05em] sm:text-[12vw] lg:text-[8.6rem]">
            <span className="hero-rise text-[var(--slot4-accent)]" style={rise(80)}>
              <span className="mr-1 text-[var(--slot4-accent)]/60">[</span>
              {hero.titleLines[0].text}
            </span>
            <span className="hero-rise w-full text-white" style={rise(200)}>
              {hero.titleLines[1].text}
              <span className="ml-2 text-[var(--slot4-accent)]/60">]</span>
            </span>
          </h1>

          <div className="mt-12 grid gap-8 border-t border-white/15 pt-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div className="hero-rise" style={rise(320)}>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-white">{hero.kicker}</p>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-white/70">{hero.kickerSub}</p>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/60">{hero.description}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={hero.primaryCta.href} className="group inline-flex items-center gap-2 bg-[var(--slot4-accent)] px-7 py-4 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-black">
                  {hero.primaryCta.label} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href={hero.secondaryCta.href} className="inline-flex items-center gap-2 border border-white/30 px-7 py-4 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
                  {hero.secondaryCta.label}
                </Link>
              </div>
            </div>
            <div className="hero-rise flex flex-wrap gap-x-8 gap-y-3 lg:justify-end" style={rise(420)}>
              {hero.socials.map((social) => (
                <Link key={social.label} href={social.href} className="nav-underline text-[11px] font-black uppercase tracking-[0.18em] text-white/70 transition hover:text-white">
                  {social.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits band */}
      <section className="bg-white">
        <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
          <div className="text-center" data-reveal>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{benefits.eyebrow}</p>
            <h2 className="editorial-brand mx-auto mt-4 max-w-3xl text-4xl leading-[0.98] tracking-[-0.03em] sm:text-5xl">
              {benefits.title[0]} <span className="block">{benefits.title[1]}</span>
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.items.map((item, index) => {
              const Icon = benefitIcons[index % benefitIcons.length]
              return (
                <div
                  key={item.title}
                  data-reveal
                  style={delay(index * 110)}
                  className="card-lift group border border-black/10 bg-white p-7 text-center hover:border-[var(--slot4-accent)] hover:shadow-[0_24px_60px_rgba(17,17,17,0.08)]"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[var(--slot4-accent)]/30 text-[var(--slot4-accent)] transition group-hover:bg-[var(--slot4-accent)] group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-lg font-black uppercase tracking-[0.04em]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-black/55">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

/* ============================== LATEST STORIES ============================ */
export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const grid = posts.slice(0, 6)
  if (!grid.length) return null
  const marquee = pagesContent.home.marquee
  return (
    <section className="bg-[var(--slot4-cream)]">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <div className="flex flex-wrap items-end justify-between gap-6 border-b-4 border-black pb-5" data-reveal>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{pagesContent.home.storyRail.eyebrow}</p>
            <h2 className="editorial-brand mt-2 text-4xl tracking-[-0.04em] sm:text-5xl">{pagesContent.home.storyRail.title}</h2>
          </div>
          <Link href={primaryRoute} className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] transition hover:text-[var(--slot4-accent)]">
            View all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {grid.map((post, index) => (
            <WireTextCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
      </div>

      {/* marquee strip */}
      <div className="overflow-hidden border-y border-black/10 bg-[var(--slot4-accent)] py-4 text-white">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-sm font-black uppercase tracking-[0.2em]">
          {marquee.map((word, index) => (
            <span key={word} className="inline-flex items-center gap-8">
              {word}
              {index < marquee.length - 1 ? <span className="text-white/50">/</span> : null}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================== ABOUT / SHOWCASE ============================ */
export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const about = pagesContent.home.about
  const stats = pagesContent.home.stats
  const featured = posts.slice(0, 5)

  return (
    <section className="bg-[var(--slot4-dark-bg)] text-white">
      <div className={`${dc.shell.section} py-16 sm:py-20 lg:py-24`}>
        <div className="grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:items-start">
          <div data-reveal="left">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{about.eyebrow}</p>
            <h2 className="editorial-brand mt-5 text-4xl leading-[0.96] tracking-[-0.035em] sm:text-6xl">
              {about.title[0]} <span className="block text-white/90">{about.title[1]}</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/55">{about.description}</p>

            <div className="mt-10 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={stat.label} data-reveal style={delay(index * 90)} className="bg-[var(--slot4-dark-bg)] p-5 text-center">
                  <p className="text-3xl font-black tracking-[-0.04em] text-[var(--slot4-accent)]">{stat.value}</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link href={primaryRoute} className="group mt-10 inline-flex items-center gap-2 bg-[var(--slot4-accent)] px-7 py-4 text-xs font-black uppercase tracking-[0.14em] transition hover:bg-white hover:text-black">
              Explore the wire <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div data-reveal="right" className="border border-white/12 bg-white/[0.03] p-7 sm:p-9">
            <div className="flex items-center justify-between border-b border-white/12 pb-4">
              <h3 className="text-2xl font-black uppercase tracking-[-0.03em]">{pagesContent.home.features.title}</h3>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{pagesContent.home.features.eyebrow}</span>
            </div>
            <div className="mt-2">
              {featured.length ? (
                featured.map((post, index) => (
                  <Link
                    key={post.id}
                    href={postHref(primaryTask, post, primaryRoute)}
                    data-reveal
                    style={delay(index * 80)}
                    className="group grid grid-cols-[44px_1fr] gap-4 border-t border-white/10 py-5 first:border-t-0"
                  >
                    <span className="text-3xl font-black leading-none text-[var(--slot4-accent)]">{String(index + 1).padStart(2, '0')}</span>
                    <div className="min-w-0">
                      <h4 className="line-clamp-2 text-lg font-black leading-tight tracking-[-0.03em] transition group-hover:text-[var(--slot4-accent)]">{post.title}</h4>
                      <p className="mt-2 line-clamp-2 text-xs leading-6 text-white/45">{getEditableExcerpt(post, 110)}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="py-8 text-sm text-white/50">Distributed releases will appear here as soon as they publish.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ====================== MORE TO DISCOVER + BRIEFING ======================= */
export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const collected = timeSections.flatMap((section) => section.posts)
  const source = collected.length ? collected : posts.slice(2)
  const lead = source[0] || posts[0]
  const briefs = source.slice(1, 7)
  if (!lead) return null

  return (
    <section className="bg-white">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr]">
          <div data-reveal="left">
            <div className="border-b-4 border-black pb-4">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{pagesContent.home.moreToDiscover.eyebrow}</p>
              <h2 className="editorial-brand mt-2 text-4xl tracking-[-0.04em] sm:text-5xl">{pagesContent.home.moreToDiscover.title}</h2>
            </div>
            <Link
              href={postHref(primaryTask, lead, primaryRoute)}
              className="card-lift group mt-7 block border border-black/10 bg-[var(--slot4-dark-bg)] p-8 text-white hover:border-[var(--slot4-accent)] sm:p-10"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent)]">Editor&apos;s pick</p>
              <h3 className="mt-4 text-4xl font-black leading-[0.98] tracking-[-0.045em] transition group-hover:text-[var(--slot4-accent)] sm:text-5xl">{lead.title}</h3>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55">{getEditableExcerpt(lead, 180)}</p>
              <span className="mt-7 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em]">Read release <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
            </Link>
          </div>

          <aside data-reveal="right">
            <div className="border-b-4 border-black pb-4">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{pagesContent.home.briefing.eyebrow}</p>
              <h2 className="editorial-brand mt-2 text-4xl tracking-[-0.04em] sm:text-5xl">{pagesContent.home.briefing.title}</h2>
            </div>
            <div className="mt-2">
              {briefs.map((post, index) => <CompactIndexCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
            </div>
          </aside>
        </div>

        {/* search band */}
        <form action="/search" className="mt-14 grid border-y-4 border-black bg-[var(--slot4-cream)] p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-9" data-reveal>
          <div>
            <h3 className="editorial-brand text-3xl tracking-[-0.04em]">{pagesContent.home.searchBand.title}</h3>
            <p className="mt-2 text-sm text-black/55">Explore every {taskLabel(primaryTask).toLowerCase()} distributed by {SITE_CONFIG.name}.</p>
          </div>
          <label className="mt-5 flex border border-black bg-white sm:mt-0 sm:min-w-[420px]">
            <Search className="ml-4 mt-4 h-4 w-4" />
            <input name="q" placeholder={pagesContent.home.searchBand.placeholder} className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm outline-none" />
            <button className="bg-[var(--slot4-accent)] px-6 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-[var(--slot4-dark-bg)]">Search</button>
          </label>
        </form>
      </div>
    </section>
  )
}

/* ============================== CLOSING CTA ============================ */
export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  const closing = pagesContent.home.closing
  return (
    <>
      {/* red order band (Drone-style) */}
      <section className="relative overflow-hidden bg-[var(--slot4-accent)] text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(90deg,rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className={`relative ${dc.shell.section} flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-center`}>
          <h2 className="editorial-brand max-w-3xl text-3xl leading-[1.02] tracking-[-0.03em] sm:text-4xl" data-reveal="left">{cta.title}</h2>
          <Link href={cta.href} className="group inline-flex items-center gap-2 bg-white px-7 py-4 text-xs font-black uppercase tracking-[0.14em] text-black transition hover:bg-[var(--slot4-dark-bg)] hover:text-white" data-reveal="right">
            {cta.button} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="bg-[var(--slot4-dark-bg)] text-white">
        <div className={`${dc.shell.section} grid gap-px bg-white/15 lg:grid-cols-2`}>
          <div className="bg-[var(--slot4-dark-bg)] px-6 py-16 sm:px-10 lg:py-24" data-reveal>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{closing.eyebrow}</p>
            <h2 className="editorial-brand mt-4 max-w-xl text-4xl leading-[0.96] tracking-[-0.04em] sm:text-6xl">{closing.title}</h2>
          </div>
          <div className="flex flex-col justify-center bg-[var(--slot4-dark-bg)] px-6 py-16 sm:px-10 lg:py-24" data-reveal style={delay(120)}>
            <p className="max-w-xl text-base leading-7 text-white/55">{closing.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={closing.primaryCta.href} className="bg-[var(--slot4-accent)] px-7 py-4 text-xs font-black uppercase tracking-[0.14em] transition hover:bg-white hover:text-black">{closing.primaryCta.label}</Link>
              <Link href={closing.secondaryCta.href} className="border border-white/40 px-7 py-4 text-xs font-black uppercase tracking-[0.14em] transition hover:bg-white hover:text-black">{closing.secondaryCta.label}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
