import CodeBlock from '../../components/CodeBlock'
import { Callout, SourceNote } from '../../components/GuideBlocks'

export default function MTData() {
  return (
    <div>
      <h1>MTData 시스템</h1>
      <p>
        MT Custom Scripts가 제공하는 영속 데이터 저장소입니다.
        유닛별, 소스별로 값을 저장하고 조회할 수 있습니다.
        전투 중 상태 추적, 카운터 구현, 페이즈 전환 등에 활용합니다.
      </p>

      <h2>기본 사용법</h2>
      <CodeBlock
        language="text"
        code={`// 저장
setmtdata(Self, HitCount, VALUE_0)

// 조회
VALUE_0:getmtdata(Self, HitCount)`}
      />

      <h2>setmtdata</h2>
      <CodeBlock
        language="text"
        code={`setmtdata(target, dataID, value, dataSource?)`}
      />
      <table>
        <thead><tr><th>파라미터</th><th>설명</th></tr></thead>
        <tbody>
          <tr><td><code>target</code></td><td>데이터를 저장할 유닛</td></tr>
          <tr><td><code>dataID</code></td><td>데이터 키 이름 (임의 문자열)</td></tr>
          <tr><td><code>value</code></td><td>저장할 값 (정수 또는 VALUE)</td></tr>
          <tr><td><code>dataSource</code></td><td>(선택) 데이터 소스 구분자</td></tr>
        </tbody>
      </table>

      <Callout title="dataSource를 생략해도 되는가?" tone="warning">
        <p>작은 예제에서는 생략할 수 있지만, 여러 패시브가 같은 <code>dataID</code>를 쓸 가능성이 있으면 출처를 지정하세요. 예: <code>HitCount</code> 대신 <code>WorkshopPassive, HitCount</code>처럼 네임스페이스를 분리하면 충돌을 줄일 수 있습니다.</p>
      </Callout>

      <h2>getmtdata</h2>
      <CodeBlock
        language="text"
        code={`VALUE_0:getmtdata(target, dataID, dataSource?)`}
      />

      <h2>String Replacement</h2>
      <p>
        MTData 값을 텍스트 안에 직접 삽입할 수 있습니다.
        <code>[DataID]</code> 형태로 사용하면 해당 MTData 값으로 치환됩니다.
      </p>
      <CodeBlock
        language="text"
        code={`setmtdata(Self, Phase, 2)
scale([Phase])     ← VALUE_2가 아닌 MTData "Phase"의 값 2로 치환`}
      />

      <h2>실전 예제: 공격 횟수 추적</h2>
      <CodeBlock
        language="text"
        code={`// 스킬 사용 시 카운터 증가
Modular/TIMING:WhenUse
/VALUE_0:getmtdata(Self, AtkCount)
/VALUE_1:math(VALUE_0+1)
/setmtdata(Self, AtkCount, VALUE_1)

// 3회 공격마다 보너스 부여
/VALUE_2:math(VALUE_1?3)    ← 3으로 나눈 나머지
/CONTINUEIF(VALUE_2=0)
/buff(Self, Haste, 3, 1, 1)`}
      />

      <h2>comparer</h2>
      <p>
        MTData 값과 비교하는 편의 함수입니다.
      </p>
      <CodeBlock
        language="text"
        code={`// 사용법: comparer(target, compareValue, operator, dataID, dataSource?)
// 반환: 1=참, 0=거짓
// operator: =(같음), >(포함), <(미포함)

/VALUE_0:comparer(Self, 3, =, Phase)/
/IF(VALUE_0=1):buff(Self, Haste, 5, 1, 1)/`}
      />

      <h2>값의 수명과 초기화</h2>
      <ul>
        <li>MTData는 VALUE처럼 한 번 실행 후 자동 초기화되는 임시값이 아닙니다.</li>
        <li>라운드별 카운터라면 <code>RoundStart</code> 또는 <code>RoundEnd</code>에서 명시적으로 0을 저장하세요.</li>
        <li>동일 유닛의 여러 효과가 같은 키를 공유하지 않도록 dataSource를 구분하세요.</li>
        <li>먼저 <code>log()</code>로 조회값을 확인한 뒤 전력이나 피해 계산에 연결하세요.</li>
      </ul>
      <SourceNote href="https://rentry.co/mtcustomscripts" label="MT's Custom Scripts 원문" />
    </div>
  )
}
