import CodeBlock from '../../components/CodeBlock'

export default function BossPatterns() {
  return (
    <div>
      <h1>패턴 설계</h1>
      <p>
        보스의 행동 패턴은 패시브 스크립트로 구현합니다.
        HP 조건, 페이즈 전환, 스킬 교체 등을 조합해 복잡한 패턴을 만들 수 있습니다.
      </p>

      <h2>기본 패턴 구조</h2>
      <p>
        보스 패턴은 <code>atkList</code>에 등록된 스킬과 패시브 스크립트의 조합입니다.
        패시브에서 조건에 따라 <code>replaceskillondashboard</code>로 스킬을 교체합니다.
      </p>
      <CodeBlock
        language="text"
        code={`// 기본 패턴: 매 라운드 랜덤 스킬 선택은 자동
// 패시브로 특정 조건에 스킬 강제 지정
Modular/TIMING:AfterSlots
/VALUE_0:gethp(Self, %)
/CONTINUEIF(VALUE_0<50)
/replaceskillondashboard(Self, -1, 0, 90000002)
// HP 50% 이하이면 슬롯 0을 스킬 90000002로 교체`}
      />

      <h2>페이즈 전환</h2>
      <CodeBlock
        language="text"
        code={`// Phase 추적: MTData 활용
Modular/TIMING:AfterSlots
/VALUE_0:gethp(Self, %)
/VALUE_1:getmtdata(Self, Phase)

// Phase 0 → 1 전환 (HP 70% 이하)
/CONTINUEIF(VALUE_0<70)
/CONTINUEIF(VALUE_1=0)
/setmtdata(Self, Phase, 1)
/buff(Self, Speed, 2, 999, 1)
/replaceskillondashboard(Self, -1, 0, 90000002)

// Phase 1 → 2 전환 (HP 30% 이하)
/CONTINUEIF(VALUE_0<30)
/CONTINUEIF(VALUE_1=1)
/setmtdata(Self, Phase, 2)
/buff(Self, Speed, 3, 999, 1)
/replaceskillondashboard(Self, -1, 0, 90000003)`}
      />

      <h2>경직 후 패턴</h2>
      <CodeBlock
        language="text"
        code={`// OnBreak 타이밍: 경직 발생 시 발동
Modular/TIMING:OnBreak
/VALUE_0:getmtdata(Self, Phase)
/CONTINUEIF(VALUE_0=0)
// 첫 경직: 강화 스킬로 전환
/replaceskillondashboard(Self, -1, 0, 90000004)
/setmtdata(Self, BreakCount, 1)`}
      />

      <h2>카운트다운 패턴</h2>
      <CodeBlock
        language="text"
        code={`// 3라운드마다 특수 스킬 발동
Modular/TIMING:RoundStart
/VALUE_0:getmtdata(Self, RoundCount)
/addmtdata(Self, RoundCount, 1)
/VALUE_0:getmtdata(Self, RoundCount)
/CONTINUEIF(VALUE_0%3=0)
/replaceskillondashboard(Self, -1, 0, 90000005)
// RoundCount가 3의 배수일 때 특수 스킬 등록`}
      />

      <h2>죽음 직전 패턴</h2>
      <CodeBlock
        language="text"
        code={`// HP 10% 이하: 모든 슬롯을 최종 스킬로
Modular/TIMING:AfterSlots
/VALUE_0:gethp(Self, %)
/CONTINUEIF(VALUE_0<10)
/VALUE_1:getmtdata(Self, FinalPhase)
/CONTINUEIF(VALUE_1=0)
/setmtdata(Self, FinalPhase, 1)
/replaceskillondashboard(Self, -1, 0, 90000099)
/replaceskillondashboard(Self, -1, 1, 90000099)
/replaceskillondashboard(Self, -1, 2, 90000099)`}
      />

      <h2>동전 수 기반 조건</h2>
      <CodeBlock
        language="text"
        code={`// 현재 슬롯의 동전 승리 수 확인
Modular/TIMING:OSA
/VALUE_0:getcoinwin(Self, Total)
/CONTINUEIF(VALUE_0>2)
/buff(Target, Burn, 5, 3, 0)
// 동전 3개 이상 승리 시 추가 디버프`}
      />

      <h2>멀티 타겟 패턴 (DLL 연동)</h2>
      <p>
        광역 공격이 필요한 경우 <a href="/dll/gwangyeoknansa">광역난사 DLL</a>과 함께 사용하세요.
        스킬에 <code>targetNum: 1</code>, <code>canChangeTarget: true</code>를 유지하고
        DLL의 <code>BossToPlayerIDs</code>에 스킬 ID를 등록합니다.
      </p>
    </div>
  )
}
