import { GuideIntro, Callout, Steps } from '../../components/GuideBlocks'

const sources = [
  { name: 'GlitchScript', role: '기본 문법과 실행 엔진', use: 'TIMING, VALUE, 타겟, 획득자와 결과 함수의 기준', href: 'https://rentry.co/glitchscript' },
  { name: "MT's Custom Scripts", role: '확장 기능과 버전별 변경', use: 'MTData, Dynamic Locale, 추가 타이밍·타겟팅·Lua 함수', href: 'https://rentry.co/mtcustomscripts' },
  { name: 'Modular Examples', role: '난이도별 실전 패턴', use: '기초 효과부터 상태 머신형 복합 패시브까지', href: 'https://rentry.co/modularexamples' },
  { name: 'Lethe Guide', role: '파일 구조와 인카운터', use: 'encounter, unit, part, skill, buff, locale의 연결 관계', href: 'https://aighostwriter.github.io/Lethe_Guide/' },
  { name: 'LEAGUE OF NINE', role: '프로젝트 원본과 최신 코드', use: 'ModularLimbis, LetheLauncher, BasePlugin 등 구현 확인', href: 'https://github.com/LEAGUE-OF-NINE' },
]

export default function Sources() {
  return <div>
    <h1>자료와 검증 기준</h1>
    <GuideIntro eyebrow="Source map">이 사이트는 여러 문서를 한데 복사한 요약본이 아닙니다. 각 자료가 맡는 역할을 구분하고, 서로 충돌할 때 무엇을 우선할지 정리한 작업용 안내서입니다.</GuideIntro>
    <Callout title="버전 스냅샷" tone="warning"><p>MT 문서의 기준 표기는 <b>v24.102.4</b>입니다. 플러그인이 갱신되면 함수명과 인자 순서가 달라질 수 있으므로, 실행 전 현재 설치본과 원문 변경 이력을 함께 확인하세요.</p></Callout>
    <h2>자료별 역할</h2>
    <div className="overflow-x-auto"><table><thead><tr><th>자료</th><th>주 역할</th><th>이 사이트에서 사용하는 범위</th></tr></thead><tbody>{sources.map(s => <tr key={s.name}><td><a href={s.href} target="_blank" rel="noreferrer">{s.name} ↗</a></td><td>{s.role}</td><td>{s.use}</td></tr>)}</tbody></table></div>
    <h2>정보를 검증하는 순서</h2>
    <Steps items={[
      { title: '원문에서 시그니처 확인', body: '함수명, 필수 인자, 지원 버전과 전용 타이밍을 확인합니다.' },
      { title: 'dumpedData에서 실제 구조 확인', body: 'JSON 필드와 바닐라 abilityScriptList 사용 예를 검색합니다.' },
      { title: '최소 예제로 한 기능만 시험', body: '처음부터 여러 효과를 결합하지 말고 log 또는 단일 buff로 발동 여부를 확인합니다.' },
      { title: 'LogOutput.log로 실패 지점 확인', body: '파일 로드 → ID 연결 → 타이밍 발동 → 결과 실행 순서로 로그를 좁힙니다.' },
    ]} />
    <h2>이 사이트의 표기법</h2>
    <ul>
      <li><code>필수</code> 인자는 이름 그대로 적고, 선택 인자는 <code>opt_*</code> 또는 물음표로 표시합니다.</li>
      <li>코드는 붙여넣을 위치까지 포함한 완성 예제를 우선 제공합니다.</li>
      <li>엔진 동작이 버전별로 달라질 수 있는 내용은 주의 상자로 분리합니다.</li>
      <li>확인되지 않은 추측은 확정 문장으로 작성하지 않습니다.</li>
    </ul>
  </div>
}

