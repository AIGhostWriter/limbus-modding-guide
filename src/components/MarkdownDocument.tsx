import { Fragment } from 'react'

type Props = { source: string; label: string }

const inline = (value: string) => {
  const parts = value.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, index) => {
    if (part.startsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>
    if (part.startsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>
    return <Fragment key={index}>{part}</Fragment>
  })
}

export default function MarkdownDocument({ source, label }: Props) {
  const lines = source.replace(/\r/g, '').split('\n')
  const nodes: React.ReactNode[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || 'text'; const code: string[] = []; i++
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++])
      nodes.push(<div className="md-code" key={`code-${i}`}><div>{language}</div><pre><code>{code.join('\n')}</code></pre></div>); i++; continue
    }
    if (line.trim().startsWith('|')) {
      const rows: string[][] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim())
        if (!cells.every(cell => /^:?-{3,}:?$/.test(cell))) rows.push(cells)
        i++
      }
      if (rows.length) nodes.push(<div className="md-table-wrap" key={`table-${i}`}><table><thead><tr>{rows[0].map((cell,j)=><th key={j}>{inline(cell)}</th>)}</tr></thead><tbody>{rows.slice(1).map((row,r)=><tr key={r}>{row.map((cell,c)=><td key={c}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>)
      continue
    }
    const heading = line.match(/^(#{1,4})\s+(.+)$/)
    if (heading) { const level = heading[1].length; const text = heading[2].replace(/`/g, ''); const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-'); nodes.push(level === 1 ? <h1 id={id} key={i}>{inline(heading[2])}</h1> : level === 2 ? <h2 id={id} key={i}>{inline(heading[2])}</h2> : <h3 id={id} key={i}>{inline(heading[2])}</h3>); i++; continue }
    if (/^[-*]\s+/.test(line)) { const items: string[] = []; while (i < lines.length && /^[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^[-*]\s+/, '')); nodes.push(<ul key={`list-${i}`}>{items.map((item,j)=><li key={j}>{inline(item)}</li>)}</ul>); continue }
    if (/^\d+\.\s+/.test(line)) { const items: string[] = []; while (i < lines.length && /^\d+\.\s+/.test(lines[i])) items.push(lines[i++].replace(/^\d+\.\s+/, '')); nodes.push(<ol key={`ol-${i}`}>{items.map((item,j)=><li key={j}>{inline(item)}</li>)}</ol>); continue }
    if (line.startsWith('>')) { nodes.push(<blockquote key={i}>{inline(line.replace(/^>\s?/, ''))}</blockquote>); i++; continue }
    if (/^---+$/.test(line.trim())) { nodes.push(<hr key={i}/>); i++; continue }
    if (line.trim()) { const paragraph=[line]; i++; while(i<lines.length && lines[i].trim() && !/^(#{1,4})\s|^```|^[-*]\s+|^\d+\.\s+|^>/.test(lines[i])) paragraph.push(lines[i++]); nodes.push(<p key={`p-${i}`}>{inline(paragraph.join(' '))}</p>); continue }
    i++
  }
  return <div className="article-wrap"><article className="article legacy-doc"><div className="breadcrumbs"><span>Original Lethe Guide</span><span>/</span><span>{label}</span></div>{nodes}</article></div>
}
