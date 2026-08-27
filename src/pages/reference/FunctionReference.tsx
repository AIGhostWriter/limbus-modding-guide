import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import { functions } from '../../data/functions'
import type { FunctionEntry, FunctionCategory, FunctionSource } from '../../data/functions'
import Badge from '../../components/Badge'
import CodeBlock from '../../components/CodeBlock'

function FunctionRow({ fn }: { fn: FunctionEntry }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-[var(--color-border)] last:border-b-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-[var(--color-surface-2)] transition-colors group"
      >
        <code className="text-sm font-mono text-[var(--color-text)] min-w-[180px]">
          {fn.name}
        </code>
        <span className="text-sm text-[var(--color-text-muted)] flex-1 truncate">
          {fn.description}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {fn.source === 'glitch' && <Badge variant="glitch">GlitchScript</Badge>}
          {fn.source === 'mt' && <Badge variant="mt">MT</Badge>}
          {fn.source === 'both' && <Badge variant="neutral">공통</Badge>}
          {fn.version && <Badge variant="version">{fn.version}</Badge>}
          <svg
            className={`w-3.5 h-3.5 text-[var(--color-text-muted)] transition-transform ${open ? 'rotate-90' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-[var(--color-border)] bg-[var(--color-surface-2)]">
          <div className="pt-3 space-y-3">
            <div>
              <div className="text-xs text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">시그니처</div>
              <code className="text-sm font-mono text-[var(--color-accent)]">{fn.signature}</code>
            </div>

            {fn.params && fn.params.length > 0 && (
              <div>
                <div className="text-xs text-[var(--color-text-muted)] mb-2 uppercase tracking-wide">파라미터</div>
                <table className="w-full text-sm">
                  <tbody>
                    {fn.params.map(p => (
                      <tr key={p.name} className="border-b border-[var(--color-border)] last:border-0">
                        <td className="py-1.5 pr-4 font-mono text-[var(--color-accent)] text-xs w-36">{p.name}</td>
                        <td className="py-1.5 text-[var(--color-text-muted)] text-xs">{p.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {fn.example && (
              <div>
                <div className="text-xs text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide">예제</div>
                <CodeBlock code={fn.example} language="text" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function FunctionReference({ defaultCategory, defaultSource }: { defaultCategory?: FunctionCategory; defaultSource?: FunctionSource }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<FunctionCategory | 'all'>(defaultCategory ?? 'all')
  const [source, setSource] = useState<FunctionSource | 'all'>(defaultSource ?? 'all')

  const fuse = useMemo(
    () => new Fuse(functions, { keys: ['name', 'description'], threshold: 0.35 }),
    []
  )

  const filtered = useMemo(() => {
    let list = query ? fuse.search(query).map(r => r.item) : functions
    if (category !== 'all') list = list.filter(f => f.category === category)
    if (source !== 'all') list = list.filter(f => f.source === source || f.source === 'both')
    return list
  }, [query, category, source, fuse])

  const titleMap: Record<FunctionCategory, string> = {
    timing: '타이밍 목록',
    acquirer: '획득자 함수',
    consequence: '결과 함수',
  }

  return (
    <div>
      <h1>{defaultCategory ? titleMap[defaultCategory] : '함수 레퍼런스'}</h1>
      <p>
        GlitchScript와 MT Custom Scripts에서 정리한 161개 항목을 검색할 수 있습니다.
        함수명뿐 아니라 효과, 대상, 버전으로 좁혀 보고 상세 패널에서 시그니처와 예제를 함께 확인하세요.
      </p>

      <div className="mb-6 border-l-3 border-[#a57b30] bg-[#a57b30]/8 px-5 py-4 text-sm text-[#55574f]">
        MT 항목은 원문 v24.102.4 스냅샷을 기준으로 합니다. 실제 설치 버전이 다르면 원문 변경 이력을 우선하세요.
      </div>

      <div className="grid md:grid-cols-[1fr_auto_auto] gap-3 mb-5 mt-6">
        <input
          type="text"
          placeholder="함수명, 키워드 검색..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 px-3 py-2 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-dim)]"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value as FunctionCategory | 'all')}
          className="px-3 py-2 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-dim)]"
        >
          <option value="all">전체 카테고리</option>
          <option value="timing">타이밍</option>
          <option value="acquirer">획득자</option>
          <option value="consequence">결과</option>
        </select>
        <select
          value={source}
          onChange={e => setSource(e.target.value as FunctionSource | 'all')}
          className="px-3 py-2 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent-dim)]"
        >
          <option value="all">전체 시스템</option>
          <option value="glitch">GlitchScript</option>
          <option value="mt">MT Scripts</option>
        </select>
      </div>

      <div className="text-xs text-[var(--color-text-muted)] mb-3">
        {filtered.length}개 항목
      </div>

      <div className="border border-[var(--color-border)] rounded-md overflow-hidden bg-[var(--color-surface)]">
        {filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
            검색 결과 없음
          </div>
        ) : (
          filtered.map(fn => <FunctionRow key={`${fn.name}-${fn.source}`} fn={fn} />)
        )}
      </div>
    </div>
  )
}
