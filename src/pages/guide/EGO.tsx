import CodeBlock from '../../components/CodeBlock'

export default function EGO() {
  return (
    <div>
      <h1>EGO 연동</h1>
      <p>
        커스텀 아이덴티티에 EGO를 추가하는 방법입니다.
        EGO는 별도 JSON으로 정의하고 아이덴티티와 연결합니다.
      </p>

      <h2>파일 위치</h2>
      <CodeBlock
        language="text"
        code={`custom_limbus_data/
├── ego/
│   └── your_ego.json
├── ego-skill/
│   └── your_ego_skill.json
└── identity/
    └── your_identity.json`}
      />

      <h2>ego.json 구조</h2>
      <CodeBlock
        language="json"
        code={`{
  "id": 90000201,
  "nameId": "EGO_NAME",
  "sinnerId": 1,
  "grade": "ZAYIN",
  "skillId": 90000202,
  "passiveList": [
    { "id": 90000203 }
  ],
  "awakeningSkillId": 90000204,
  "costList": [
    { "sin": "CRIMSON", "count": 4 },
    { "sin": "GLUTTONY", "count": 2 }
  ],
  "resistList": [
    { "dmgType": "SLASH", "type": "NORMAL", "value": 1.0 }
  ]
}`}
      />

      <h2>EGO 등급</h2>
      <table>
        <thead><tr><th>grade</th><th>설명</th></tr></thead>
        <tbody>
          <tr><td><code>ZAYIN</code></td><td>자인 (가장 낮음)</td></tr>
          <tr><td><code>TETH</code></td><td>테트</td></tr>
          <tr><td><code>HE</code></td><td>헤</td></tr>
          <tr><td><code>WAW</code></td><td>바우</td></tr>
          <tr><td><code>ALEPH</code></td><td>알렙 (가장 높음)</td></tr>
        </tbody>
      </table>

      <h2>EGO 스킬 JSON</h2>
      <p>
        EGO 스킬은 일반 스킬과 동일한 구조입니다.
        <code>ego-skill</code> 폴더에 위치합니다.
      </p>
      <CodeBlock
        language="json"
        code={`{
  "id": 90000202,
  "attributeList": [
    { "desc": "EGO Skill Name" }
  ],
  "skillData": [{
    "targetNum": 1,
    "canChangeTarget": false,
    "atkType": "SLASH",
    "defType": "GUARD",
    "level": 40,
    "coinList": [{
      "operType": "ADD",
      "scale": 8,
      "skillScriptList": [
        "Modular/TIMING:OSA/buff(Target, Bleed, 5, 5, 0)"
      ]
    }]
  }]
}`}
      />

      <h2>아이덴티티와 연결</h2>
      <CodeBlock
        language="json"
        code={`// identity JSON에 egoList 추가
{
  "id": 90000001,
  "egoList": [
    { "id": 90000201 }
  ]
}`}
      />

      <h2>각성 스킬</h2>
      <p>
        <code>awakeningSkillId</code>는 SP 게이지 최대 시 사용하는 각성 스킬입니다.
        동일하게 <code>ego-skill</code>에 정의합니다.
      </p>
      <CodeBlock
        language="json"
        code={`{
  "id": 90000204,
  "attributeList": [
    { "desc": "Awakening EGO Skill" }
  ],
  "skillData": [{
    "targetNum": 1,
    "atkType": "SLASH",
    "coinList": [{
      "operType": "ADD",
      "scale": 12,
      "skillScriptList": []
    }]
  }]
}`}
      />

      <h2>로케일 텍스트</h2>
      <CodeBlock
        title="EN/egoList/egos.json"
        language="json"
        code={`[
  {
    "id": 90000201,
    "name": "My EGO",
    "desc": "EGO description text here."
  }
]`}
      />
    </div>
  )
}
