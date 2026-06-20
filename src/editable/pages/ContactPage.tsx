'use client'

import { FileText, Mail, Megaphone } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const deskIcons = [FileText, Megaphone, Mail]

export default function ContactPage() {
  const contact = pagesContent.contact
  return (
    <EditableSiteShell>
      <main className="bg-white text-[var(--slot4-page-text)]">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-black/10 bg-[var(--slot4-dark-bg)] text-white">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_5%_-10%,rgba(220,160,109,.22),transparent_55%)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <p className="hero-rise text-[11px] font-black uppercase tracking-[0.3em] text-[var(--slot4-accent)]">{contact.eyebrow}</p>
            <h1 className="hero-rise editorial-brand mt-4 max-w-4xl text-5xl leading-[0.92] tracking-[-0.04em] sm:text-7xl">{contact.title}</h1>
            <p className="hero-rise mt-6 max-w-2xl border-l-4 border-[var(--slot4-accent)] pl-5 text-base font-semibold leading-8 text-white/60">{contact.description}</p>
            <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/55">
              {contact.details.map((detail) => (
                <span key={detail.label} className="inline-flex items-center gap-2">
                  <span className="text-[var(--slot4-accent-2)]">{detail.label}</span> {detail.value}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Desks + form */}
        <section className="mx-auto grid max-w-[var(--editable-container)] border-x border-black/10 lg:grid-cols-[0.78fr_1.22fr]">
          <aside className="border-b border-black/10 bg-[var(--slot4-dark-bg)] text-white lg:border-b-0 lg:border-r" data-reveal="left">
            {contact.desks.map((desk, index) => {
              const Icon = deskIcons[index % deskIcons.length]
              return (
                <div key={desk.title} className="border-b border-white/12 p-7 last:border-b-0 sm:p-9">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center bg-[var(--slot4-accent)]/15 text-[var(--slot4-accent)]"><Icon className="h-5 w-5" /></span>
                    <span className="text-xs font-black text-white/35">0{index + 1}</span>
                  </div>
                  <h2 className="editorial-serif mt-6 text-2xl font-black">{desk.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/55">{desk.body}</p>
                </div>
              )
            })}
          </aside>
          <div className="p-6 sm:p-10 lg:p-14" data-reveal="right">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Send a message</p>
            <h2 className="editorial-serif mt-3 text-4xl font-black tracking-[-0.03em]">{contact.formTitle}</h2>
            <EditableContactLeadForm />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
