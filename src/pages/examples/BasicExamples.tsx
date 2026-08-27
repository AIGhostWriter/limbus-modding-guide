import CodeBlock from '../../components/CodeBlock'

export default function BasicExamples() {
  return (
    <div>
      <h1>기초 예제</h1>
      <p>
        GlitchScript와 MT Custom Scripts의 기본 패턴을 실전 예제로 정리합니다.
      </p>

      <h2>버프 부여</h2>
      <CodeBlock
        title="동전 명중 시 속도 버프"
        language="text"
        code={`Modular/TIMING:OSA/buff(Self, Haste, 2, 1, 1)
// OSA = On Slot Attack (동전 명중 시)
// buff(대상, 버프명, 양, 지속 횟수, 자신 스택 여부)`}
      />
      <CodeBlock
        title="스킬 사용 시 피아 동시 버프"
        language="text"
        code={`Modular/TIMING:WhenUse
/buff(Self, PowerUp, 2, 1, 1)
/buff(Target, Bleed, 3, 3, 0)`}
      />

      <h2>조건부 실행</h2>
      <CodeBlock
        title="HP 50% 이하일 때만 발동"
        language="text"
        code={`Modular/TIMING:AfterSlots
/VALUE_0:gethp(Self, %)
/CONTINUEIF(VALUE_0<50)
/buff(Self, Speed, 3, 1, 1)`}
      />
      <CodeBlock
        title="특정 버프 보유 시 추가 효과"
        language="text"
        code={`Modular/TIMING:OSA
/VALUE_0:getbuff(Self, Burn, stack)
/CONTINUEIF(VALUE_0>0)
/buff(Target, Burn, 2, 2, 0)
// Burn 스택이 1 이상이면 추가 Burn 부여`}
      />

      <h2>VALUE 변수 활용</h2>
      <CodeBlock
        title="라운드 카운터"
        language="text"
        code={`// 패시브: 라운드마다 VALUE_0 증가
Modular/TIMING:RoundStart/addvalue(0, 1)

// 스킬: VALUE_0이 3 이상이면 강화 효과
Modular/TIMING:WhenUse
/CONTINUEIF(VALUE_0>2)
/buff(Self, PowerUp, 5, 1, 1)
/setvalue(0, 0)
// 조건 충족 후 리셋`}
      />

      <h2>MTData 활용</h2>
      <CodeBlock
        title="유닛별 독립 카운터"
        language="text"
        code={`// 명중할 때마다 히트 카운트 누적
Modular/TIMING:OSA/addmtdata(Self, HitCount, 1)

// 히트 카운트 5 달성 시 보너스
Modular/TIMING:OSA
/VALUE_0:getmtdata(Self, HitCount)
/CONTINUEIF(VALUE_0>4)
/buff(Self, PowerUp, 3, 1, 1)
/setmtdata(Self, HitCount, 0)`}
      />

      <h2>버프 제거</h2>
      <CodeBlock
        title="자신의 디버프 제거"
        language="text"
        code={`// Burn 전체 제거
Modular/TIMING:RoundStart/destroybuff(Self, Burn, 0, All)

// 특정 스택만 제거
Modular/TIMING:WhenUse/destroybuff(Self, Tremor, 3, One)`}
      />

      <h2>동전 결과 기반 분기</h2>
      <CodeBlock
        title="동전 승리 수에 따른 분기"
        language="text"
        code={`Modular/TIMING:EndSkill
/VALUE_0:getcoinwin(Self, Total)

// 3승 이상: 강화 효과
/CONTINUEIF(VALUE_0>2)
/buff(Self, Haste, 3, 2, 1)

// 아니면: 일반 효과 (별도 스크립트로)
`}
      />
    </div>
  )
}
