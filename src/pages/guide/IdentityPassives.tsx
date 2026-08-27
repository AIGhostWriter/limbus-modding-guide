import CodeBlock from '../../components/CodeBlock'

export default function IdentityPassives() {
  return (
    <div>
      <h1>패시브 설계</h1>
      <p>
        커스텀 아이덴티티의 패시브 JSON 구조와 스크립트 작성법입니다.
      </p>

      <h2>패시브 JSON 구조</h2>
      <CodeBlock
        language="json"
        code={`{
  "id": 90000101,
  "name": "My Passive",
  "desc": "On Round Start: Gain 2 Haste.",
  "scriptList": [
    "Modular/TIMING:RoundStart/buff(Self, Haste, 2, 1, 1)"
  ],
  "skillCostList": [
    { "sin": "CRIMSON", "count": 1 }
  ],
  "ownerId": 90000001
}`}
      />

      <h2>주요 필드</h2>
      <table>
        <thead><tr><th>필드</th><th>설명</th></tr></thead>
        <tbody>
          <tr><td><code>scriptList</code></td><td>패시브 스크립트 목록. 스킬의 skillScriptList와 동일 형식</td></tr>
          <tr><td><code>skillCostList</code></td><td>패시브 발동에 필요한 죄악 자원 비용</td></tr>
          <tr><td><code>ownerId</code></td><td>이 패시브가 속한 아이덴티티 ID</td></tr>
        </tbody>
      </table>

      <h2>패시브 타이밍</h2>
      <p>
        패시브에서 사용 가능한 주요 타이밍입니다.
      </p>
      <table>
        <thead><tr><th>타이밍</th><th>발동 조건</th></tr></thead>
        <tbody>
          <tr><td><code>EncounterStart</code></td><td>전투 시작</td></tr>
          <tr><td><code>RoundStart</code></td><td>라운드 시작</td></tr>
          <tr><td><code>AfterSlots</code></td><td>슬롯 형성 후</td></tr>
          <tr><td><code>WhenHit</code></td><td>피격 시</td></tr>
          <tr><td><code>OnDie</code></td><td>자신 사망 시</td></tr>
          <tr><td><code>OnOtherDie</code></td><td>다른 유닛 사망 시</td></tr>
          <tr><td><code>OnBreak</code></td><td>경직 발생 시</td></tr>
          <tr><td><code>BeforeRoundStart</code></td><td>라운드 시작 전 (MT)</td></tr>
          <tr><td><code>OnGainBuff</code></td><td>버프 획득 시 (MT)</td></tr>
        </tbody>
      </table>

      <h2>실전 예제</h2>

      <h3>아군 사망 시 파워 증가</h3>
      <CodeBlock
        language="text"
        code={`Modular/TIMING:OnOtherDie/buff(Self, PowerUp, 3, 999, 1)`}
      />

      <h3>SP 조건 패시브</h3>
      <CodeBlock
        language="text"
        code={`Modular/TIMING:AfterSlots
/VALUE_0:getsp(Self)
/CONTINUEIF(VALUE_0>35)
/buff(Self, Haste, 2, 1, 1)
// SP 35 초과일 때만 Haste 부여`}
      />

      <h3>특정 버프 스택 기반</h3>
      <CodeBlock
        language="text"
        code={`Modular/TIMING:RoundStart
/VALUE_0:getbuff(Self, Burn, stack)
/CONTINUEIF(VALUE_0>4)
/destroybuff(Self, Burn, 0, All)
/buff(Self, PowerUp, 5, 1, 1)
// 화상 5스택 이상이면 소모하고 PowerUp 획득`}
      />

      <h2>공명 조건 패시브</h2>
      <CodeBlock
        language="text"
        code={`Modular/TIMING:AfterSlots
/VALUE_0:isunitpartofreson(Self, CRIMSON)
/CONTINUEIF(VALUE_0=1)
/buff(Self, Haste, 3, 1, 1)
// 진홍 공명에 포함될 때만 발동`}
      />
    </div>
  )
}
