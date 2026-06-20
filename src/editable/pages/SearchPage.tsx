import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const strong = index % 5 === 0

  return (
    <Link href={href} data-reveal className={`card-lift group flex flex-col overflow-hidden border-b border-r border-black/10 bg-white hover:border-[var(--slot4-accent)] ${strong ? 'md:col-span-2' : ''}`}>
      {image ? (
        <div className={`zoom-frame relative overflow-hidden bg-[var(--slot4-dark-bg)] ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" className="h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute left-4 top-4 bg-[var(--slot4-accent)] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">{taskLabel}</span>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        {!image ? <span className="w-fit bg-[var(--slot4-accent)] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">{taskLabel}</span> : null}
        <h2 className="editorial-serif mt-4 line-clamp-3 text-2xl font-black leading-[1.04] tracking-[-0.03em] transition group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
        {summary ? <p className="mt-4 line-clamp-3 flex-1 text-sm font-semibold leading-7 text-black/55">{summary}</p> : <div className="flex-1" />}
        <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-black/45 transition group-hover:text-[var(--slot4-accent)]">Open result <ArrowUpRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)
  const hero = pagesContent.search.hero

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] border-x border-black/10">
          {/* Hero + search form */}
          <div className="grid border-b border-black/10 md:grid-cols-[0.85fr_1.15fr]">
            <div className="relative overflow-hidden bg-[var(--slot4-dark-bg)] p-7 text-white sm:p-10 lg:p-14" data-reveal="left">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(220,160,109,.25),transparent_55%)]" />
              <div className="relative">
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{hero.badge}</p>
                <h1 className="editorial-brand mt-5 text-5xl leading-[0.9] tracking-[-0.04em] sm:text-7xl">{hero.title}</h1>
                <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-white/60">{hero.description}</p>
              </div>
            </div>
            <form action="/search" className="self-center p-6 sm:p-10 lg:p-14" data-reveal="right">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 border border-black/15 bg-white px-4 py-3.5 focus-within:border-[var(--slot4-accent)]">
                <Search className="h-5 w-5 text-black/40" />
                <input name="q" defaultValue={query} placeholder={hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-bold outline-none placeholder:text-black/35" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 border border-black/15 bg-white px-4 py-3.5 focus-within:border-[var(--slot4-accent)]">
                  <Filter className="h-4 w-4 text-black/40" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-black/35" />
                </label>
                <select name="task" defaultValue={task} className="border border-black/15 bg-white px-4 py-3.5 text-sm font-black outline-none focus:border-[var(--slot4-accent)]">
                  <option value="">All content types</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
              </div>
              <button className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 bg-[var(--slot4-dark-bg)] px-6 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-[var(--slot4-accent)]" type="submit">
                Search the wire <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4 border-b-4 border-black px-4 py-8 sm:px-6 lg:px-8" data-reveal>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-black/45">{results.length} results</p>
              <h2 className="editorial-brand mt-2 text-4xl tracking-[-0.035em]">{query ? `Results for “${query}”` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/search" className="inline-flex items-center gap-2 border border-black/15 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.12em] transition hover:bg-[var(--slot4-dark-bg)] hover:text-white">Browse latest <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="grid border-l border-t border-black/10 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="m-8 border border-dashed border-black/20 bg-[var(--slot4-cream)] p-12 text-center">
              <Search className="mx-auto h-8 w-8 text-black/40" />
              <p className="mt-4 text-2xl font-black tracking-[-0.04em]">No matching posts found.</p>
              <p className="mt-3 text-sm font-semibold text-black/55">Try a different keyword, content type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
