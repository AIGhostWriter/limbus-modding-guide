import CodeBlock from '../../components/CodeBlock'

export default function BossUnit() {
  return (
    <div>
      <h1>보스 유닛 설정</h1>
      <p>
        커스텀 보스(이상현상 유닛)의 JSON 구성과 핵심 필드를 설명합니다.
      </p>

      <h2>파일 위치</h2>
      <CodeBlock
        language="text"
        code={`custom_limbus_data/abnormality-unit/your_boss.json`}
      />

      <h2>기본 구조</h2>
      <CodeBlock
        language="json"
        code={`{
  "id": 5999001,
  "nameId": "BOSS_NAME",
  "appearanceId": "5999001",
  "hp": 5000,
  "breakSectionList": [
    { "value": 2500, "isOn": true }
  ],
  "attributeList": [
    {
      "attackType": "SLASH",
      "minSpeed": 4,
      "maxSpeed": 7,
      "defenseType": "GUARD",
      "moveList": []
    }
  ],
  "atkList": [
    { "id": 90000001, "defaultYn": true }
  ],
  "passiveList": [
    { "id": 90000101 }
  ],
  "resistList": [
    { "dmgType": "SLASH", "type": "NORMAL", "value": 1.0 },
    { "dmgType": "PENETRATE", "type": "ENDURE", "value": 0.5 },
    { "dmgType": "HIT", "type": "FATAL", "value": 2.0 }
  ]
}`}
      />

      <h2>주요 필드</h2>
      <table>
        <thead><tr><th>필드</th><th>설명</th></tr></thead>
        <tbody>
          <tr><td><code>id</code></td><td>유닛 고유 ID</td></tr>
          <tr><td><code>hp</code></td><td>최대 HP</td></tr>
          <tr><td><code>breakSectionList</code></td><td>경직 임계값 목록. value=발동 HP, isOn=활성 여부</td></tr>
          <tr><td><code>atkList</code></td><td>사용 가능한 스킬 목록. defaultYn=기본 공격 여부</td></tr>
          <tr><td><code>passiveList</code></td><td>보유 패시브 목록</td></tr>
          <tr><td><code>resistList</code></td><td>저항 설정. type: NORMAL | ENDURE | FATAL | IMMUNE | VULN</td></tr>
        </tbody>
      </table>

      <h2>저항값 타입</h2>
      <table>
        <thead><tr><th>타입</th><th>배수</th></tr></thead>
        <tbody>
          <tr><td><code>IMMUNE</code></td><td>×0 (무효)</td></tr>
          <tr><td><code>ENDURE</code></td><td>×0.5</td></tr>
          <tr><td><code>NORMAL</code></td><td>×1.0</td></tr>
          <tr><td><code>WEAK</code></td><td>×1.5</td></tr>
          <tr><td><code>FATAL</code></td><td>×2.0</td></tr>
        </tbody>
      </table>

      <h2>경직 막대 설정</h2>
      <CodeBlock
        language="json"
        code={`"breakSectionList": [
  { "value": 3000, "isOn": true },
  { "value": 1500, "isOn": true },
  { "value": 0,    "isOn": false }
]
// HP 3000, 1500 도달 시 경직 발생`}
      />

      <h2>패턴 스크립트 연동</h2>
      <p>
        보스의 행동 패턴은 패시브 스크립트로 제어합니다.
        HP 조건에 따라 스킬을 교체하거나, 페이즈를 전환하는 식으로 구현합니다.
      </p>
      <CodeBlock
        language="text"
        code={`// HP 50% 이하일 때 페이즈 2 전환
Modular/TIMING:AfterSlots
/VALUE_0:gethp(Self, %)
/CONTINUEIF(VALUE_0<50)
/VALUE_1:getmtdata(Self, Phase)
/CONTINUEIF(VALUE_1=0)
/setmtdata(Self, Phase, 1)
/replaceskillondashboard(Self, -1, 0, 90000002)
// 페이즈 2 스킬로 교체`}
      />
    </div>
  )
}
