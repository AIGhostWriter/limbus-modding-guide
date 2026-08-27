import CodeBlock from '../../components/CodeBlock'
import { GuideIntro, Callout, Steps } from '../../components/GuideBlocks'

const rows = [
  ['스테이지가 보이지 않음', 'subchapterui.json 누락 또는 ID 불일치', 'encounter.id, subchapterId, nodeId를 동일하게 맞춤'],
  ['보스 스킬이 비어 있음', 'attributeList 미등록 또는 적 유닛에서 PC 스킬 ID 직접 참조', '커스텀 스킬 ID로 복제 후 attributeList와 patternList에 연결'],
  ['일부 슬롯만 사용', 'startActionSlotNum과 slotList 길이 불일치', '실제 슬롯 수를 명시하고 두 값을 맞춤'],
  ['시작 버프가 적용되지 않음', 'initBuffList의 turn 값 또는 키워드 등록 문제', 'turn: 99와 custom_buffs 키워드 파일 확인'],
  ['함수가 발동하지 않음', '지원하지 않는 TIMING 또는 인자 순서', 'log() 단일 결과로 타이밍부터 검증'],
  ['JSON 로드 실패', '쉼표, 괄호, 문자열 타입 오류', 'JSON 검사 후 LogOutput.log의 최초 오류부터 수정'],
]

export default function Troubleshooting() {
  return <div>
    <h1>문제 해결</h1>
    <GuideIntro eyebrow="Debugging workflow">화면에 나타난 증상만 고치면 다른 문제가 겹칩니다. 파일 로드, ID 연결, 타이밍, 결과 실행의 네 단계로 나누면 대부분의 오류를 빠르게 좁힐 수 있습니다.</GuideIntro>
    <h2>가장 먼저 확인할 표</h2>
    <div className="overflow-x-auto"><table><thead><tr><th>증상</th><th>가능성이 높은 원인</th><th>우선 조치</th></tr></thead><tbody>{rows.map(r => <tr key={r[0]}>{r.map(c => <td key={c}>{c}</td>)}</tr>)}</tbody></table></div>
    <h2>최소 진단 스크립트</h2>
    <p>복합 효과를 잠시 제거하고 아래처럼 로그 하나만 남깁니다. 로그가 없다면 결과 함수가 아니라 타이밍 또는 데이터 연결 문제입니다.</p>
    <CodeBlock language="text" code={`Modular/TIMING:WhenUse/log(WorkshopSkill_WhenUse)`} />
    <Callout title="첫 오류부터 읽기" tone="warning"><p>뒤쪽의 NullReferenceException은 앞에서 데이터 로드에 실패한 결과일 수 있습니다. <code>LogOutput.log</code>를 아래에서 위로 보지 말고, 모드 로드 시점의 첫 Warning/Error부터 확인하세요.</p></Callout>
    <h2>단계별 격리</h2>
    <Steps items={[
      { title: '파일이 로드됐는가', body: 'Lethe 로그에서 대상 JSON 파일 경로가 출력되는지 확인합니다.' },
      { title: 'ID가 연결됐는가', body: 'encounter → unit → part/skill → locale 순서로 참조 ID를 대조합니다.' },
      { title: '타이밍이 발동하는가', body: '결과를 log 하나로 바꾸고 해당 행동을 직접 수행합니다.' },
      { title: '결과 함수가 유효한가', body: '필수 인자와 대상 타입(Single/Multi)을 원문 시그니처와 대조합니다.' },
      { title: '하나씩 다시 결합', body: '검증된 효과를 한 줄씩 추가하여 최초로 깨지는 줄을 찾습니다.' },
    ]} />
    <h2>보스 데이터 연결 체크</h2>
    <CodeBlock language="text" code={`encounter.json
  unitList[].unitID ───────────────┐
abnormality-unit
  id ◀─────────────────────────────┘
  abnormalityPartList[] ───────────┐
  attributeList[].skillId ───────┐ │
  patternList[].skillID ─────────┤ │
abnormality-part                  │ │
  id ◀────────────────────────────┘ │
skill                               │
  list[].id ◀───────────────────────┘`} />
  </div>
}

