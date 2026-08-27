import CodeBlock from '../../components/CodeBlock'

export default function IdentitySkills() {
  return (
    <div>
      <h1>스킬 설계</h1>
      <p>
        커스텀 아이덴티티의 스킬 JSON 구조와 ModularScript 연동 방법을 설명합니다.
      </p>

      <h2>스킬 JSON 전체 구조</h2>
      <CodeBlock
        language="json"
        code={`{
  "id": 90000001,
  "attributeList": [
    { "desc": "Skill Name" }
  ],
  "skillData": [
    {
      "targetNum": 1,
      "canChangeTarget": false,
      "defaultSkillMotion": "Slash",
      "defaultAtkType": "SLASH",
      "atkType": "SLASH",
      "defType": "GUARD",
      "level": 40,
      "minClashCount": 0,
      "maxClashCount": 1,
      "coinList": [
        {
          "operType": "ADD",
          "scale": 5,
          "skillScriptList": [
            "Modular/TIMING:WhenUse/buff(Self, Haste, 2, 1, 1)"
          ]
        },
        {
          "operType": "ADD",
          "scale": 3,
          "skillScriptList": [
            "Modular/TIMING:OSA/buff(Target, Burn, 3, 3, 0)"
          ]
        }
      ]
    }
  ]
}`}
      />

      <h2>주요 필드</h2>
      <table>
        <thead><tr><th>필드</th><th>설명</th></tr></thead>
        <tbody>
          <tr><td><code>targetNum</code></td><td>동시 타겟 수. 광역 스킬은 1로 유지 (DLL 사용 시)</td></tr>
          <tr><td><code>canChangeTarget</code></td><td>전투 중 타겟 변경 가능 여부</td></tr>
          <tr><td><code>defaultSkillMotion</code></td><td>기본 모션 타입</td></tr>
          <tr><td><code>atkType</code></td><td>공격 타입: SLASH | PENETRATE | HIT</td></tr>
          <tr><td><code>defType</code></td><td>방어 타입: GUARD | EVADE | NA</td></tr>
          <tr><td><code>operType</code></td><td>동전 연산: ADD | SUB | MUL</td></tr>
          <tr><td><code>scale</code></td><td>동전 파워</td></tr>
        </tbody>
      </table>

      <h2>죄악 속성 설정</h2>
      <CodeBlock
        language="json"
        code={`{
  "id": 90000002,
  "skillData": [{
    "atkType": "SLASH",
    "coinList": [{
      "operType": "ADD",
      "scale": 6,
      "motionAttribute": "CRIMSON",
      "skillScriptList": []
    }]
  }]
}`}
      />

      <h2>스킬 타이밍 위치</h2>
      <p>
        스크립트는 <code>coinList</code> 내 각 동전의 <code>skillScriptList</code>에 작성합니다.
        동전마다 독립적인 스크립트를 가집니다.
      </p>
      <CodeBlock
        language="text"
        code={`coinList[0].skillScriptList → 1번 동전 스크립트
coinList[1].skillScriptList → 2번 동전 스크립트

// 동전과 무관한 스킬 전체 트리거는
// TIMING:WhenUse 또는 TIMING:EndSkill 사용`}
      />

      <h2>로케일 텍스트</h2>
      <CodeBlock
        title="EN/skillList/skills.json"
        language="json"
        code={`[
  {
    "id": 90000001,
    "name": "Skill Name",
    "desc": "On Use: Gain 2 <b>Haste</b> (1 count).<br>On Hit: Inflict 3 <b>Burn</b> (3 count)."
  }
]`}
      />

      <h2>스킬 티어 (Rank)</h2>
      <p>
        스킬 티어는 JSON의 <code>rank</code> 필드로 지정합니다. 기본값은 없으면 자동 부여됩니다.
        S1/S2/S3 구분은 아이덴티티 JSON의 슬롯 배치에서 결정됩니다.
      </p>
    </div>
  )
}
