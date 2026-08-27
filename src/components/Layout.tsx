import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { navigation } from '../data/navigation'
import type { NavItem } from '../data/navigation'

function crumbsFor(path: string, items: NavItem[], acc: string[] = []): string[] | null {
  for (const item of items) {
    if (item.path === path) return [...acc, item.label]
    if (item.children) {
      const found = crumbsFor(path, item.children, [...acc, item.label])
      if (found) return found
    }
  }
  return null
}

export default function Layout() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const crumbs = crumbsFor(location.pathname, navigation) ?? []
  return (
    <div className="paper-noise min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <header className="md:hidden sticky top-0 z-30 h-15 px-5 flex items-center justify-between bg-[#191b18]/95 text-white border-b border-white/10 backdrop-blur">
        <Link to="/" className="font-bold tracking-[.16em] text-sm">LIMBUS / LAB</Link>
        <button onClick={() => setMenuOpen(true)} className="px-3 py-1.5 border border-white/20 text-xs uppercase tracking-widest" aria-label="메뉴 열기">Menu</button>
      </header>
      <main className="md:ml-[18rem] min-h-screen">
        <div className="max-w-[1060px] mx-auto px-5 sm:px-10 lg:px-16 py-9 md:py-14">
          {crumbs.length > 0 && <div className="flex flex-wrap items-center gap-2 mb-9 text-[11px] uppercase tracking-[.13em] text-[var(--muted)]">
            <span className="text-[var(--accent)] font-bold">Field manual</span>
            {crumbs.map((crumb, i) => <span key={`${crumb}-${i}`} className="flex items-center gap-2"><span className="opacity-35">—</span>{crumb}</span>)}
          </div>}
          <article className="prose"><Outlet /></article>
          <footer className="mt-20 pt-7 border-t border-[var(--line)] flex flex-wrap gap-3 justify-between text-[11px] uppercase tracking-[.12em] text-[var(--muted)]">
            <span>Community modding field manual</span><span>GlitchScript · MT Custom Scripts · DLL</span>
          </footer>
        </div>
      </main>
    </div>
  )
}
