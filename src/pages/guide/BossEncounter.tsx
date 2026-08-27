import CodeBlock from '../../components/CodeBlock'

export default function BossEncounter() {
  return (
    <div>
      <h1>인카운터 구성</h1>
      <p>
        Lethe에서 커스텀 보스 인카운터를 정의하는 방법입니다.
        인카운터 JSON은 어떤 적이 어떤 웨이브에 등장할지를 정의합니다.
      </p>

      <h2>파일 위치</h2>
      <CodeBlock
        language="text"
        code={`custom_encounters/
└── your-mod-name/
    ├── encounter.json
    └── subchapterui.json`}
      />

      <h2>encounter.json</h2>
      <CodeBlock
        language="json"
        code={`{
  "id": 599901,
  "stageType": "ABNORMALITY",
  "waveList": [
    {
      "unitList": [
        {
          "id": 5999001,
          "level": 40,
          "startPos": 0
        }
      ]
    }
  ],
  "rewardList": [],
  "bgmId": ""
}`}
      />

      <h2>subchapterui.json</h2>
      <CodeBlock
        language="json"
        code={`{
  "id": 599901,
  "name": "My Custom Boss",
  "description": "A custom encounter.",
  "chapter": 1
}`}
      />

      <h2>다중 웨이브</h2>
      <CodeBlock
        language="json"
        code={`"waveList": [
  {
    "unitList": [
      { "id": 5999001, "level": 40, "startPos": 0 }
    ]
  },
  {
    "unitList": [
      { "id": 5999002, "level": 40, "startPos": 0 },
      { "id": 5999003, "level": 40, "startPos": 1 }
    ]
  }
]`}
      />

      <h2>stageType 옵션</h2>
      <table>
        <thead><tr><th>값</th><th>설명</th></tr></thead>
        <tbody>
          <tr><td><code>ABNORMALITY</code></td><td>이상현상 보스전</td></tr>
          <tr><td><code>NORMAL</code></td><td>일반 전투</td></tr>
        </tbody>
      </table>

      <h2>인카운터 진입 확인</h2>
      <p>
        Lethe 모드 목록에서 인카운터를 선택하면 진입할 수 있습니다.
        로드 여부는 <code>BepInEx/LogOutput.log</code>에서 확인하세요.
      </p>
      <CodeBlock
        language="text"
        code={`// 정상 로드 시 로그 예시
[Info  : Lethe] Loaded encounter: 599901`}
      />
    </div>
  )
}
