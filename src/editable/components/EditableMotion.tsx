'use client'

import { useEffect, useRef } from 'react'

/**
 * Site-wide motion layer (no external deps):
 *  - Scroll reveal: any element with `data-reveal` fades/slides in once it enters
 *    the viewport (staggered via inline `--reveal-delay`).
 *  - Reading progress bar pinned to the top of the page.
 *
 * Elements added AFTER mount (e.g. client components that swap their tree once a
 * localStorage session loads — the Create page) are picked up via a MutationObserver,
 * so freshly-rendered `data-reveal` content never stays stuck at opacity:0.
 *
 * Mounted once inside EditableSiteShell so it runs on every page.
 */
export function EditableMotion() {
  const barRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const supportsIO = !reduce && 'IntersectionObserver' in window

    // --- Scroll reveal -------------------------------------------------------
    const io = supportsIO
      ? new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('reveal-in')
                obs.unobserve(entry.target)
              }
            })
          },
          { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
        )
      : null

    const handle = (el: Element) => {
      if (el.classList.contains('reveal-in')) return
      if (io) io.observe(el)
      else el.classList.add('reveal-in')
    }

    const scan = (root: ParentNode) => root.querySelectorAll<HTMLElement>('[data-reveal]').forEach(handle)
    scan(document)

    // Catch elements rendered after mount (client re-renders / route content).
    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return
          if (node.matches('[data-reveal]')) handle(node)
          scan(node)
        })
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    // Safety net: if anything is still hidden shortly after load (e.g. an element
    // that never intersects), force it visible so content is never permanently blank.
    const safety = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>('[data-reveal]:not(.reveal-in)').forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('reveal-in')
      })
    }, 1200)

    // --- Reading progress bar -----------------------------------------------
    let frame = 0
    const updateProgress = () => {
      frame = 0
      const bar = barRef.current
      if (!bar) return
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
      bar.style.width = `${ratio * 100}%`
    }
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateProgress)
    }
    updateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      io?.disconnect()
      mo.disconnect()
      window.clearTimeout(safety)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={barRef} className="reading-progress" aria-hidden="true" />
}
