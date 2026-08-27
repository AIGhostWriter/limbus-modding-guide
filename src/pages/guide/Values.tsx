import CodeBlock from '../../components/CodeBlock'

export default function Values() {
  return (
    <div>
      <h1>VALUE 시스템</h1>
      <p>
        ModularScript는 VALUE_0부터 VALUE_9까지 10개의 임시 정수 변수를 제공합니다.
        배치 내에서 값을 저장하고, 이후 배치에서 참조합니다.
      </p>

      <h2>기본 할당</h2>
      <CodeBlock
        language="text"
        code={`VALUE_0:5                      ← 정수 직접 할당
VALUE_1:getsp(Self)           ← 획득자 함수 결과
VALUE_2:math(VALUE_0+VALUE_1) ← 수식 계산
VALUE_3:random(1, 6)          ← 무작위 정수`}
      />

      <h2>참조</h2>
      <p>
        할당된 VALUE는 이후 배치의 어느 위치에서나 그대로 사용합니다.
      </p>
      <CodeBlock
        language="text"
        code={`Modular
/VALUE_0:getbuff(Self, Burn, stack)
/buff(Self, Protection, VALUE_0, 1, 1)
// 화상 스택 수만큼 Protection 부여`}
      />

      <h2>수학 연산 (math)</h2>
      <table>
        <thead><tr><th>기호</th><th>연산</th><th>예시</th></tr></thead>
        <tbody>
          <tr><td><code>+</code></td><td>덧셈</td><td><code>math(VALUE_0+3)</code></td></tr>
          <tr><td><code>-</code></td><td>뺄셈</td><td><code>math(VALUE_0-1)</code></td></tr>
          <tr><td><code>*</code></td><td>곱셈</td><td><code>math(VALUE_0*2)</code></td></tr>
          <tr><td><code>%</code></td><td>나눗셈 (정수)</td><td><code>math(VALUE_0%3)</code></td></tr>
          <tr><td><code>?</code></td><td>나머지 (modulo)</td><td><code>math(VALUE_0?3)</code></td></tr>
          <tr><td><code>!</code></td><td>최솟값</td><td><code>math(VALUE_0!10)</code> → 10 초과면 10</td></tr>
          <tr><td><code>¡</code></td><td>최댓값</td><td><code>math(VALUE_0¡1)</code> → 1 미만이면 1</td></tr>
        </tbody>
      </table>

      <h2>실전 패턴</h2>

      <h3>스택 기반 스케일링</h3>
      <CodeBlock
        language="text"
        code={`Modular/TIMING:OSA
/VALUE_0:getbuff(Self, Sinking, stack)
/VALUE_1:math(VALUE_0*3)
/scale(VALUE_1)
// 침강 스택 × 3만큼 동전 파워 추가`}
      />

      <h3>조건부 상한 적용</h3>
      <CodeBlock
        language="text"
        code={`Modular/TIMING:WhenUse
/VALUE_0:getbuff(Self, Burn, stack)
/VALUE_1:math(VALUE_0!5)
/scale(VALUE_1)
// 화상 스택이 5를 넘으면 5로 제한`}
      />

      <h3>카운터 증가 (MTData 연동)</h3>
      <CodeBlock
        language="text"
        code={`Modular/TIMING:OSA
/VALUE_0:getmtdata(Self, HitCount)
/VALUE_1:math(VALUE_0+1)
/setmtdata(Self, HitCount, VALUE_1)
/VALUE_2:math(VALUE_1?3)
/CONTINUEIF(VALUE_2=0)
/buff(Self, Haste, 3, 1, 1)
// 3번 명중마다 Haste 부여`}
      />

      <h2>주의사항</h2>
      <ul>
        <li>VALUE는 정수만 저장합니다. 소수점은 버려집니다.</li>
        <li>배치 실행 순서에 따라 값이 덮어써질 수 있습니다. VALUE 인덱스를 목적별로 구분하세요.</li>
        <li>LOOP 안에서 VALUE는 반복마다 재계산됩니다.</li>
      </ul>
    </div>
  )
}
