import CodeBlock from '../../components/CodeBlock'

export default function AdvancedExamples() {
  return (
    <div>
      <h1>고급 예제</h1>
      <p>
        DLL 연동, 복잡한 상태 머신, 멀티 유닛 조율 패턴을 다룹니다.
      </p>

      <h2>광역난사 DLL + ModularScript 연동</h2>
      <CodeBlock
        title="보스 광역 스킬 구성"
        language="json"
        code={`// 스킬 JSON: targetNum=1, canChangeTarget=true 필수
{
  "id": 90000050,
  "skillData": [{
    "targetNum": 1,
    "canChangeTarget": true,
    "atkType": "SLASH",
    "coinList": [{
      "operType": "ADD",
      "scale": 6,
      "skillScriptList": [
        "Modular/TIMING:OSA/buff(Target, Bleed, 5, 3, 0)"
      ]
    }]
  }]
}

// 광역난사 DLL 설정 (BossToPlayerIDs에 등록)
BossToPlayerIDs = new HashSet<int> { 90000050 }`}
      />

      <h2>다단계 상태 머신</h2>
      <CodeBlock
        title="Phase 0 → 1 → 2 → Final"
        language="text"
        code={`// MTData: Phase (0~3), PhaseChecked (0/1)

Modular/TIMING:AfterSlots
/VALUE_0:gethp(Self, %)
/VALUE_1:getmtdata(Self, Phase)

// Phase 0→1 (HP < 75%)
/CONTINUEIF(VALUE_0<75)
/CONTINUEIF(VALUE_1=0)
/setmtdata(Self, Phase, 1)
/buff(Self, Speed, 2, 999, 1)
/replaceskillondashboard(Self, -1, 0, 90000061)

// Phase 1→2 (HP < 40%)
/CONTINUEIF(VALUE_0<40)
/CONTINUEIF(VALUE_1=1)
/setmtdata(Self, Phase, 2)
/buff(Self, Speed, 3, 999, 1)
/buff(Self, PowerUp, 8, 999, 1)
/replaceskillondashboard(Self, -1, 0, 90000062)
/replaceskillondashboard(Self, -1, 1, 90000062)

// Phase 2→Final (HP < 10%)
/CONTINUEIF(VALUE_0<10)
/CONTINUEIF(VALUE_1=2)
/setmtdata(Self, Phase, 3)
/destroybuff(Self, Burn, 0, All)
/destroybuff(Self, Bleed, 0, All)
/buff(Self, Invincible, 1, 1, 1)
/replaceskillondashboard(Self, -1, 0, 90000099)`}
      />

      <h2>카운트다운 타이머</h2>
      <CodeBlock
        title="N라운드 후 강제 발동"
        language="text"
        code={`// RoundStart마다 카운트 감소
Modular/TIMING:RoundStart
/VALUE_0:getmtdata(Self, Countdown)
/CONTINUEIF(VALUE_0>0)
/addmtdata(Self, Countdown, -1)

// 카운트 0 도달 시 발동
/VALUE_0:getmtdata(Self, Countdown)
/CONTINUEIF(VALUE_0=0)
/setmtdata(Self, Countdown, 5)
/buff(Self, PowerUp, 20, 1, 1)
/replaceskillondashboard(Self, -1, 0, 90000070)`}
      />

      <h2>버프 스택 전이 패턴</h2>
      <CodeBlock
        title="대상의 버프를 흡수"
        language="text"
        code={`// 명중 시 대상 Burn을 흡수해 자신의 PowerUp으로 전환
Modular/TIMING:OSA
/VALUE_0:getbuff(Target, Burn, stack)
/CONTINUEIF(VALUE_0>0)
/destroybuff(Target, Burn, 0, All)
/buff(Self, PowerUp, VALUE_0, 1, 1)
// VALUE_0 스택만큼 PowerUp 획득`}
      />

      <h2>다중 타겟 조건부 스크립트</h2>
      <CodeBlock
        title="적군 버프 여부에 따른 분기"
        language="text"
        code={`Modular/TIMING:OSA
/VALUE_0:getbuff(Target, Shield, stack)

// 실드 보유 대상: 실드 제거 후 약화
/CONTINUEIF(VALUE_0>0)
/destroybuff(Target, Shield, 0, All)
/buff(Target, Weak, 3, 2, 0)

// 실드 없는 대상: 일반 디버프 (별도 동전 또는 ELSE 구조 사용)
`}
      />

      <h2>Lua 스크립트 — 복잡한 조건 로직</h2>
      <CodeBlock
        title="전투 간 상태 유지 카운터"
        language="lua"
        code={`-- Global Lua Data로 전투 횟수 추적
local count = getgdata("battleCount") or 0
count = count + 1
setgdata("battleCount", count)

-- 5번째 전투마다 보너스
if count % 5 == 0 then
  buff(Self, PowerUp, 10, 1, 1)
  log("5번째 전투 보너스 발동: " .. count)
end`}
      />

      <h2>완성 예제: 3페이즈 보스 전체 구성</h2>
      <CodeBlock
        title="abnormality-unit JSON + 패시브 스크립트 조합"
        language="json"
        code={`// abnormality-unit JSON 요약
{
  "id": 5999001,
  "hp": 8000,
  "breakSectionList": [
    { "value": 5000, "isOn": true },
    { "value": 2000, "isOn": true }
  ],
  "atkList": [
    { "id": 90000060, "defaultYn": true },
    { "id": 90000061 },
    { "id": 90000062 },
    { "id": 90000099 }
  ],
  "passiveList": [
    { "id": 90000150 }
  ]
}`}
      />
      <CodeBlock
        title="패시브 90000150 스크립트"
        language="text"
        code={`// Phase 전환 + 경직 강화 통합 패시브
// (위의 다단계 상태 머신 예제 참조)
Modular/TIMING:AfterSlots
/VALUE_0:gethp(Self, %)
/VALUE_1:getmtdata(Self, Phase)
// ... (페이즈 전환 로직)

Modular/TIMING:OnBreak
/VALUE_1:getmtdata(Self, Phase)
/CONTINUEIF(VALUE_1=1)
/buff(Self, PowerUp, 15, 2, 1)
// Phase 1 경직 시 임시 강화`}
      />
    </div>
  )
}
