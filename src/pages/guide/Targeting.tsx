import CodeBlock from '../../components/CodeBlock'

export default function Targeting() {
  return (
    <div>
      <h1>타겟팅</h1>
      <p>
        ModularScript의 타겟팅 시스템입니다. 함수의 첫 번째 파라미터로 사용됩니다.
      </p>

      <h2>기본 단일 타겟</h2>
      <table>
        <thead>
          <tr><th>값</th><th>설명</th></tr>
        </thead>
        <tbody>
          <tr><td><code>Self</code></td><td>스크립트를 실행하는 유닛 자신</td></tr>
          <tr><td><code>Target</code> / <code>MainTarget</code></td><td>현재 스킬의 주 타겟</td></tr>
          <tr><td><code>Victim</code></td><td>피격당한 유닛 (WhenHit 등)</td></tr>
          <tr><td><code>Killer</code></td><td>처치한 유닛 (OnDie 등)</td></tr>
          <tr><td><code>id#####</code></td><td>특정 유닛 ID로 직접 지정</td></tr>
          <tr><td><code>inst#####</code></td><td>인스턴스 ID로 지정</td></tr>
          <tr><td><code>adjLeft</code> / <code>adjRight</code></td><td>좌측 / 우측 인접 유닛</td></tr>
        </tbody>
      </table>

      <h2>다중 타겟</h2>
      <table>
        <thead>
          <tr><th>값</th><th>설명</th></tr>
        </thead>
        <tbody>
          <tr><td><code>EveryTarget</code></td><td>전체 유닛</td></tr>
          <tr><td><code>Ally</code></td><td>자신을 포함한 아군 전체</td></tr>
          <tr><td><code>Enemy</code></td><td>적 전체</td></tr>
          <tr><td><code>SubTarget</code></td><td>서브 타겟 목록</td></tr>
          <tr><td><code>All</code></td><td>전 유닛</td></tr>
        </tbody>
      </table>

      <h2>커스텀 타겟팅 수식어</h2>
      <p>
        수식어를 조합해 더 정교한 타겟팅이 가능합니다.
      </p>
      <CodeBlock
        language="text"
        code={`RandomEnemy          ← 무작위 적 1명
RandomEnemy3         ← 무작위 적 3명
FastestEnemy         ← 가장 빠른 적
LowestHPAlly         ← HP 비율이 가장 낮은 아군
HighestHPRatioEnemy  ← HP 비율이 가장 높은 적
ExceptSelf           ← 자신 제외`}
      />

      <h2>MT Scripts 추가 타겟팅</h2>
      <p>
        MT Scripts에서 추가된 타겟팅 유형입니다.
      </p>
      <CodeBlock
        language="text"
        code={`char[XX]    ← 캐릭터 ID XX인 유닛 (예: char[01] = Yi Sang)
not[X]      ← 특정 타겟 제외

// 단일 스킬 타겟팅
S-1         ← 티어 1 스킬
S-2-0       ← 티어 2, 인덱스 0 스킬
D-1         ← 방어 스킬 인덱스 1
ModularSkill          ← 현재 타이밍의 스킬

// 동전 타겟팅
0           ← 원본 인덱스 0번 동전
COLOR-RED   ← 첫 번째 빨간 동전
HEAD-true   ← 앞면인 동전
ACTIVE-true ← 활성 동전`}
      />

      <h2>예제</h2>
      <CodeBlock
        language="text"
        code={`// 무작위 적 2명에게 버프 적용
buff(RandomEnemy2, Burn, 3, 3, 0)

// 가장 느린 아군에게 Haste 부여
buff(SlowestAlly, Haste, 3, 1, 1)

// 자신 제외 아군 전체에 Protection
buff(Ally ExceptSelf, Protection, 2, 1, 1)`}
      />
    </div>
  )
}
