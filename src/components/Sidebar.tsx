import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { navigation } from '../data/navigation'
import type { NavItem } from '../data/navigation'

function NavSection({ item, depth = 0, onNavigate }: { item: NavItem; depth?: number; onNavigate: () => void }) {
  const location = useLocation()
  const active = (node: NavItem): boolean => !!(node.path && location.pathname.startsWith(node.path)) || !!node.children?.some(active)
  const [open, setOpen] = useState(() => active(item))
  const isCurrent = item.path === location.pathname
  if (item.path && !item.children) return <NavLink to={item.path} onClick={onNavigate} className={({ isActive }) => `group flex items-center gap-3 py-1.5 pr-4 text-[13px] transition ${depth > 1 ? 'pl-10' : 'pl-6'} ${isActive ? 'text-[#e7c878]' : 'text-white/54 hover:text-white'}`}>
    <span className={`h-px transition-all ${isCurrent ? 'w-4 bg-[#e7c878]' : 'w-0 bg-white/40 group-hover:w-2'}`} /><span>{item.label}</span>
  </NavLink>
  return <div className={depth === 0 ? 'mt-5 first:mt-0' : ''}>
    <button onClick={() => setOpen(v => !v)} className={`w-full flex items-center justify-between py-1.5 pr-5 text-left ${depth === 0 ? 'pl-6 text-[11px] uppercase tracking-[.16em] font-bold text-white/36' : 'pl-6 text-[13px] font-semibold text-white/78'}`}>
      <span>{item.label}</span><span className={`text-[10px] transition-transform ${open ? 'rotate-45' : ''}`}>＋</span>
    </button>
    {open && item.children && <div className="mt-1">{item.children.map(child => <NavSection key={child.label} item={child} depth={depth + 1} onNavigate={onNavigate} />)}</div>}
  </div>
}

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <>
    {open && <button className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={onClose} aria-label="메뉴 닫기" />}
    <aside className={`fixed inset-y-0 left-0 w-[18rem] z-40 flex flex-col bg-[var(--sidebar)] text-white border-r border-black/20 transition-transform md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="px-6 pt-8 pb-7 border-b border-white/10"><NavLink to="/" onClick={onClose} className="block">
        <div className="flex items-center gap-3"><span className="grid place-items-center w-9 h-9 border border-[#e7c878]/55 text-[#e7c878] font-serif text-lg">L</span><div><div className="font-black tracking-[.14em] text-sm">LIMBUS / LAB</div><div className="mt-1 text-[10px] uppercase tracking-[.18em] text-white/35">Modding field manual</div></div></div>
      </NavLink></div>
      <nav className="flex-1 overflow-y-auto py-6">{navigation.map(item => <NavSection key={item.label} item={item} onNavigate={onClose} />)}</nav>
      <div className="p-6 border-t border-white/10"><div className="text-[10px] uppercase tracking-[.16em] text-white/30">Systems</div><div className="mt-2 flex gap-2 text-[11px]"><span className="px-2 py-1 bg-[#6e4f93]/20 text-[#c0a8dd]">Glitch</span><span className="px-2 py-1 bg-[#267489]/20 text-[#8fc9d5]">MT</span></div></div>
    </aside>
  </>
}
