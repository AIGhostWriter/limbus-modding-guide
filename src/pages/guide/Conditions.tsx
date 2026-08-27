import CodeBlock from '../../components/CodeBlock'

export default function Conditions() {
  return (
    <div>
      <h1>조건문 & 반복문</h1>
      <p>
        ModularScript의 분기 처리와 반복 실행 구문입니다.
      </p>

      <h2>IF</h2>
      <p>
        조건이 참일 때 결과를 실행합니다. 같은 배치 내에서만 작동합니다.
      </p>
      <CodeBlock
        language="text"
        code={`IF(VALUE_0>30):buff(Self, Haste, 2, 1, 1)
IFNOT(VALUE_0>30):healsp(Self, 5)
IF(coinstate()=1):scale(3)   ← 앞면일 때 +3`}
      />

      <h3>비교 연산자</h3>
      <table>
        <thead><tr><th>연산자</th><th>의미</th></tr></thead>
        <tbody>
          <tr><td><code>&gt;</code></td><td>초과</td></tr>
          <tr><td><code>&lt;</code></td><td>미만</td></tr>
          <tr><td><code>=</code></td><td>동일</td></tr>
        </tbody>
      </table>

      <h3>복합 조건</h3>
      <CodeBlock
        language="text"
        code={`IF(AND,VALUE_0>5,VALUE_0<10):buff(Self, Haste, 2, 1, 1)
IF(OR,VALUE_0>10,VALUE_1=1):healsp(Self, 5)
IF(XOR,VALUE_0>5,VALUE_1>5):scale(2)`}
      />

      <h2>CONTINUEIF</h2>
      <p>
        조건이 거짓이면 이후 배치 실행을 중단합니다.
        LOOP 안에서는 다음 반복으로 이동합니다.
      </p>
      <CodeBlock
        language="text"
        code={`Modular/TIMING:WhenUse/VALUE_0:getsp(Self)/CONTINUEIF(VALUE_0>20)/buff(Self, Haste, 3, 1, 1)
// SP가 20 이하이면 buff 실행 안 됨`}
      />

      <h2>LOOP</h2>
      <p>
        유닛 목록을 순회하며 <code>Target</code> 인수를 현재 유닛으로 오버라이드합니다.
      </p>
      <CodeBlock
        language="text"
        code={`Modular/TIMING:RoundStart/LOOP(EveryAlly)/buff(Target, Haste, 1, 1, 1)
// 모든 아군에게 개별적으로 Haste 적용`}
      />

      <CodeBlock
        title="LOOP + CONTINUEIF 조합"
        language="text"
        code={`Modular/TIMING:RoundStart
/LOOP(EveryAlly)
/VALUE_0:getbuff(Target, Burn, stack)
/CONTINUEIF(VALUE_0>0)
/destroybuff(Target, Burn, 0)
/buff(Target, Protection, VALUE_0, 1, 1)
// 각 아군의 화상 스택만큼 보호 부여 후 화상 제거`}
      />

      <h2>실전 예제: 스택 기반 스케일링</h2>
      <CodeBlock
        language="text"
        code={`Modular/TIMING:OSA
/VALUE_0:getbuff(Self, Sinking, stack)
/VALUE_1:math(VALUE_0*2)
/scale(VALUE_1)
// 침강 스택 × 2만큼 동전 파워 추가`}
      />
    </div>
  )
}
