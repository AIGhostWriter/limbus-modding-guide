import CodeBlock from '../../components/CodeBlock'
import { GuideIntro, Callout, Steps } from '../../components/GuideBlocks'

export default function FirstSkill() {
  return <div>
    <h1>첫 번째 스킬 만들기</h1>
    <GuideIntro eyebrow="Copy, connect, verify">빈 JSON을 처음부터 만드는 대신 dumpedData의 정상 스킬 하나를 복제하고, ID와 효과만 최소한으로 바꾸는 방식이 가장 안전합니다. 여기서는 “사용 시 정신력 5 회복, 적중 시 화상 3 부여” 스킬을 만듭니다.</GuideIntro>
    <h2>완성 파일</h2>
    <CodeBlock language="json" title="custom_limbus_data/skill/workshop_skill.json" code={`{
  "list": [
    {
      "id": 99000101,
      "skillTier": 1,
      "skillType": "SKILL",
      "skillData": [
        {
          "defaultValue": 4,
          "abilityScriptList": [
            {
              "scriptName": "Modular/TIMING:WhenUse/healsp(Self,5)"
            }
          ],
          "coinList": [
            {
              "operatorType": "ADD",
              "scale": 3,
              "grade": 2,
              "color": "CRIMSON",
              "abilityScriptList": [
                {
                  "scriptName": "Modular/TIMING:OSA/buff(Target,Combustion,3,0,0)"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}`} />
    <Callout title="예제 ID는 반드시 교체" tone="warning"><p><code>99000101</code>은 설명용입니다. 다른 모드와 충돌하지 않는 ID 체계를 정하고, 연결되는 모든 파일에서 같은 값을 사용하세요.</p></Callout>
    <h2>각 위치가 의미하는 것</h2>
    <table><thead><tr><th>위치</th><th>실행 범위</th><th>이 예제</th></tr></thead><tbody>
      <tr><td><code>skillData[].abilityScriptList</code></td><td>스킬 전체</td><td>스킬 사용 시 SP 5 회복</td></tr>
      <tr><td><code>coinList[].abilityScriptList</code></td><td>해당 동전</td><td>첫 동전 적중 시 화상 효력 3</td></tr>
      <tr><td><code>defaultValue</code></td><td>기본 위력</td><td>4</td></tr>
      <tr><td><code>scale</code></td><td>동전 위력</td><td>+3</td></tr>
      <tr><td><code>color</code></td><td>죄악 속성</td><td>분노(CRIMSON)</td></tr>
    </tbody></table>
    <h2>유닛에 연결하기</h2>
    <p>스킬 파일이 로드되어도 유닛의 스킬 목록에 등록되지 않으면 전투에서 사용할 수 없습니다.</p>
    <CodeBlock language="json" title="abnormality-unit의 일부" code={`{
  "attributeList": [
    { "skillId": 99000101, "number": 0 }
  ],
  "patternList": [
    {
      "slotList": [
        {
          "skillParentList": [
            {
              "skillChildList": [
                { "skillID": 99000101, "chance": 1 }
              ],
              "chance": 1
            }
          ]
        }
      ]
    }
  ]
}`} />
    <h2>처음 실행할 때 확인할 것</h2>
    <Steps items={[
      { title: '스킬 슬롯 표시', body: '아이콘이나 이름이 임시값이어도 슬롯이 나타나는지 먼저 확인합니다.' },
      { title: 'WhenUse 확인', body: '스킬을 사용한 순간 SP가 정확히 5 증가하는지 봅니다.' },
      { title: 'OSA 확인', body: '동전이 적중했을 때만 대상에게 화상 효력 3이 생기는지 봅니다.' },
      { title: '로그 확인', body: '동작하지 않으면 효과를 log()로 바꾸어 타이밍과 ID 연결을 분리 진단합니다.' },
    ]} />
    <Callout title="복사할 때 유지할 필드" tone="note"><p>외형과 모션이 필요한 실제 스킬은 원본의 애니메이션, 타겟팅, 공격 타입 관련 필드를 유지해야 합니다. 이 페이지의 JSON은 데이터 연결을 설명하는 최소 구조이므로, 실전에서는 같은 종류의 바닐라 스킬을 베이스로 복제하세요.</p></Callout>
  </div>
}

