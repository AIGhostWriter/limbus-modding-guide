import CodeBlock from '../../components/CodeBlock'

export default function FileStructure() {
  return (
    <div>
      <h1>파일 구조</h1>
      <p>
        Lethe 모드를 구성하는 파일 유형과 각 역할을 설명합니다.
      </p>

      <h2>디렉토리 구조</h2>
      <CodeBlock
        language="text"
        code={`mods/
└── your-mod-name/
    │
    ├── custom_encounters/
    │   └── your-mod-name/
    │       ├── encounter.json        ← 인카운터 진입점
    │       └── subchapterui.json     ← UI 표시 정보
    │
    ├── custom_limbus_data/
    │   ├── skill/
    │   │   └── skills.json           ← 스킬 정의
    │   ├── personality/
    │   │   └── personality.json      ← 아이덴티티 정의
    │   ├── passive/
    │   │   └── passive.json          ← 패시브 정의
    │   └── abnormality-unit/
    │       └── unit.json             ← 보스 유닛 정의
    │
    └── custom_limbus_locale/
        └── EN/
            ├── skillList/
            │   └── skillnames.json   ← 스킬 이름 & 설명
            └── passiveList/
                └── passives.json     ← 패시브 텍스트`}
      />

      <h2>ID 설계</h2>
      <p>
        커스텀 콘텐츠는 원본 게임 데이터와 충돌하지 않는 ID 범위를 사용해야 합니다.
        일반적으로 대형 정수(8자리 이상)를 사용하거나, 팀 내에서 범위를 미리 약속합니다.
      </p>

      <CodeBlock
        title="ID 범위 예시"
        language="text"
        code={`스킬:         90000001 ~
유닛:         5999001  ~
인카운터:     599901   ~

⚠ 원본 ID와 겹치면 기존 데이터를 덮어씁니다.`}
      />

      <h2>스킬 JSON 최소 구조</h2>
      <CodeBlock
        language="json"
        code={`{
  "id": 90000001,
  "attributeList": [
    {
      "desc": "Skill Name"
    }
  ],
  "skillData": [
    {
      "targetNum": 1,
      "canChangeTarget": false,
      "defaultSkillMotion": "Slash",
      "defaultAtkType": "SLASH",
      "atkType": "SLASH",
      "defType": "GUARD",
      "coinList": [
        {
          "operType": "ADD",
          "scale": 4,
          "skillScriptList": []
        }
      ]
    }
  ]
}`}
      />
    </div>
  )
}
