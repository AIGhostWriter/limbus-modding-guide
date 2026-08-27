# 광역난사 (GwangYeokNansa) 플러그인 적용 가이드

> 코인 단위 무작위 타겟팅 — 퓨리오스(Furioso) 메커니즘 구현

---

## 📁 파일 목록

| 파일 | 위치 | 설명 |
|---|---|---|
| `GwangYeokNansa.dll` | `BepInEx/plugins/` | 플러그인 본체 |
| `광역난사 테스트/` | `BepInEx/plugins/Lethe/mods/` | 테스트 인카운터 모드 |

---

## 1. DLL 배포

```
GwangYeokNansa.dll
  → LetheLauncher-Distribution-7/BepInEx/plugins/GwangYeokNansa.dll
```

이미 배포되어 있음. 게임 재시작 시 자동 로드.

---

## 2. 테스트 인카운터 확인

`BepInEx/plugins/Lethe/mods/광역난사 테스트/` 폴더가 있어야 합니다.

```
광역난사 테스트/
├── custom_encounters/광역난사 테스트/
│   ├── encounter.json          ← 인카운터 ID: 599901
│   └── subchapterui.json
├── custom_limbus_data/
│   ├── skill/gwangyeoknansa_skill.json      ← 스킬 ID: 90000001
│   └── abnormality-unit/gwangyeoknansa_unit.json  ← 유닛 ID: 5999001
└── custom_limbus_locale/EN/skillList/
    └── gwangyeoknansa_skillnames.json
```

---

## 3. 인게임 진입

1. 게임 실행
2. `BepInEx/LogOutput.log` 에서 아래 로그 확인

```
[Info  : 광역난사] 플러그인 로드 완료.
```

3. Lethe 모드 인카운터 목록에서 **"광역난사 테스트"** (encounter ID 599901) 선택
4. 참여 인원 4명으로 진입

---

## 4. 동작 확인

전투 중 보스(유닛 5999001)가 스킬 `90000001`을 사용하면:

- **코인 1타** → 무작위 아군 1명에게 피격 모션 + 데미지
- **코인 2타** → 다른 무작위 아군 1명에게 피격 모션 + 데미지
- **로그 출력** (LogOutput.log):

```
[Info  : 광역난사] skill=90000001 coin=0 targetFaction=PLAYER
[Info  : 광역난사] coin=0 → 타겟: 10011 (예: 파우스트)
[Info  : 광역난사] skill=90000001 coin=1 targetFaction=PLAYER
[Info  : 광역난사] coin=1 → 타겟: 10091 (예: 돈키호테)
```

---

## 5. 신규 스킬에 적용하는 방법

### 5-1. JSON 스킬 설정 필수 조건

```json
{
  "id": 90000001,
  "skillData": [{
    "targetNum": 1,
    "canChangeTarget": true,
    "coinList": [ ... ]
  }]
}
```

> ⚠️ `targetNum`은 반드시 `1`이어야 합니다.
> `targetNum > 1`이면 스킬 시작 시 모든 적이 동시에 피격 모션을 취하는 버그가 재발합니다.

### 5-2. 플러그인에 스킬 ID 등록

`광역난사Plugin.cs` 의 두 HashSet 중 하나에 추가합니다.

**보스 → 아군 방향** (적이 플레이어를 공격):

```csharp
internal static readonly HashSet<int> BossToPlayerIDs = new()
{
    90000001,   // 기존
    90000002,   // 추가할 스킬
};
```

**아군 → 적 방향** (플레이어가 적을 공격):

```csharp
internal static readonly HashSet<int> PlayerToEnemyIDs = new()
{
    19999901,   // 추가할 스킬
};
```

### 5-3. 빌드 및 배포

```powershell
# 빌드
dotnet build "C:\Users\이동혁\Desktop\LIMBUS\광역난사\광역난사.csproj" -c Release -v minimal

# 배포 (게임 종료 후 실행)
Copy-Item "C:\Users\이동혁\Desktop\LIMBUS\광역난사\bin\Release\net6.0\GwangYeokNansa.dll" `
  "C:\Users\이동혁\Desktop\LIMBUS\LetheLauncher-Distribution-7\BepInEx\plugins\GwangYeokNansa.dll" -Force
```

---

## 6. ID 충돌 방지 참고표

| 범위 | 용도 |
|---|---|
| `101375` | 원본 Rien 퓨리오스 (건드리지 말 것) |
| `90000001` | 광역난사 테스트 보스 전용 독립 스킬 |
| `19999901~03` | 플레이어 향 광역난사 예시 (미사용) |
| `5999001` | 광역난사 테스트 보스 유닛 |
| `599901` | 광역난사 테스트 인카운터 |

---

## 7. 트러블슈팅

| 증상 | 원인 | 해결 |
|---|---|---|
| 여전히 동시 피격 모션 | `targetNum` 이 1이 아님 | JSON에서 `"targetNum": 1` 확인 |
| 보스가 스킬을 하나도 못 가짐 | 스킬 ID가 `attributeList`에 없음 | `abnormality-unit` JSON의 `attributeList` 확인 |
| 로그에 플러그인 로드 메시지 없음 | DLL이 plugins 폴더에 없음 | 배포 경로 재확인 |
| 타겟이 바뀌지 않음 | 스킬 ID가 RegisteredIDs에 없음 | `BossToPlayerIDs` 또는 `PlayerToEnemyIDs`에 추가 후 재빌드 |
| `[광역난사] 타겟 가능 유닛 없음.` 경고 | 해당 진영 생존 유닛 없음 | 정상 동작 (타겟 변경 건너뜀) |

---

## 8. 소스 파일 위치

```
C:\Users\이동혁\Desktop\LIMBUS\광역난사\
├── 광역난사.csproj
├── 광역난사Plugin.cs       ← 메인 소스
├── SkillTemplate.json      ← 스킬 JSON 참고 템플릿
└── 광역난사_적용가이드.md  ← 이 문서
```
