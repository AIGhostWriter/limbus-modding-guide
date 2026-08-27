import type { ReactNode } from 'react'

export function GuideIntro({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return <div className="mb-9"><div className="text-[10px] uppercase tracking-[.18em] text-[var(--accent)] font-bold mb-3">{eyebrow}</div><div className="text-lg leading-8 text-[#45473f] max-w-3xl">{children}</div></div>
}

export function Callout({ title, tone = 'note', children }: { title: string; tone?: 'note' | 'warning' | 'success'; children: ReactNode }) {
  const styles = tone === 'warning' ? 'border-[#a5362d] bg-[#a5362d]/7' : tone === 'success' ? 'border-[#267489] bg-[#267489]/7' : 'border-[#a57b30] bg-[#a57b30]/8'
  return <aside className={`my-6 border-l-3 px-5 py-4 ${styles}`}><div className="text-xs font-bold uppercase tracking-[.12em] mb-2">{title}</div><div className="text-sm text-[#55574f] [&>p]:mb-0">{children}</div></aside>
}

export function Steps({ items }: { items: { title: string; body: ReactNode }[] }) {
  return <div className="my-7 border-t border-[var(--line)]">{items.map((item, i) => <div key={item.title} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5 border-b border-[var(--line)]"><div className="font-serif text-xl text-[var(--accent)]">{String(i + 1).padStart(2, '0')}</div><div><div className="font-bold mb-1">{item.title}</div><div className="text-sm text-[#5d5f57]">{item.body}</div></div></div>)}</div>
}

export function SourceNote({ href, label }: { href: string; label: string }) {
  return <div className="mt-10 pt-4 border-t border-dashed border-[var(--line)] text-xs text-[var(--muted)]">원문 확인: <a href={href} target="_blank" rel="noreferrer">{label} ↗</a></div>
}
