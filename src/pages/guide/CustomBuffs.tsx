import CodeBlock from '../../components/CodeBlock'
import { GuideIntro, Callout, Steps, SourceNote } from '../../components/GuideBlocks'

export default function CustomBuffs() {
  return <div>
    <h1>커스텀 버프 만들기</h1>
    <GuideIntro eyebrow="End-to-end example">버프는 JSON 하나로 끝나지 않습니다. 키워드 등록, 동작 데이터, 이름과 설명, 적용 스크립트가 같은 ID를 공유해야 게임에서 정상적으로 보이고 작동합니다.</GuideIntro>
    <h2>필요한 파일</h2>
    <CodeBlock language="text" title="MyMod/" code={`custom_buffs/
└─ WorkshopMark.txt
custom_limbus_data/buff/
└─ workshop_mark.json
custom_limbus_locale/KR/bufList/
└─ workshop_mark_name.json
custom_limbus_locale/KR/keywordList/
└─ workshop_mark_desc.json
custom_sprites/
└─ buffIcon_WorkshopMark.png   # 선택`} />
    <Callout title="ID 연결 규칙" tone="warning"><p><code>WorkshopMark.txt</code>, 버프 JSON의 <code>id</code>, 로케일의 <code>id</code>, 스크립트의 <code>buffKeyword</code>는 대소문자까지 완전히 같아야 합니다. 새 키워드를 등록한 뒤에는 게임을 재시작하세요.</p></Callout>
    <h2>1. 버프 동작 정의</h2>
    <CodeBlock language="json" title="custom_limbus_data/buff/workshop_mark.json" code={`{
  "list": [
    {
      "id": "WorkshopMark",
      "iconId": "Nail",
      "buffClass": "CountableBuff",
      "buffType": "Positive",
      "maxStack": 20,
      "maxTurn": 10,
      "destroyableOnZero": true,
      "destroyableOnZeroTurn": true,
      "canBeDespelled": false,
      "categoryKeywordList": [],
      "list": [
        {
          "ability": "GiveBuffOnRoundStart",
          "value": 1,
          "buffData": {
            "buffKeyword": "Haste",
            "target": "Self",
            "stack": 1,
            "turn": 0,
            "activeRound": 0
          }
        }
      ]
    }
  ]
}`} />
    <table><thead><tr><th>buffClass</th><th>저장하는 값</th><th>적합한 용도</th></tr></thead><tbody>
      <tr><td><code>NonvolatileBuff</code></td><td>효력</td><td>자동 만료되지 않는 누적 효과</td></tr>
      <tr><td><code>VolatileBuff</code></td><td>효력</td><td>턴 종료 시 사라지는 일시 효과</td></tr>
      <tr><td><code>CountableBuff</code></td><td>효력 + 횟수</td><td>횟수를 소비하는 일반 커스텀 상태</td></tr>
      <tr><td><code>sinBuff</code></td><td>효력 + 횟수</td><td>7대 상태이상과 유사한 구조</td></tr>
    </tbody></table>
    <h2>2. 이름과 설명 연결</h2>
    <CodeBlock language="json" title="KR/bufList/workshop_mark_name.json" code={`{"dataList":[{"id":"WorkshopMark","name":"공방의 표식"}]}`} />
    <CodeBlock language="json" title="KR/keywordList/workshop_mark_desc.json" code={`{
  "dataList": [
    {
      "id": "WorkshopMark",
      "desc": "턴 시작 시 신속 1을 얻음. 최대 효력 20, 최대 횟수 10."
    }
  ]
}`} />
    <h2>3. 스킬에서 부여</h2>
    <CodeBlock language="json" title="coin abilityScriptList 내부" code={`{
  "scriptName": "GiveBuffOnSucceedAttack",
  "buffData": {
    "buffKeyword": "WorkshopMark",
    "target": "Target",
    "stack": 3,
    "turn": 2,
    "activeRound": 0
  }
}`} />
    <h2>검증 순서</h2>
    <Steps items={[
      { title: '툴팁 확인', body: '이름과 설명이 보이면 등록 및 로케일 연결이 성공한 것입니다.' },
      { title: '부여 수치 확인', body: '효력 3, 횟수 2가 의도대로 표시되는지 확인합니다.' },
      { title: '라운드 효과 확인', body: '다음 라운드 시작 시 신속이 적용되는지 확인합니다.' },
      { title: '0에서 제거 확인', body: '효력 또는 횟수가 0이 되었을 때 버프가 제거되는지 확인합니다.' },
    ]} />
    <SourceNote href="https://aighostwriter.github.io/Lethe_Guide/chapter2_EN.html" label="Lethe Guide — Creating Custom Buffs" />
  </div>
}

