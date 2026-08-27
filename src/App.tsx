import { useMemo, useState } from 'react'
import { HashRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { docs, navGroups } from './data/docs'
import type { DocPage } from './data/docs'
import { functions } from './data/functions'
import { extendedFunctions } from './data/extendedFunctions'
import { functionDescriptions } from './data/functionDescriptions'
import MarkdownDocument from './components/MarkdownDocument'
import chapter1 from './content/lethe-guide/chapter1.md?raw'
import chapter2 from './content/lethe-guide/chapter2.md?raw'
import chapter3 from './content/lethe-guide/chapter3.md?raw'
import chapter4 from './content/lethe-guide/chapter4.md?raw'
import identityGuide from './content/lethe-guide/identity.md?raw'

function Brand() {
  return <Link to="/" className="brand"><span className="brand-mark">L</span><span><b>LETHE LAB</b><small>MODDING DOCUMENTATION</small></span></Link>
}

function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return <div className="app-shell">
    <header className="topbar"><Brand /><nav><a href="https://aighostwriter.github.io/Lethe_Guide/" target="_blank" rel="noreferrer">Official Guide</a><a href="https://github.com/AIGhostWriter/limbus-modding-guide" target="_blank" rel="noreferrer">GitHub</a></nav><button onClick={() => setOpen(true)}>Menu</button></header>
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
    ['01','GlitchScript','Learn timings, VALUE registers, conditions, selectors, and consequences.','/docs/glitch/structure'],
    ['02','MT Extensions','Add persistent state, dynamic locale, advanced targets, and runtime control.','/docs/mt/overview'],
    ['03','Lethe Content','Build identities, bosses, encounter stages, patterns, and custom buffs.','/docs/content/encounter'],
    ['04','DLL Hub','Explore native battle, cinematic, map, story, and Mirror Dungeon extensions.','/docs/dll'],
  ]
  return <div className="home">
    <section className="hero">
      <div className="hero-grid" /><div className="hero-glow" />
      <div className="hero-inner">
        <h1><span>Lethe</span><br />Guide</h1>
        <p>A complete, searchable encyclopedia for Limbus Company data authoring, Modular scripting, encounters, assets, and native plugins.</p>
        <div className="hero-actions"><Link className="button primary" to="/docs/overview">Start reading <span>→</span></Link><a className="button secondary" href="https://github.com/AIGhostWriter/limbus-modding-guide" target="_blank" rel="noreferrer">View on GitHub</a></div>
        <div className="quick-code"><div className="code-top"><span><i /><i /><i /></span><b>skill abilityScriptList</b><em>MODULAR</em></div><pre><code><span className="c-dim">Modular/</span><span className="c-purple">TIMING</span>:<span className="c-blue">WhenUse</span><br /><span className="c-dim">/</span><span className="c-green">VALUE_0</span>:getsp(<span className="c-orange">Self</span>)<br /><span className="c-dim">/</span>CONTINUEIF(<span className="c-green">VALUE_0</span>&gt;29)<br /><span className="c-dim">/</span>buff(<span className="c-orange">Self</span>,Haste,2,0,1)</code></pre></div>
        <div className="hero-stats"><div><b>150+</b><span>reference entries</span></div><div><b>35+</b><span>focused chapters</span></div><div><b>5</b><span>authoring layers</span></div></div>
      </div>
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
    <section className="home-section">
      <div className="section-title"><span>LEARNING PATH</span><h2>From one script to a complete encounter</h2><p>Each chapter gives you the concept, a complete example, the connection points, and a verification step.</p></div>
      <div className="path-grid">{cards.map(([n,title,desc,to]) => <Link to={to} className="path-card" key={n}><div className="path-top"><b>{n}</b><span>GUIDE</span></div><h3>{title}</h3><p>{desc}</p><footer>Open chapter <span>→</span></footer></Link>)}</div>
    </section>
    <div className="divider" />
    <section className="home-section split">
      <div><span className="eyebrow">HOW THIS GUIDE WORKS</span><h2>Documentation that follows the actual data graph.</h2><p>Official Lethe-style chapters explain the complete record chain. Code-first examples show where each script belongs and what to check when it fails.</p><ul className="check-list"><li>Complete JSON and Modular examples</li><li>Field-level explanations and ID contracts</li><li>Version and timing restrictions</li><li>Minimal probes for reliable debugging</li></ul></div>
      <div className="stack-card"><div><span>01</span><b>Load</b><small>Did Lethe read the file?</small></div><div><span>02</span><b>Connect</b><small>Do all referenced IDs resolve?</small></div><div><span>03</span><b>Trigger</b><small>Does the timing fire for this owner?</small></div><div><span>04</span><b>Execute</b><small>Does the consequence accept this target?</small></div></div>
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
  const originals: Record<string, [string, string]> = {
    '/docs/original/chapter-1': ['Chapter 1', chapter1], '/docs/original/chapter-2': ['Chapter 2', chapter2],
    '/docs/original/chapter-3': ['Chapter 3', chapter3], '/docs/original/chapter-4': ['Chapter 4', chapter4],
    '/docs/original/identity': ['Custom Identity Guide', identityGuide],
  }
  if (originals[location.pathname]) return <MarkdownDocument label={originals[location.pathname][0]} source={originals[location.pathname][1]} />
  if (location.pathname === '/docs/reference/functions') return <FunctionCatalog />
  const page = docs[location.pathname] ?? docs['/docs/overview']
  return <Article page={page} />
}

function FunctionCatalog() {
  const allFunctions = [...functions, ...extendedFunctions]
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [source, setSource] = useState('all')
  const visible = allFunctions.filter(item =>
    (category === 'all' || item.category === category) &&
    (source === 'all' || item.source === source || item.source === 'both') &&
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
    <div className="article-head"><span>COMPLETE REFERENCE</span><h1>Script function catalog</h1><p>{allFunctions.length} timings, acquirers, and consequences from the GlitchScript and MT Custom Scripts snapshots. Each entry preserves its callable signature, source, parameters, example, and version label.</p></div>
    <div className="catalog-tools"><input aria-label="Search functions" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by function or signature…" /><select aria-label="Filter category" value={category} onChange={e => setCategory(e.target.value)}><option value="all">All categories</option><option value="timing">Timings</option><option value="acquirer">Acquirers</option><option value="consequence">Consequences</option></select><select aria-label="Filter source" value={source} onChange={e => setSource(e.target.value)}><option value="all">All sources</option><option value="glitch">GlitchScript</option><option value="mt">MT Scripts</option></select></div>
    <div className="catalog-summary"><b>{visible.length}</b> entries shown <span>•</span> Open an entry to inspect its contract.</div>
    <div className="function-list">{visible.map((item, index) => <details className="function-entry" key={`${item.category}-${item.name}-${index}`}><summary><span className={`kind ${item.category}`}>{item.category}</span><code>{item.name}</code><small>{item.source === 'both' ? 'GlitchScript + MT' : item.source === 'mt' ? 'MT Scripts' : 'GlitchScript'}</small><b>＋</b></summary><div className="function-body"><p>{explain(item)}</p><h3>Signature</h3><CodeBlock code={item.signature} language="modular" />{item.params?.length ? <><h3>Parameters</h3><div className="param-table">{item.params.map(param => <div key={param.name}><code>{param.name}</code><span>Argument accepted by this function. Match its value type and position to the signature.</span></div>)}</div></> : <p className="no-params">No separately documented parameters.</p>}{cleanExample(item.example) && <><h3>Example</h3><CodeBlock code={cleanExample(item.example)!} language="modular" /></>}<div className="contract-note"><b>Verification</b><span>Test this entry alone at a confirmed timing and inspect LogOutput.log before composing it with other functions.</span>{item.version && <em>Version {item.version}</em>}</div></div></details>)}</div>
  </article><Footer /></div>
}

function Footer() { return <footer className="footer"><div><Brand /><p>Unofficial, community-authored documentation for the Lethe modding ecosystem.</p></div><div><b>RESOURCES</b><a href="https://aighostwriter.github.io/Lethe_Guide/" target="_blank" rel="noreferrer">Official Lethe Guide</a><a href="https://github.com/LEAGUE-OF-NINE" target="_blank" rel="noreferrer">LEAGUE OF NINE</a></div></footer> }

export default function App() {
  return <HashRouter><Shell><Routes><Route path="/" element={<Home />} /><Route path="/docs/*" element={<DocsRoute />} /><Route path="*" element={<Home />} /></Routes></Shell></HashRouter>
}
