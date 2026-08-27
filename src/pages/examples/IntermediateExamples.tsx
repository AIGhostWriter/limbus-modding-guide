import CodeBlock from '../../components/CodeBlock'

export default function IntermediateExamples() {
  return (
    <div>
      <h1>중급 예제</h1>
      <p>
        페이즈 전환, 멀티 조건, MTData 상태 머신 등 중급 패턴을 다룹니다.
      </p>

      <h2>2페이즈 보스</h2>
      <CodeBlock
        title="HP 50% 기준 페이즈 전환"
        language="text"
        code={`// 패시브 스크립트 (AfterSlots)
Modular/TIMING:AfterSlots
/VALUE_0:gethp(Self, %)
/VALUE_1:getmtdata(Self, Phase)
/CONTINUEIF(VALUE_0<50)
/CONTINUEIF(VALUE_1=0)

// 전환 처리
/setmtdata(Self, Phase, 1)
/destroybuff(Self, Burn, 0, All)
/buff(Self, Speed, 3, 999, 1)
/buff(Self, PowerUp, 5, 999, 1)
/replaceskillondashboard(Self, -1, 0, 90000002)
/replaceskillondashboard(Self, -1, 1, 90000003)`}
      />

      <h2>경직 연계 패턴</h2>
      <CodeBlock
        title="경직 후 강화 스킬 + 경직 카운트"
        language="text"
        code={`// OnBreak 패시브
Modular/TIMING:OnBreak
/VALUE_0:getmtdata(Self, BreakCount)
/addmtdata(Self, BreakCount, 1)

// 첫 번째 경직
/CONTINUEIF(VALUE_0=0)
/replaceskillondashboard(Self, -1, 0, 90000010)
/buff(Self, PowerUp, 10, 1, 1)

// 두 번째 경직 (MaxBreak 도달)
/CONTINUEIF(VALUE_0=1)
/replaceskillondashboard(Self, -1, 0, 90000011)
/buff(Self, Haste, 5, 999, 1)`}
      />

      <h2>공명 조건 패시브</h2>
      <CodeBlock
        title="특정 죄악 공명 시 강화"
        language="text"
        code={`Modular/TIMING:AfterSlots

// 진홍 공명 포함 여부 확인
/VALUE_0:isunitpartofreson(Self, CRIMSON)
/CONTINUEIF(VALUE_0=1)
/buff(Self, PowerUp, 3, 1, 1)

// 황금 공명 포함 여부
/VALUE_1:isunitpartofreson(Self, GOLD)
/CONTINUEIF(VALUE_1=1)
/buff(Self, Haste, 2, 1, 1)`}
      />

      <h2>누적 스택 폭발 패턴</h2>
      <CodeBlock
        title="스택 10 달성 시 폭발"
        language="text"
        code={`// WhenHit마다 스택 누적
Modular/TIMING:WhenHit/addmtdata(Self, ChargeStack, 1)

// AfterSlots에서 폭발 조건 확인
Modular/TIMING:AfterSlots
/VALUE_0:getmtdata(Self, ChargeStack)
/CONTINUEIF(VALUE_0>9)

// 폭발: 스택 소모 + 광역 버프
/setmtdata(Self, ChargeStack, 0)
/buff(Self, PowerUp, 10, 1, 1)
/buff(Self, Haste, 5, 1, 1)
/replaceskillondashboard(Self, -1, 0, 90000020)`}
      />

      <h2>Dynamic Locale 연동 텍스트</h2>
      <CodeBlock
        title="조건에 따라 텍스트 변경"
        language="text"
        code={`// 스킬 설명 텍스트 (Dynamic Locale)
// [0](5) 형식: 인덱스 0의 값이 5로 대체됨
"On Hit: Inflict [0](5) Burn (3 count)."

// VALUE_0을 통해 스택 수를 동적으로 표시할 때
// → 스크립트에서 VALUE_0 계산 후 텍스트 인덱스에 매핑`}
      />

      <h2>특정 아군 사망 감지</h2>
      <CodeBlock
        title="아군 사망 시 강화 (OnOtherDie)"
        language="text"
        code={`Modular/TIMING:OnOtherDie
/VALUE_0:getmtdata(Self, AlliesLost)
/addmtdata(Self, AlliesLost, 1)

// 2명 이상 사망 시 폭주 모드
/CONTINUEIF(VALUE_0>1)
/VALUE_1:getmtdata(Self, RageMode)
/CONTINUEIF(VALUE_1=0)
/setmtdata(Self, RageMode, 1)
/buff(Self, PowerUp, 15, 999, 1)
/buff(Self, Speed, 5, 999, 1)`}
      />
    </div>
  )
}
