# SkillInterrupter 플러그인 문서

## 개요

스킬 JSON의 `abilityScriptList`에 `"PerCoinRandomTarget"` scriptName을 추가하는 것만으로,  
해당 스킬의 **각 코인이 독립적으로 랜덤 단일 플레이어를 타겟팅**하도록 강제 적용하는 범용 BepInEx 플러그인.

- **플러그인 ID**: `com.mod.skillinterrupter`
- **소스**: `C:\Users\이동혁\Desktop\SkillInterrupter\SkillInterrupterPlugin.cs`
- **배포 경로**: `BepInEx\plugins\SkillInterrupter.dll`
- **트리거 scriptName**: `"PerCoinRandomTarget"`

---

## 동작 원리

```
[게임 로딩 — 스킬 초기화 시]
  SkillAbility.Init(skill, scriptName, ...) Postfix
    scriptName == "PerCoinRandomTarget" 이면
    → skill.GetID()를 PerCoinTargetSkillIds HashSet에 등록

[전투 중 — 코인 1개마다]
  BattleActionModel.OnStartCoin(coin) Postfix
    GetSkillID()가 HashSet에 있으면
    → GetAliveList(UNIT_FACTION.PLAYER)에서 랜덤 SinAction 선택
    → ChangeMainTargetSinAction(sinAction, sinAction.CurrentBattleAction, forcely=true)
```

### 왜 이 훅 포인트인가

| 메서드 | CallerCount | 용도 |
|---|---|---|
| `SkillAbility.Init` | 550 | 스킬 로딩 시점 — scriptName 감지 및 캐시 등록 |
| `BattleActionModel.OnStartCoin` | 1 | 코인 실행 직전 — 타겟 교체 (비정상 유닛 포함 모든 유닛에서 호출됨) |
| `SkillAbility.OnStartCoin` | 0 | abnormality 유닛에서 미호출 → 사용 불가 |

---

## 스킬 JSON 사용법

### 최소 설정

```json
{
  "id": 18140001,
  "skillData": [{
    "targetNum": 7,
    "skillTargetType": "RANDOM",
    "abilityScriptList": [
      { "scriptName": "PerCoinRandomTarget" },
      { "scriptName": "EmptyBody" }
    ],
    "coinList": [ ... ]
  }]
}
```

`targetNum`을 코인 수와 일치시키고 `"PerCoinRandomTarget"` 추가. 다른 설정 불필요.

### 다른 어빌리티와 병용

순서 무관. 기존 어빌리티 목록에 그냥 추가하면 된다.

```json
"abilityScriptList": [
  { "scriptName": "PerCoinRandomTarget" },
  { "scriptName": "IgnoreDefenseSkill" },
  { "scriptName": "DealRandomTargetAmongTargetsMTFirst" },
  { "scriptName": "EmptyBody" }
]
```

---

## 적용 전/후 비교

| | 적용 전 (AoE) | 적용 후 (광역난사) |
|---|---|---|
| 코인 1 | 플레이어 1 | 랜덤 플레이어 (ex. 4번) |
| 코인 2 | 플레이어 2 | 랜덤 플레이어 (ex. 1번) |
| 코인 3 | 플레이어 3 | 랜덤 플레이어 (ex. 4번 재선택 가능) |
| 중복 타겟 | 없음 | 있음 (랜덤이므로 정상) |
| 유닛 타입 | enemy / abnormality 둘 다 | enemy / abnormality 둘 다 |

---

## 빌드 및 배포

```powershell
# 빌드
dotnet build "C:\Users\이동혁\Desktop\SkillInterrupter\SkillInterrupter.csproj" -c Release -v minimal

# 게임 종료 후 배포
Copy-Item "C:\Users\이동혁\Desktop\SkillInterrupter\bin\Release\net6.0\SkillInterrupter.dll" `
  "C:\Users\이동혁\Desktop\LIMBUS\LetheLauncher-Distribution-7\BepInEx\plugins\SkillInterrupter.dll" -Force
```

---

## 로그 확인

`BepInEx\LogOutput.log`에서:

```
[SkillInterrupter] Loaded. scriptName trigger: "PerCoinRandomTarget"
[SkillInterrupter] Registered skill 18140001 for per-coin random targeting
[SkillInterrupter] skill=18140001 coin=0 → unit=10003
[SkillInterrupter] skill=18140001 coin=1 → unit=10001
[SkillInterrupter] skill=18140001 coin=2 → unit=10003
[SkillInterrupter] skill=18140001 coin=3 → unit=10006
```

| 로그 | 의미 |
|---|---|
| `Registered skill XXXXX` | scriptName 감지 성공, 스킬 등록됨 |
| `coin=N → unit=XXXXX` | N번 코인이 해당 유닛을 타겟으로 선정 |
| `Registered` 없음 | scriptName 오타 또는 스킬 로딩 미실행 |
| `unit=` 값이 모두 동일 | `ChangeMainTargetSinAction`이 무시됨 → 대안 접근 필요 |

---

## 트러블슈팅

| 증상 | 원인 및 해결 |
|---|---|
| `Registered` 로그 없음 | scriptName 오타 확인 (`PerCoinRandomTarget` 대소문자 구분) |
| 코인이 모두 같은 플레이어 타겟 | `ChangeMainTargetSinAction`이 무시됨 — 해당 유닛의 전투 모델 조사 필요 |
| `[BattleActionModel.OnStartCoin]` 예외 | 예외 메시지 확인 후 원인 파악 |
| 전투 크래시 | `GetSinActionList()` 또는 `CurrentBattleAction` null 접근 — fallback 로직 확인 |
