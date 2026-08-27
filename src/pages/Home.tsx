import { Link } from 'react-router-dom'

const paths = [
  { no: '01', title: '스크립트 문법 익히기', body: 'GlitchScript의 실행 구조와 VALUE, 타이밍, 타겟팅을 순서대로 익힙니다.', to: '/guide/script-basics/structure', meta: 'CORE · 25 MIN' },
  { no: '02', title: 'MT 기능으로 확장하기', body: 'MTData, 동적 로케일, 전역 Lua 데이터로 복합 동작을 설계합니다.', to: '/guide/mt/mtdata', meta: 'EXTENSION · 35 MIN' },
  { no: '03', title: '실제 콘텐츠 제작하기', body: '아이덴티티와 보스, 인카운터를 동작 가능한 데이터 묶음으로 구성합니다.', to: '/guide/identity/skills', meta: 'BUILD · 50 MIN' },
]

const quick = [
  ['첫 스킬 작성', '/getting-started/first-skill'],
  ['함수 레퍼런스', '/reference/timings'],
  ['보스 패턴 설계', '/guide/boss/patterns'],
  ['DLL 개발 기록', '/dll'],
]

export default function Home() {
  return <div>
    <section className="relative overflow-hidden border border-[var(--line)] bg-[#191b18] text-white px-6 py-10 sm:px-11 sm:py-14 mb-12">
      <div className="absolute right-[-2rem] top-[-4rem] text-[15rem] leading-none font-serif text-white/[.025] select-none">L</div>
      <div className="relative max-w-2xl">
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#e7c878] mb-6"><span className="w-8 h-px bg-[#e7c878]" /> Lethe modding documentation</div>
        <h1 className="!text-white !mb-5 !text-[2.5rem] sm:!text-[3.5rem] !leading-[1.05] !tracking-[-.045em] after:!hidden">만드는 사람을 위한<br />림버스 모딩 안내서</h1>
        <p className="!text-white/58 !mb-8 max-w-xl">설치 설명을 반복하지 않습니다. 이미 Lethe를 사용하는 제작자가 스크립트를 이해하고, 검증하고, 실제 콘텐츠로 완성하는 데 필요한 내용을 한곳에 정리했습니다.</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/getting-started" className="!no-underline px-5 py-3 bg-[#a5362d] !text-white text-sm font-bold hover:bg-[#bd4439] transition">가이드 시작하기 →</Link>
          <Link to="/reference/timings" className="!no-underline px-5 py-3 border border-white/20 !text-white/75 text-sm hover:border-white/45 transition">레퍼런스 바로가기</Link>
        </div>
      </div>
    </section>

    <section className="mb-14">
      <div className="flex items-end justify-between gap-4 mb-5"><div><div className="text-[10px] uppercase tracking-[.18em] text-[var(--accent)] font-bold mb-1">Recommended route</div><h2 className="!mt-0 !mb-0 !border-0 !pb-0">권장 학습 경로</h2></div><span className="hidden sm:block text-xs text-[var(--muted)]">기초에서 실전 제작까지</span></div>
      <div className="grid lg:grid-cols-3 border-t border-l border-[var(--line)]">
        {paths.map(item => <Link key={item.no} to={item.to} className="group !no-underline p-6 min-h-60 border-r border-b border-[var(--line)] bg-white/30 hover:bg-white/65 transition">
          <div className="font-serif text-3xl text-[var(--accent)] mb-8">{item.no}</div><div className="text-lg font-bold text-[var(--ink)] mb-3">{item.title}</div><p className="!text-sm !mb-5">{item.body}</p><div className="mt-auto text-[10px] tracking-[.14em] text-[var(--muted)] group-hover:text-[var(--accent)]">{item.meta}</div>
        </Link>)}
      </div>
    </section>

    <section className="grid lg:grid-cols-[1.15fr_.85fr] gap-7 mb-10">
      <div className="p-7 border border-[var(--line)] bg-[#ece7da]">
        <div className="text-[10px] uppercase tracking-[.18em] text-[var(--accent)] font-bold mb-3">Two-layer system</div><h2 className="!mt-0">두 시스템을 함께 이해하기</h2>
        <p>GlitchScript는 실행 문법과 기본 함수를, MT Custom Scripts는 상태 저장과 확장 타이밍을 제공합니다. 이 가이드는 둘을 따로 나열하지 않고 실제 제작 흐름 안에서 연결합니다.</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-6"><div className="p-4 bg-[#6e4f93]/10 border-l-2 border-[#6e4f93]"><b className="block text-sm">GlitchScript</b><span className="text-xs text-[var(--muted)]">실행 구조 · 타이밍 · 함수</span></div><div className="p-4 bg-[#267489]/10 border-l-2 border-[#267489]"><b className="block text-sm">MT Scripts</b><span className="text-xs text-[var(--muted)]">데이터 · 로케일 · 확장</span></div></div>
      </div>
      <div className="p-7 border border-[var(--line)] bg-white/35">
        <div className="text-[10px] uppercase tracking-[.18em] text-[var(--accent)] font-bold mb-3">Quick access</div><h2 className="!mt-0">자주 찾는 문서</h2>
        <div className="mt-5">{quick.map(([label,to], i) => <Link key={to} to={to} className="flex items-center justify-between py-3 border-b border-[var(--line)] !no-underline text-sm font-semibold !text-[var(--ink)] hover:!text-[var(--accent)]"><span>{label}</span><span className="text-xs text-[var(--muted)]">0{i+1} ↗</span></Link>)}</div>
      </div>
    </section>
  </div>
}

