import { Link } from 'react-router-dom'
import CodeBlock from '../../components/CodeBlock'

export default function Overview() {
  return (
    <div>
      <h1>시작하기</h1>
      <p>
        이 가이드는 Lethe가 이미 설치된 상태를 전제로 합니다.
        모드 파일 작성 → 로드 확인까지의 기본 흐름을 설명합니다.
      </p>

      <h2>모드의 기본 구조</h2>
      <p>
        Lethe 모드는 <code>BepInEx/plugins/Lethe/mods/</code> 안에 폴더 단위로 위치합니다.
        폴더명이 곧 모드의 식별자입니다.
      </p>

      <CodeBlock
        title="모드 폴더 구조"
        language="text"
        code={`BepInEx/plugins/Lethe/mods/
└── my-mod/
    ├── custom_encounters/          ← 인카운터 정의
    ├── custom_limbus_data/
    │   ├── skill/                  ← 스킬 JSON
    │   ├── personality/            ← 아이덴티티 JSON
    │   └── abnormality-unit/       ← 보스 유닛 JSON
    └── custom_limbus_locale/
        └── EN/
            └── skillList/          ← 스킬 이름/설명 텍스트`}
      />

      <h2>핵심 개념</h2>
      <p>
        모드는 크게 두 가지로 구성됩니다.
      </p>
      <ul>
        <li><strong>JSON 데이터</strong> — 스킬, 유닛, 인카운터의 수치와 구조를 정의합니다.</li>
        <li><strong>ModularScript</strong> — JSON 내 스크립트 필드에 작성하는 텍스트 기반 행동 정의 언어입니다.</li>
      </ul>
      <p>
        ModularScript는 GlitchScript(기본 엔진)와 MT Custom Scripts(확장 레이어)로 구성됩니다.
        이 가이드의 대부분이 ModularScript 작성법을 다룹니다.
      </p>

      <h2>다음 단계</h2>
      <ul>
        <li><Link to="/getting-started/file-structure">파일 구조 상세 설명</Link></li>
        <li><Link to="/getting-started/first-skill">첫 번째 스킬 만들기</Link></li>
      </ul>
    </div>
  )
}
