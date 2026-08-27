import { Link } from 'react-router-dom'

const dlls = [
  {
    path: '/dll/gwangyeoknansa',
    name: '광역난사 (GwangYeokNansa)',
    desc: '코인 단위 무작위 타겟팅. 적이 아군 중 무작위 대상을 코인별로 독립 선택합니다.',
    lang: 'C#',
    status: '완성',
  },
  {
    path: '/dll/md-dungeon',
    name: 'MD 던전 DLL',
    desc: '미러 던전 관련 커스텀 동작 및 훅 포인트 구현.',
    lang: 'C#',
    status: '개발 중',
  },
]

export default function DllIndex() {
  return (
    <div>
      <h1>DLL 개발</h1>
      <p>
        ModularScript만으로 구현할 수 없는 동작은 BepInEx 플러그인(DLL)으로 처리합니다.
        여기서는 제작된 DLL 목록과 각각의 작동 원리, 적용 방법을 설명합니다.
      </p>

      <h2>제작된 DLL</h2>

      <div className="space-y-3 not-prose">
        {dlls.map(dll => (
          <Link
            key={dll.path}
            to={dll.path}
            className="block p-5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent-dim)] transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-[var(--color-text)] mb-1.5">
                  {dll.name}
                </div>
                <div className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {dll.desc}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-[var(--color-text-muted)] border border-[var(--color-border)] px-2 py-0.5 rounded">
                  {dll.lang}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded border ${
                  dll.status === '완성'
                    ? 'text-emerald-400 border-emerald-900 bg-emerald-950'
                    : 'text-amber-400 border-amber-900 bg-amber-950'
                }`}>
                  {dll.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <h2>개발 환경</h2>
      <p>
        <Link to="/dll/setup">개발환경 세팅 페이지</Link>에서 .NET SDK, BepInEx 참조 설정,
        프로젝트 구성 방법을 확인하세요.
      </p>
    </div>
  )
}
