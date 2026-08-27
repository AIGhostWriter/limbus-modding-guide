import CodeBlock from '../../components/CodeBlock'

export default function DynamicLocale() {
  return (
    <div>
      <h1>Dynamic Locale</h1>
      <p>
        MT Custom Scripts v21.94.4에서 추가된 기능입니다.
        스킬/패시브 설명 텍스트를 런타임에 동적으로 변경할 수 있습니다.
        두 가지 방식이 있습니다.
      </p>

      <h2>1. Text Blocks (텍스트 블록)</h2>
      <p>
        로케일 텍스트에 <code>[INDEX](content)</code> 형식으로 분기를 정의합니다.
        스크립트로 활성 경로를 전환하면 표시 텍스트가 바뀝니다.
      </p>

      <h3>로케일 텍스트 작성</h3>
      <CodeBlock
        language="json"
        code={`{
  "id": 90000001,
  "desc": "Deals +[0](50 damage)[1](50% damage)"
}`}
      />
      <p>
        경로 0 활성화 시 → <code>Deals +50 damage</code><br />
        경로 1 활성화 시 → <code>Deals +50% damage</code>
      </p>

      <h3>경로 전환 함수</h3>
      <table>
        <thead><tr><th>함수</th><th>동작</th></tr></thead>
        <tbody>
          <tr><td><code>dlactivatepath(index, ...)</code></td><td>경로 활성화</td></tr>
          <tr><td><code>dldeactivatepath(index, ...)</code></td><td>경로 비활성화</td></tr>
          <tr><td><code>dlclearallactivepaths()</code></td><td>모든 경로 비활성화</td></tr>
          <tr><td><code>dlsetonepathvalue(content, isModular, index)</code></td><td>경로 콘텐츠 교체</td></tr>
        </tbody>
      </table>

      <h3>예제: 스킬 유형 표시 전환</h3>
      <CodeBlock
        title="로케일"
        language="json"
        code={`"desc": "Attack Type: [0](Slash)[1](Pierce)[2](Blunt)"`}
      />
      <CodeBlock
        title="스크립트"
        language="text"
        code={`// 공격 타입에 따라 텍스트 전환
Modular/TIMING:WhenUse
/VALUE_0:getskilldata(Self, ModularSkill, AtkType, 0)
/IF(VALUE_0=1):dlactivatepath(0)   ← SLASH
/IF(VALUE_0=2):dlactivatepath(1)   ← PENETRATE
/IF(VALUE_0=3):dlactivatepath(2)   ← HIT`}
      />

      <h2>2. Custom Properties (커스텀 속성)</h2>
      <p>
        로케일 텍스트 안에 <code>&lt;!_&gt;</code> 형식의 태그를 넣으면
        런타임에 실제 버프 수치로 치환됩니다.
      </p>

      <h3>지원 태그</h3>
      <table>
        <thead><tr><th>태그</th><th>설명</th></tr></thead>
        <tbody>
          <tr><td><code>&lt;!POTENCY#&gt;</code></td><td>버프 효력값. #=0: 이번 턴, 1: 다음 턴, 2: 합산</td></tr>
          <tr><td><code>&lt;!COUNT#&gt;</code></td><td>버프 카운트값</td></tr>
          <tr><td><code>&lt;!NAME&gt;</code></td><td>버프 이름</td></tr>
          <tr><td><code>&lt;!inst#&gt;</code></td><td>인스턴스 ID가 #인 유닛의 이름</td></tr>
        </tbody>
      </table>

      <h3>예제</h3>
      <CodeBlock
        language="json"
        code={`{
  "desc": "Deal +<!POTENCY0>% damage"
}
// 버프의 현재 효력이 77이면 → "Deal +77% damage"`}
      />

      <h2>중첩 사용</h2>
      <p>
        Text Block 안에 Custom Properties를 함께 사용할 수 있습니다.
      </p>
      <CodeBlock
        language="json"
        code={`"desc": "On Use: [0](Gain <!POTENCY0> Power)[1](Deal <!POTENCY0> bonus damage)"`}
      />
    </div>
  )
}
