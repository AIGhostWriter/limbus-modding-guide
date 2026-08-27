import CodeBlock from '../../components/CodeBlock'
import { GuideIntro, Callout, Steps, SourceNote } from '../../components/GuideBlocks'

export default function ScriptStructure() {
  return <div>
    <h1>GlitchScript 실행 구조</h1>
    <GuideIntro eyebrow="Core syntax">ModularScript는 슬래시로 나뉜 배치를 왼쪽에서 오른쪽으로 실행합니다. 한 줄을 외우기보다 “언제 → 무엇을 읽고 → 어떤 조건에서 → 무엇을 바꿀지” 네 단계로 해석하세요.</GuideIntro>
    <h2>한 줄을 해부해 보기</h2>
    <CodeBlock language="text" code={`Modular
/TIMING:WhenUse
/CLEARVALUES
/VALUE_0:getsp(Self)
/CONTINUEIF(VALUE_0>29)
/buff(Self, Haste, 2, 0, 1)`} />
    <table><thead><tr><th>배치</th><th>역할</th><th>해석</th></tr></thead><tbody>
      <tr><td><code>Modular</code></td><td>스크립트 선언</td><td>이 문자열을 Modular 엔진으로 처리</td></tr>
      <tr><td><code>TIMING:WhenUse</code></td><td>발동 시점</td><td>스킬을 사용할 때 한 번 실행</td></tr>
      <tr><td><code>CLEARVALUES</code></td><td>초기화</td><td>이전 실행의 VALUE를 모두 0으로 정리</td></tr>
      <tr><td><code>VALUE_0:getsp(Self)</code></td><td>정보 조회</td><td>자신의 정신력을 VALUE_0에 저장</td></tr>
      <tr><td><code>CONTINUEIF(...)</code></td><td>실행 게이트</td><td>SP가 30 미만이면 이후 배치를 중단</td></tr>
      <tr><td><code>buff(...)</code></td><td>결과</td><td>자신에게 다음 턴 신속 2 부여</td></tr>
    </tbody></table>
    <Callout title="타이밍은 마지막 선언이 적용됨" tone="warning"><p>한 스크립트에 <code>TIMING</code>을 여러 번 넣으면 모두 등록되는 것이 아니라 마지막 타이밍이 기준이 됩니다. 서로 다른 시점의 효과는 스크립트 문자열을 분리하세요.</p></Callout>
    <h2>메인 배치의 종류</h2>
    <table><thead><tr><th>배치</th><th>용도</th><th>언제 필요한가</th></tr></thead><tbody>
      <tr><td><code>TIMING:name</code></td><td>발동 시점 선택</td><td>거의 모든 스크립트</td></tr>
      <tr><td><code>LOOP:targets</code></td><td>대상 목록 순회</td><td>각 유닛을 따로 검사해야 할 때</td></tr>
      <tr><td><code>LUA</code> / <code>LUAMAIN</code></td><td>외부 Lua 호출</td><td>테이블·복합 로직·재사용 함수</td></tr>
      <tr><td><code>CLEARVALUES</code></td><td>VALUE 초기화</td><td>패시브처럼 반복 실행되는 스크립트</td></tr>
      <tr><td><code>RESETWHENUSE</code></td><td>수치 수정 초기화</td><td>scale/base/final 누적 방지</td></tr>
      <tr><td><code>EXPECTED</code></td><td>예측 전력 계산 반영</td><td>대시보드 예상값에도 효과를 보여줄 때</td></tr>
    </tbody></table>
    <h2>IF와 CONTINUEIF 선택</h2>
    <CodeBlock language="text" title="효과 하나만 조건부 실행" code={`/IF(VALUE_0>29):buff(Self,Haste,2,0,1)
/healsp(Self,5)`} />
    <p>위 코드는 조건과 관계없이 두 번째 배치의 정신력 회복을 실행합니다.</p>
    <CodeBlock language="text" title="이후 전체 흐름 중단" code={`/CONTINUEIF(VALUE_0>29)
/buff(Self,Haste,2,0,1)
/healsp(Self,5)`} />
    <p>위 코드는 조건이 거짓이면 버프와 정신력 회복을 모두 건너뜁니다.</p>
    <h2>복합 예제: 가장 느린 아군 지원</h2>
    <Steps items={[
      { title: '대상 결정', body: 'SlowestAlly로 현재 가장 느린 아군 한 명을 선택합니다.' },
      { title: '현재 속도 조회', body: 'getspeed 결과를 VALUE_0에 저장합니다.' },
      { title: '조건 확인', body: '속도가 4 이하일 때만 다음 결과로 진행합니다.' },
      { title: '다음 턴 버프 부여', body: '신속 3을 다음 라운드에 활성화합니다.' },
    ]} />
    <CodeBlock language="text" code={`Modular/TIMING:RoundStart/CLEARVALUES
/VALUE_0:getspeed(SlowestAlly,normal)
/CONTINUEIF(VALUE_0<5)
/buff(SlowestAlly,Haste,3,0,1)`} />
    <h2>작성 체크리스트</h2>
    <ul><li>사용한 TIMING이 스킬·패시브·버프 중 현재 데이터에서 지원되는가?</li><li>획득자 결과를 사용하기 전에 VALUE에 할당했는가?</li><li>Single-Target과 Multi-Target 인자를 구분했는가?</li><li>반복 실행 시 VALUE와 누적 수치를 초기화해야 하는가?</li><li>복합 코드 전에 <code>log()</code>로 타이밍을 검증했는가?</li></ul>
    <SourceNote href="https://rentry.co/glitchscript" label="GlitchScript 원문" />
  </div>
}
