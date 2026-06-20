'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  mediaDistribution: Send,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: ArrowRight,
}

const fieldClass = 'border border-black/15 bg-white px-4 py-3.5 text-sm font-bold text-[var(--slot4-page-text)] outline-none transition placeholder:text-black/35 focus:border-[var(--slot4-accent)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-white px-4 py-16 text-[var(--slot4-page-text)] sm:px-6 lg:px-8">
          <section className="mx-auto grid max-w-5xl gap-px border border-black/10 bg-black/10 md:grid-cols-[0.9fr_1.1fr]" data-reveal>
            <div className="relative flex h-full min-h-72 items-center justify-center overflow-hidden bg-[var(--slot4-dark-bg)] text-white">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,rgba(220,160,109,.3),transparent_55%)]" />
              <Lock className="relative h-20 w-20 opacity-80" />
            </div>
            <div className="self-center bg-white p-8 sm:p-12">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.create.locked.badge}</p>
              <h1 className="editorial-brand mt-5 text-4xl leading-[0.94] tracking-[-0.04em] sm:text-6xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-black/55">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 bg-[var(--slot4-dark-bg)] px-6 py-3.5 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-[var(--slot4-accent)]">Log in <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/signup" className="inline-flex items-center gap-2 border border-black/15 bg-white px-6 py-3.5 text-xs font-black uppercase tracking-[0.14em] transition hover:bg-[var(--slot4-dark-bg)] hover:text-white">Sign up</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-px border border-black/10 bg-black/10 lg:grid-cols-[0.85fr_1.15fr]">
            <aside className="bg-[var(--slot4-dark-bg)] p-7 text-white lg:p-10" data-reveal="left">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.create.hero.badge}</p>
              <h1 className="editorial-brand mt-5 text-4xl leading-[0.94] tracking-[-0.04em] sm:text-5xl">{pagesContent.create.hero.title}</h1>
              <p className="mt-6 max-w-xl text-sm font-semibold leading-7 text-white/55">{pagesContent.create.hero.description}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {enabledTasks.map((item) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  return (
                    <button key={item.key} type="button" onClick={() => setTask(item.key)} className={`border p-4 text-left transition ${active ? 'border-[var(--slot4-accent)] bg-[var(--slot4-accent)] text-white' : 'border-white/15 bg-white/[0.03] text-white hover:border-white/40'}`}>
                      <Icon className="h-5 w-5" />
                      <span className="mt-3 block text-sm font-black">{item.label}</span>
                      <span className="mt-1 block text-xs font-semibold opacity-65">{item.description}</span>
                    </button>
                  )
                })}
              </div>
            </aside>

            <form onSubmit={submit} className="bg-white p-6 sm:p-9" data-reveal="right">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Create {activeTask?.label || 'post'}</p>
                  <h2 className="editorial-serif mt-1 text-3xl font-black tracking-[-0.04em]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="border border-black/15 px-4 py-2 text-xs font-black uppercase tracking-[0.16em]">{session.name}</span>
              </div>

              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Release title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
              </div>

              {created ? (
                <div className="mt-5 flex items-start gap-3 border border-emerald-300 bg-emerald-50 p-4 text-emerald-900">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-black">{pagesContent.create.successTitle}</p>
                    <p className="mt-1 text-sm font-semibold opacity-80">{created.title}</p>
                  </div>
                </div>
              ) : null}

              <button type="submit" className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 bg-[var(--slot4-dark-bg)] px-6 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-[var(--slot4-accent)]">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
