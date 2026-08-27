import { useEffect, useMemo, useState } from 'react'
import { HashRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { docs, navGroups } from './data/docs'
import type { DocPage } from './data/docs'
import { functions } from './data/functions'
import { extendedFunctions } from './data/extendedFunctions'
import { functionDescriptions } from './data/functionDescriptions'
import MarkdownDocument from './components/MarkdownDocument'

function Brand() {
  return <Link to="/" className="brand"><span className="brand-mark">L</span><span><b>LETHE LAB</b><small>MODDING DOCUMENTATION</small></span></Link>
}

function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return <div className="app-shell">
    <header className="topbar"><Brand /><nav><a href="https://aighostwriter.github.io/Lethe_Guide/" target="_blank" rel="noreferrer">Official Guide</a><a href="https://github.com/LEAGUE-OF-NINE" target="_blank" rel="noreferrer">GitHub</a></nav><button onClick={() => setOpen(true)}>Menu</button></header>
    <Sidebar open={open} close={() => setOpen(false)} />
    {open && <button className="scrim" onClick={() => setOpen(false)} aria-label="Close navigation" />}
    <main className="main">{children}</main>
  </div>
}

function Sidebar({ open, close }: { open: boolean; close: () => void }) {
  const [query, setQuery] = useState('')
  const groups = useMemo(() => navGroups.map(g => ({ ...g, items: g.items.filter(i => i[0].toLowerCase().includes(query.toLowerCase())) })).filter(g => g.items.length), [query])
  return <aside className={`sidebar ${open ? 'open' : ''}`}>
    <div className="sidebar-head"><Brand /><button onClick={close}>×</button></div>
    <label className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search documentation" /></label>
    <nav className="side-nav">{groups.map(group => <section key={group.label}><h4>{group.label}</h4>{group.items.map(([label,path]) => <NavLink key={path} to={path} onClick={close} className={({isActive}) => isActive ? 'active' : ''}>{label}<span>›</span></NavLink>)}</section>)}</nav>
    <div className="sidebar-foot"><span className="status-dot" /> Documentation snapshot <b>24.102.4</b></div>
  </aside>
}

function Home() {
  const cards = [
    ['01','Script Reference','Searchable signatures for every recorded timing, acquirer, and consequence.','/docs/reference/functions'],
    ['02','GlitchScript','GlitchScript-only syntax, execution rules, VALUE registers, conditions, loops, targeting, and callable entries.','/docs/reference/glitch'],
    ['03','MT Custom Scripts','MT-only timings, functions, MTData, Dynamic Locale, Global Lua Data, and version-sensitive extensions.','/docs/reference/mt'],
    ['04','Lethe Guide','The original five-part English guide preserved as complete documents without summarized replacement text.','/docs/original/chapter-1'],
    ['05','DLL','Reserved for a clean rebuild of native plugin documentation from original project data.','/docs/dll'],
  ]
  return <div className="home">
    <section className="hero">
      <div className="hero-grid" /><div className="hero-glow" />
      <div className="hero-inner">
        <h1><span>Lethe</span><br />Guide</h1>
        <p>Five focused libraries for script references, GlitchScript, MT extensions, preserved Lethe guides, and future DLL documentation.</p>
        <div className="hero-actions"><Link className="button primary" to="/docs/reference/functions">Open Script Reference <span>→</span></Link><a className="button secondary" href="https://github.com/LEAGUE-OF-NINE" target="_blank" rel="noreferrer">GitHub</a></div>
      </div>
    </section>
    <section className="home-section component-index">
      <div className="section-title"><span>DOCUMENTATION LIBRARIES</span><h2>Choose a component</h2><p>Each library has one responsibility. Original source documents remain intact where source preservation is required.</p></div>
      <div className="hub-grid">{cards.map(([n,title,desc,to]) => <Link to={to} className="hub-card" key={n}><span>{n}</span><div><h3>{title}</h3><p>{desc}</p></div><b>↗</b></Link>)}</div>
    </section>
    <section className="home-section references">
      <div className="section-title"><span>PRIMARY REFERENCES</span><h2>Source libraries behind the encyclopedia</h2><p>Open the original reference when you need to compare wording, version history, or upstream changes.</p></div>
      <div className="reference-grid">
        <a href="https://rentry.co/glitchscript" target="_blank" rel="noreferrer"><i>GS</i><b>GlitchScript</b><span>Syntax, timings, targets and functions</span></a>
        <a href="https://rentry.co/mtcustomscripts" target="_blank" rel="noreferrer"><i>MT</i><b>MT Custom Scripts</b><span>Extended timings, state and runtime control</span></a>
        <a href="https://rentry.co/modularexamples" target="_blank" rel="noreferrer"><i>EX</i><b>Modular Examples</b><span>Basic through advanced compositions</span></a>
        <a href="https://github.com/LEAGUE-OF-NINE" target="_blank" rel="noreferrer"><i>GH</i><b>LEAGUE OF NINE</b><span>Loaders, plugins, schemas and source</span></a>
        <a href="https://lethelc.site/dashboard" target="_blank" rel="noreferrer"><i>LC</i><b>Lethe Dashboard</b><span>Official ecosystem entry point</span></a>
      </div>
    </section>
    <Footer />
  </div>
}

function CodeBlock({ code, language = 'text' }: { code: string; language?: string }) {
  const [copied,setCopied] = useState(false)
  const copy = async () => { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  return <div className="doc-code"><div><span>{language}</span><button onClick={copy}>{copied ? 'Copied' : 'Copy'}</button></div><pre><code>{code}</code></pre></div>
}

function Article({ page }: { page: DocPage }) {
  const location = useLocation()
  const all = navGroups.flatMap(g => g.items)
  const index = all.findIndex(i => i[1] === location.pathname)
  const prev = index > 0 ? all[index - 1] : null
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : null
  return <div className="article-wrap">
    <article className="article">
      <div className="breadcrumbs"><Link to="/">Docs</Link><span>/</span><span>{page.kicker}</span></div>
      <div className="article-head"><span>{page.kicker}</span><h1>{page.title}</h1><p>{page.summary}</p></div>
      <div className="on-page"><b>ON THIS PAGE</b>{page.sections.map(s => { const id=s.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); return <Link key={s.title} to={`${location.pathname}#${id}`}>{s.title}</Link> })}</div>
      {page.sections.map((section,i) => { const id=section.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); return <section className="doc-section" id={id} key={section.title}><h2><span>{String(i+1).padStart(2,'0')}</span>{section.title}</h2><p>{section.body}</p>{section.note && <aside><b>Important</b><p>{section.note}</p></aside>}{section.code && <CodeBlock code={section.code} language={section.language} />}</section> })}
      <nav className="pager">{prev ? <Link to={prev[1]}><small>PREVIOUS</small><b>← {prev[0]}</b></Link> : <span />}{next ? <Link to={next[1]} className="next"><small>NEXT</small><b>{next[0]} →</b></Link> : <span />}</nav>
    </article>
    <Footer />
  </div>
}

function DocsRoute() {
  const location = useLocation()
  const originals: Record<string, [string, () => Promise<string>]> = {
    '/docs/original/chapter-1': ['Chapter 1', () => import('./content/lethe-guide/chapter1.md?raw').then(m=>m.default)],
    '/docs/original/chapter-2': ['Chapter 2', () => import('./content/lethe-guide/chapter2.md?raw').then(m=>m.default)],
    '/docs/original/chapter-3': ['Chapter 3', () => import('./content/lethe-guide/chapter3.md?raw').then(m=>m.default)],
    '/docs/original/chapter-4': ['Chapter 4', () => import('./content/lethe-guide/chapter4.md?raw').then(m=>m.default)],
    '/docs/original/identity': ['Custom Identity Guide', () => import('./content/lethe-guide/identity.md?raw').then(m=>m.default)],
  }
  if (originals[location.pathname]) return <AsyncMarkdownDocument label={originals[location.pathname][0]} loader={originals[location.pathname][1]} />
  if (location.pathname === '/docs/reference/glitch') return <FunctionCatalog key="glitch" lockedSource="glitch" title="GlitchScript catalog" />
  if (location.pathname === '/docs/reference/mt') return <FunctionCatalog key="mt" lockedSource="mt" title="MT Custom Scripts catalog" />
  if (location.pathname === '/docs/reference/functions') return <FunctionCatalog key="all" title="Complete function catalog" />
  const page = docs[location.pathname] ?? docs['/docs/overview']
  return <Article page={page} />
}

function AsyncMarkdownDocument({ label, loader, collection }: { label:string; loader:()=>Promise<string>; collection?:string }) {
  const [source,setSource] = useState('')
  useEffect(() => { let active=true; loader().then(value=>{if(active)setSource(value)}); return()=>{active=false} }, [loader])
  return source ? <MarkdownDocument label={label} source={source} collection={collection} /> : <div className="article-wrap"><article className="article"><p>Loading document…</p></article></div>
}

function FunctionCatalog({ lockedSource, title }: { lockedSource?: 'glitch'|'mt'; title:string }) {
  const allFunctions = [...functions, ...extendedFunctions]
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [selectedSource, setSelectedSource] = useState('all')
  const source = lockedSource ?? selectedSource
  const [openKey, setOpenKey] = useState<string | null>(null)
  const visible = allFunctions.filter(item =>
    (category === 'all' || item.category === category) &&
    (source === 'all' || item.source === source) &&
    `${item.name} ${item.signature}`.toLowerCase().includes(query.toLowerCase())
  )
  const explain = (item: typeof functions[number]) => functionDescriptions[item.name] || (item.category === 'timing'
    ? `Registers a script at the ${item.name} lifecycle event. Attach it only to an owner that supports this event.`
    : item.category === 'acquirer'
      ? `Reads ${item.name} data and returns a value that can be stored in VALUE_0–VALUE_9 or consumed by a condition.`
      : `Changes battle state through ${item.name}. Check target cardinality and argument order before combining it with conditions.`)
  const cleanExample = (value?: string) => value?.split('\n').filter(line => !/[가-힣]/.test(line)).join('\n').trim()
  return <div className="article-wrap"><article className="article catalog-page">
    <div className="breadcrumbs"><Link to="/">Docs</Link><span>/</span><span>REFERENCE</span></div>
    <div className="article-head"><span>{lockedSource === 'mt' ? 'MT REFERENCE' : lockedSource === 'glitch' ? 'GLITCHSCRIPT REFERENCE' : 'COMPLETE REFERENCE'}</span><h1>{title}</h1><p>{visible.length} timings, acquirers, and consequences in this collection. Each entry preserves its callable signature, source, parameters, example, and version label.</p></div>
    <div className={`catalog-tools ${lockedSource ? 'locked' : ''}`}><input aria-label="Search functions" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by function or signature…" /><select aria-label="Filter category" value={category} onChange={e => setCategory(e.target.value)}><option value="all">All categories</option><option value="timing">Timings</option><option value="acquirer">Acquirers</option><option value="consequence">Consequences</option></select>{!lockedSource && <select aria-label="Filter source" value={source} onChange={e => setSelectedSource(e.target.value)}><option value="all">All sources</option><option value="glitch">GlitchScript</option><option value="mt">MT Scripts</option></select>}</div>
    <div className="catalog-summary"><b>{visible.length}</b> entries shown <span>•</span> Open an entry to inspect its contract.</div>
    <div className="function-list">{visible.map((item, index) => {
      const key = `${item.category}-${item.name}-${index}`
      return <details className="function-entry" key={key} open={openKey === key} onToggle={event => setOpenKey(event.currentTarget.open ? key : openKey === key ? null : openKey)}>
        <summary><span className={`kind ${item.category}`}>{item.category}</span><code>{item.name}</code><small>{item.source === 'both' ? 'Shared' : item.source === 'mt' ? 'MT Scripts' : 'GlitchScript'}</small><b>＋</b></summary>
        <div className="function-body"><p>{explain(item)}</p><h3>Signature</h3><CodeBlock code={item.signature} language="modular" />{item.params?.length ? <><h3>Parameters</h3><div className="param-table">{item.params.map(param => <div key={param.name}><code>{param.name}</code><span>Argument accepted by this function. Match its value type and position to the signature.</span></div>)}</div></> : <p className="no-params">No separately documented parameters.</p>}{cleanExample(item.example) && <><h3>Example</h3><CodeBlock code={cleanExample(item.example)!} language="modular" /></>}<div className="contract-note"><b>Verification</b><span>Test this entry alone at a confirmed timing and inspect LogOutput.log before composing it with other functions.</span>{item.version && <em>Version {item.version}</em>}</div></div>
      </details>
    })}</div>
  </article><Footer /></div>
}

function Footer() { return <footer className="footer"><div><Brand /><p>Unofficial, community-authored documentation for the Lethe modding ecosystem.</p></div><div><b>RESOURCES</b><a href="https://aighostwriter.github.io/Lethe_Guide/" target="_blank" rel="noreferrer">Official Lethe Guide</a><a href="https://github.com/LEAGUE-OF-NINE" target="_blank" rel="noreferrer">LEAGUE OF NINE</a></div></footer> }

export default function App() {
  return <HashRouter><Shell><Routes><Route path="/" element={<Home />} /><Route path="/docs/*" element={<DocsRoute />} /><Route path="*" element={<Home />} /></Routes></Shell></HashRouter>
}
