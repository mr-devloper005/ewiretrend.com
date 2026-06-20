import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Newspaper, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  mediaDistribution: { icon: Newspaper, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3', promise: 'Newswire cards prioritize source, category, headline, and publication-ready summaries.', badge: 'News' },
  article: { icon: FileText, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3', promise: 'Readable editorial cards with room for headlines and excerpts.', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-6 xl:grid-cols-2', promise: 'Directory cards highlight company identity, location, contacts, and service details.', badge: 'Business' },
  classified: { icon: FileText, archiveClass: 'grid gap-6 xl:grid-cols-2', promise: 'Offer-board cards prioritize price, location, condition, and quick action.', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-6 space-y-6 md:columns-2 xl:columns-3', promise: 'Gallery-first browsing with strong visuals and compact captions.', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Bookmark cards stay mostly text-based so saved resources scan quickly.', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3', promise: 'Document cards surface file context, download intent, and summary.', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-4', promise: 'Profile cards focus on identity, short bio, and direct discovery.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const limit = 24
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)

  // Primary: task-scoped feed (correct when the master panel tags posts by task type).
  const primary = await fetchPaginatedTaskPosts(task, { page, limit, category })
  let posts = primary.posts
  let pagination = primary.pagination

  // Fallback: when the task-scoped request returns nothing, the master panel posts are
  // likely untyped (common for AI-posted records). Pull the SAME real, unscoped feed the
  // homepage uses and keep only posts that resolve to this task. This never uses mock data.
  if (!posts.length) {
    const fallback = await fetchRealTaskPosts(task, { page, limit, category })
    posts = fallback.posts
    pagination = fallback.pagination
  }

  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

const getPostCategory = (post: SitePost) => {
  const content = post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw = typeof content.category === 'string' ? content.category : post.tags?.[0] || ''
  return raw ? normalizeCategory(raw) : ''
}

// Real-data fallback used only when the task-scoped fetch is empty. Source is the live
// master feed (fetchSiteFeed) — identical to the homepage — so results are real, not mock.
async function fetchRealTaskPosts(
  task: TaskKey,
  { page, limit, category }: { page: number; limit: number; category: string },
): Promise<{ posts: SitePost[]; pagination: SiteFeedPagination }> {
  const emptyPagination: SiteFeedPagination = { page, limit, total: 0, totalPages: 1, hasPrevPage: page > 1, hasNextPage: false }
  try {
    const feed = await fetchSiteFeed(300, { fresh: true, timeoutMs: 5000 })
    const all = (feed?.posts || []).filter((post) => {
      const status = typeof (post as { status?: unknown }).status === 'string' ? String((post as { status?: unknown }).status).toUpperCase() : ''
      if (status && status !== 'PUBLISHED') return false
      if (getPostTaskKey(post) !== task) return false
      if (category && category !== 'all' && getPostCategory(post) !== category) return false
      return true
    })
    const total = all.length
    const start = (page - 1) * limit
    return {
      posts: all.slice(start, start + limit),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        hasPrevPage: page > 1,
        hasNextPage: start + limit < total,
      },
    }
  } catch {
    return { posts: [], pagination: emptyPagination }
  }
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const dynamicCategories = Array.from(new Map([
    ...CATEGORY_OPTIONS,
    ...posts.map((post) => {
      const raw = getCategory(post, '')
      return raw ? { name: raw, slug: normalizeCategory(raw) } : null
    }).filter((item): item is { name: string; slug: string } => Boolean(item)),
  ].map((item) => [item.slug, item])).values())
  const categoryLabel = category === 'all' ? 'All categories' : dynamicCategories.find((item) => item.slug === category)?.name || category

  if (task === 'mediaDistribution' || task === 'article') {
    return (
      <EditorialArchive
        posts={posts}
        pagination={pagination}
        category={category}
        categoryLabel={categoryLabel}
        categories={dynamicCategories}
        basePath={basePath}
        label={label}
      />
    )
  }

  return (
    <EditableSiteShell>
      <main className="bg-white text-[var(--slot4-page-text)]">
        <section className="border-b border-black/10 bg-[var(--slot4-cream)]">
          <div className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:px-8 lg:py-16">
            <div data-reveal="left">
              <div className="inline-flex items-center gap-2 bg-[var(--slot4-accent)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white"><Icon className="h-4 w-4" /> {label}</div>
              <h1 className="editorial-brand mt-5 max-w-3xl text-5xl leading-[0.94] tracking-[-0.04em] sm:text-6xl">{voice?.headline || `Browse ${label}`}</h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-black/55">{voice?.description || SITE_CONFIG.description}</p>
              <p className="mt-5 border-l-4 border-[var(--slot4-accent)] pl-4 text-sm font-bold leading-7 text-black/60">{deck.promise}</p>
            </div>

            <form action={basePath} className="border border-black/12 bg-white p-5 shadow-sm" data-reveal="right">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-black/45"><Filter className="h-4 w-4" /> Filter</div>
              <select name="category" defaultValue={category} className="mt-4 h-12 w-full border border-black/15 bg-white px-4 text-sm font-bold outline-none focus:border-[var(--slot4-accent)]">
                <option value="all">All categories</option>
                {dynamicCategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="mt-3 h-12 w-full bg-[var(--slot4-dark-bg)] text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[var(--slot4-accent)]">Apply</button>
              <p className="mt-3 text-xs font-bold text-black/45">Showing: {categoryLabel}</p>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8">
          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <EmptyArchive />
          )}

          <Pagination basePath={basePath} category={category} page={page} pagination={pagination} />
        </section>
      </main>
    </EditableSiteShell>
  )
}

function EditorialArchive({
  posts,
  pagination,
  category,
  categoryLabel,
  categories,
  basePath,
  label,
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  categoryLabel: string
  categories: { name: string; slug: string }[]
  basePath: string
  label: string
}) {
  const page = pagination.page || 1
  const total = pagination.total || posts.length
  const lead = posts[0]
  const secondary = posts.slice(1, 3)
  const remaining = posts.slice(3)
  const heading = category === 'all' ? label : categoryLabel
  const pill = (active: boolean) =>
    `whitespace-nowrap border px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] transition ${active ? 'border-[var(--slot4-accent)] bg-[var(--slot4-accent)] text-white' : 'border-white/25 text-white/70 hover:border-white/60 hover:text-white'}`

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[var(--slot4-page-text)]">
        {/* ===== Masthead hero ===== */}
        <section className="relative overflow-hidden bg-[var(--slot4-dark-bg)] text-white">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_88%_-10%,rgba(220,160,109,.22),transparent_55%)]" />
          <span aria-hidden className="floaty absolute right-[14%] top-[24%] h-6 w-6 bg-[var(--slot4-accent)]/80" />
          <span aria-hidden className="floaty-slow absolute right-[8%] top-[48%] h-3 w-3 bg-[var(--slot4-accent-2)]/70" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-[0.24em]">
              <span className="inline-flex items-center gap-2 text-[var(--slot4-accent)]"><span className="h-2 w-2 animate-pulse rounded-full bg-[var(--slot4-accent)]" /> The newsroom wire</span>
              <span className="text-white/35">/</span>
              <span className="text-white/55">{total} {total === 1 ? 'release' : 'releases'}</span>
            </div>
            <h1 className="hero-rise editorial-brand mt-5 max-w-5xl text-6xl leading-[0.84] tracking-[-0.045em] sm:text-7xl lg:text-8xl">
              <span className="text-[var(--slot4-accent)]/55">[</span>{heading}<span className="text-[var(--slot4-accent)]/55">]</span>
            </h1>
            <div className="mt-9 flex flex-col gap-6 border-t border-white/15 pt-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                <Link href={basePath} className={pill(category === 'all')}>Latest</Link>
                {categories.slice(0, 6).map((item) => (
                  <Link key={item.slug} href={pageHref(basePath, item.slug, 1)} className={pill(category === item.slug)}>{item.name}</Link>
                ))}
              </div>
              <form action="/search" className="flex w-full max-w-sm border border-white/20 bg-white/[0.04]">
                <input name="q" placeholder="Search the wire" className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/40" />
                <button className="bg-[var(--slot4-accent)] px-4 text-white transition hover:bg-white hover:text-black" aria-label="Search"><Search className="h-4 w-4" /></button>
              </form>
            </div>
          </div>
        </section>

        {/* ===== Featured lead ===== */}
        {lead ? (
          <section className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-14" data-reveal>
            <div className="grid border border-black/10 lg:grid-cols-2">
              <Link href={`${basePath}/${lead.slug}`} className="zoom-frame group relative min-h-[20rem] overflow-hidden bg-[var(--slot4-dark-bg)] lg:min-h-[30rem]">
                <img src={getImage(lead)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <span className="absolute left-5 top-5 bg-[var(--slot4-accent)] px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">Lead release</span>
              </Link>
              <Link href={`${basePath}/${lead.slug}`} className="group flex flex-col justify-center border-t border-black/10 bg-[var(--slot4-cream)] p-8 sm:p-12 lg:border-l lg:border-t-0">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{getCategory(lead, label)}</span>
                <h2 className="editorial-serif mt-4 text-4xl font-black leading-[0.98] tracking-[-0.04em] transition group-hover:text-[var(--slot4-accent)] sm:text-5xl">{lead.title}</h2>
                
                <span className="mt-7 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em]">Read release <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
              </Link>
            </div>

            {secondary.length ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {secondary.map((post, index) => (
                  <Link key={post.id || post.slug} href={`${basePath}/${post.slug}`} className="card-lift group grid grid-cols-[8rem_1fr] border border-black/10 bg-white hover:border-[var(--slot4-accent)]">
                    <div className="zoom-frame overflow-hidden bg-[var(--slot4-dark-bg)]">
                      <img src={getImage(post)} alt="" className="h-full min-h-36 w-full object-cover grayscale transition group-hover:grayscale-0" />
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent)]">0{index + 1} · {getCategory(post, label)}</p>
                      <h3 className="editorial-serif mt-2 line-clamp-3 text-lg font-black leading-tight transition group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        {/* ===== Grid ===== */}
        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b-4 border-[var(--slot4-dark-bg)] pb-4" data-reveal>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Distribution feed</p>
              <h2 className="editorial-brand mt-1 text-4xl tracking-[-0.035em] sm:text-5xl">More from the desk</h2>
            </div>
            <form action={basePath} className="flex border border-black/15 bg-white">
              <select name="category" defaultValue={category} className="h-11 min-w-44 bg-transparent px-3 text-xs font-black uppercase outline-none">
                <option value="all">All categories</option>
                {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="h-11 bg-[var(--slot4-dark-bg)] px-5 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-[var(--slot4-accent)]">Filter</button>
            </form>
          </div>

          {remaining.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {remaining.map((post, index) => <EditorialGridCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} index={index + 3} label={label} />)}
            </div>
          ) : !lead ? (
            <EmptyArchive />
          ) : (
            <p className="border border-dashed border-black/15 bg-[var(--slot4-cream)] p-8 text-center text-sm font-bold text-black/55">That&apos;s every release in this view for now.</p>
          )}

          <Pagination basePath={basePath} category={category} page={page} pagination={pagination} />
        </section>
      </main>
    </EditableSiteShell>
  )
}

function EditorialGridCard({ post, href, index, label }: { post: SitePost; href: string; index: number; label: string }) {
  return (
    <Link href={href} data-reveal className="card-lift group flex flex-col overflow-hidden border border-black/10 bg-white hover:border-[var(--slot4-accent)] hover:shadow-[0_24px_60px_rgba(33,15,55,0.12)]">
      <div className="zoom-frame relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={getImage(post)} alt="" className="h-full w-full object-cover" />
        <span className="absolute left-0 top-0 bg-[var(--slot4-dark-bg)] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white">{String(index + 1).padStart(2, '0')}</span>
        <span className="absolute right-3 top-3 bg-[var(--slot4-accent)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">{getCategory(post, label)}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="editorial-serif line-clamp-2 text-xl font-black leading-tight tracking-[-0.03em] transition group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
        
        <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-black/45 transition group-hover:text-[var(--slot4-accent)]">Read release <ArrowUpRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

function EmptyArchive() {
  return (
    <div className="border border-dashed border-black/20 bg-[var(--slot4-cream)] p-12 text-center">
      <Search className="mx-auto h-8 w-8 text-black/40" />
      <h2 className="editorial-brand mt-4 text-3xl tracking-[-0.03em]">No posts found</h2>
      <p className="mt-2 text-sm text-black/55">Try another category, or check back after new content is distributed.</p>
      <Link href="/" className="mt-6 inline-flex items-center gap-2 bg-[var(--slot4-dark-bg)] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-[var(--slot4-accent)]">Back to home <ArrowRight className="h-4 w-4" /></Link>
    </div>
  )
}

function Pagination({ basePath, category, page, pagination }: { basePath: string; category: string; page: number; pagination: SiteFeedPagination }) {
  return (
    <div className="mt-12 flex items-center justify-center">
      {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="border border-black/15 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.12em] transition hover:bg-[var(--slot4-dark-bg)] hover:text-white">Previous</Link> : null}
      <span className="border-y border-black/15 bg-[var(--slot4-accent)] px-6 py-3 text-xs font-black uppercase tracking-[0.12em] text-white">Page {page} / {pagination.totalPages || 1}</span>
      {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="border border-black/15 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.12em] transition hover:bg-[var(--slot4-dark-bg)] hover:text-white">Next</Link> : null}
    </div>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Newswire')
  return (
    <Link href={href} data-reveal className="card-lift group flex flex-col overflow-hidden border border-black/10 bg-white hover:border-[var(--slot4-accent)] hover:shadow-[0_24px_60px_rgba(17,17,17,0.10)]">
      <div className="zoom-frame relative aspect-[16/10] overflow-hidden bg-black/5">
        <img src={image} alt="" className="h-full w-full object-cover" />
        <span className="absolute left-4 top-4 bg-[var(--slot4-accent)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">{category}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Release {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-2 line-clamp-2 text-xl font-black leading-tight tracking-[-0.035em] transition group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
       
        <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em]">Read release <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} data-reveal className="card-lift group grid gap-5 border border-black/10 bg-white p-5 hover:border-[var(--slot4-accent)] hover:shadow-[0_24px_60px_rgba(17,17,17,0.10)] sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden bg-[var(--slot4-cream)] ring-1 ring-black/10">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 opacity-45" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="bg-[var(--slot4-dark-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 border border-black/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.04em] transition group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
 
        <div className="mt-4 grid gap-2 text-xs font-bold text-black/55 sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} data-reveal className="card-lift group overflow-hidden border border-black/10 bg-white hover:border-[var(--slot4-accent)] hover:shadow-[0_24px_60px_rgba(17,17,17,0.10)]">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative bg-[var(--slot4-dark-bg)] p-5 text-white">
          <span className="bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-black leading-[1] tracking-[-0.06em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-bold text-white/70">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt="" className="absolute bottom-4 right-4 h-20 w-20 object-cover opacity-80" /> : null}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.04em] transition group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
         
          <p className="mt-6 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} data-reveal className="card-lift group mb-6 block break-inside-avoid overflow-hidden border border-black/10 bg-white hover:border-[var(--slot4-accent)] hover:shadow-[0_24px_60px_rgba(17,17,17,0.10)]">
      <div className={`zoom-frame overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 bg-[var(--slot4-cream)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 text-xl font-black leading-tight tracking-[-0.035em] transition group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} data-reveal className="card-lift group block border border-black/10 bg-white p-6 transition hover:border-[var(--slot4-accent)] hover:bg-[var(--slot4-dark-bg)] hover:text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="border border-current/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      
      {website ? <p className="mt-5 truncate text-xs font-black uppercase tracking-[0.16em] opacity-60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} data-reveal className="card-lift group border border-black/10 bg-white p-6 hover:border-[var(--slot4-accent)] hover:shadow-[0_24px_60px_rgba(17,17,17,0.10)]">
      <div className="flex items-start justify-between gap-4">
        <div className="bg-[var(--slot4-dark-bg)] p-5 text-white"><FileText className="h-8 w-8" /></div>
        <span className="bg-[var(--slot4-cream)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">{category}</span>
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.04em] transition group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
      
      <p className="mt-6 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} data-reveal className="card-lift group border border-black/10 bg-white p-6 text-center hover:border-[var(--slot4-accent)] hover:shadow-[0_24px_60px_rgba(17,17,17,0.10)]">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-cream)] ring-1 ring-black/10">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 opacity-45" />}
      </div>
      <h2 className="mt-5 text-xl font-black leading-tight tracking-[-0.035em] transition group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
      {role ? <p className="mt-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{role}</p> : null}
     
    </Link>
  )
}
