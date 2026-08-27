# 광역난사(AlphaStrike) 커스텀 유닛 적용 문서

## 개요

커스텀 보스 유닛(ID: `1814001`, abnormality-unit 타입)에 Furios(ID: 1347)의 "광역난사" 메커니즘을 적용.  
각 코인이 독립적으로 랜덤 플레이어 유닛을 타겟팅하는 스킬 패턴.

- **스킬 JSON**: `RienSoloSkills.json` — abilityScriptList에 `DealRandomTargetAmongTargetsMTFirst` 선언
- **DLL 패치**: `FireFieldForcerPlugin.cs` — `BattleActionModel.OnStartCoin` Postfix

---

## 핵심 원리

### 왜 SkillAbility.OnStartCoin이 아닌가

원본 Furios(1347)는 일반 적 유닛으로 `SkillAbility_DealRandomTargetAmongTargets.OnStartCoin`이 코인별로 호출되어 `_dealTarget`을 랜덤으로 바꾼다.

1814001은 **abnormality-unit** 타입이라 전투 경로가 다르다:

| 경로 | 원본 1347 (enemy) | 커스텀 1814001 (abnormality-unit) |
|---|---|---|
| 전투 모델 | `BattleUnitModel_Opponent` | `BattleUnitModel_Abnormality` |
| 액션 모델 | `SinActionModel_Enemy` | `SinActionModel_Abnormality_Part` |
| `SkillAbility.OnStartCoin` 호출 | ✅ | ❌ (CallerCount=0, 비정상 유닛 경로 미실행) |
| `BattleActionModel.OnStartCoin` 호출 | ✅ | ✅ (CallerCount=1, **실제 호출됨**) |

### 실제 훅 포인트

```
[코인 실행 시작]
  BattleActionModel.OnStartCoin(CoinModel coin, BATTLE_EVENT_TIMING timing)
    CallerCount = 1  →  코인 1개마다 1회 호출, abnormality 유닛에도 적용됨
    ↓ Postfix 삽입
    → unit ID 체크 (1814001)
    → skill ID 체크 (Alpha Strike 스킬 목록)
    → 살아있는 랜덤 플레이어 SinActionModel 선택
    → ChangeMainTargetSinAction() 강제 호출
  [코인 클래시 → 해당 코인은 선택된 플레이어와 1:1 결투]
```

---

## 사용된 API

| API | 타입 | 용도 |
|---|---|---|
| `BattleActionModel.Model` | Property → `BattleUnitModel` | 액션 소유 유닛 확인 |
| `BattleActionModel.GetSkillID()` | Method → `int` | 현재 스킬 ID 확인 |
| `BattleActionModel.OnStartCoin(CoinModel, BATTLE_EVENT_TIMING)` | Method, CallerCount=1 | 코인별 훅 포인트 |
| `BattleActionModel.ChangeMainTargetSinAction(SinActionModel, BattleActionModel, bool)` | Method → void | 메인 타겟 강제 변경 |
| `BattleObjectManager.GetAliveList(bool, UNIT_FACTION)` | Method → `List<BattleUnitModel>` | 살아있는 플레이어 목록 |
| `BattleUnitModel.GetSinActionList()` | Method → `List<SinActionModel>` | 플레이어 액션 슬롯 목록 |
| `SinActionModel.CurrentBattleAction` | Property → `BattleActionModel` | 플레이어 현재 전투 액션 |
| `BattleUnitModel.GetOriginUnitID()` | Method → `int` | 유닛 ID 확인 |
| `CoinModel._currentRealCoinIndex` | Field → `int` | 현재 코인 인덱스 (로그용) |

---

## 패치 코드 (`FireFieldForcerPlugin.cs`)

```csharp
[HarmonyPatch(typeof(BattleActionModel), "OnStartCoin")]
class Patch_BattleActionModel_OnStartCoin
{
    static void Postfix(BattleActionModel __instance, CoinModel coin)
    {
        try
        {
            var unit = __instance?.Model;
            if (unit == null) return;
            if (unit.GetOriginUnitID() != FireFieldForcerPlugin.TARGET_UNIT_ID) return;

            int skillId = __instance.GetSkillID();
            if (!FireFieldForcerPlugin.AlphaStrikeSkillIds.Contains(skillId)) return;

            var targetSinAction = FireFieldForcerPlugin.GetRandomAliveSinAction();
            if (targetSinAction == null) return;

            __instance.ChangeMainTargetSinAction(
                targetSinAction,
                targetSinAction.CurrentBattleAction,
                true);  // forcely = true

            FireFieldForcerPlugin.Logger.LogInfo(
                $"[AlphaStrike] skill={skillId} coinIdx={coin._currentRealCoinIndex} " +
                $"→ target={targetSinAction.UnitModel?.GetOriginUnitID()}");
        }
        catch (Exception ex)
        {
            FireFieldForcerPlugin.Logger.LogError($"[AlphaStrike.OnStartCoin] {ex.Message}");
        }
    }
}
```

### `GetRandomAliveSinAction()` 헬퍼

```csharp
public static SinActionModel GetRandomAliveSinAction()
{
    var bom = BattleObjectManager.Instance;
    if (bom == null) return null;

    var alivePlayers = bom.GetAliveList(false, UNIT_FACTION.PLAYER);
    if (alivePlayers == null || alivePlayers.Count == 0) return null;

    int startIdx = _rng.Next(alivePlayers.Count);
    for (int i = 0; i < alivePlayers.Count; i++)
    {
        var player = alivePlayers[(startIdx + i) % alivePlayers.Count];
        if (player == null) continue;

        var sinActions = player.GetSinActionList();
        if (sinActions == null || sinActions.Count == 0) continue;

        // CurrentBattleAction이 있는 슬롯 우선 (현재 전투 중인 슬롯)
        for (int j = 0; j < sinActions.Count; j++)
        {
            var sa = sinActions[j];
            if (sa?.CurrentBattleAction != null) return sa;
        }

        if (sinActions[0] != null) return sinActions[0];  // fallback
    }
    return null;
}
```

---

## 스킬 JSON 설정 (`RienSoloSkills.json`)

### Alpha Strike 스킬 조건

`DealRandomTargetAmongTargetsMTFirst`를 `abilityScriptList`에 포함한 스킬만 광역난사 동작.  
`1347AlphaStrike`는 별도 IsThat1347 패치 필요 (없어도 코인별 타겟팅은 동작).

```json
{
  "id": 18140001,
  "skillData": [{
    "targetNum": 7,
    "skillTargetType": "RANDOM",
    "abilityScriptList": [
      { "scriptName": "DealRandomTargetAmongTargetsMTFirst" },
      { "scriptName": "1347AlphaStrike" },
      { "scriptName": "EmptyBody" }
    ],
    "coinList": [ 7개 코인 ]
  }]
}
```

### 스킬별 광역난사 적용 여부

| 스킬 ID | DealRandom | Alpha Strike 패치 적용 |
|---|---|---|
| 18140001 | ✅ | ✅ |
| 18140002 | ✅ | ✅ |
| 18140003 | ❌ | ❌ |
| 18140004 | ✅ | ✅ |
| 18140005 | ✅ | ✅ |
| 18140006 | ❌ | ❌ |
| 18140007 | ✅ | ✅ |
| 18140008 | ✅ | ✅ |

18140003, 18140006은 Guard/방어 계열 스킬로 DealRandom 미포함.

---

## IsThat1347 패치 (`ScriptsFor1347.IsThat1347`)

`SkillAbility_1347AlphaStrike`가 내부적으로 `IsThat1347(BattleActionModel)` 체크를 수행.  
1814001은 ID가 1347이 아니므로 Postfix로 강제 통과시킴.

```csharp
[HarmonyPatch(typeof(ScriptsFor1347), "IsThat1347")]
class Patch_IsThat1347
{
    static void Postfix(BattleActionModel partAction, ref bool __result)
    {
        if (__result) return;
        try
        {
            if (partAction?.Model?.GetOriginUnitID() == FireFieldForcerPlugin.TARGET_UNIT_ID)
                __result = true;
        }
        catch { }
    }
}
```

---

## 빌드 및 배포

```powershell
dotnet build "C:\Users\이동혁\Desktop\FireFieldForcer\FireFieldForcer.csproj" -c Release -v minimal

Copy-Item "C:\Users\이동혁\Desktop\FireFieldForcer\bin\Release\net6.0\FireFieldForcer.dll" `
  "C:\Users\이동혁\Desktop\LIMBUS\LetheLauncher-Distribution-7\BepInEx\plugins\FireFieldForcer.dll" -Force
```

---

## 로그 확인

`BepInEx\LogOutput.log`에서 다음 패턴 확인:

```
[AlphaStrike] skill=18140001 coinIdx=0 → target=10001
[AlphaStrike] skill=18140001 coinIdx=1 → target=10004
[AlphaStrike] skill=18140001 coinIdx=2 → target=10001   ← 중복 가능 (정상)
[AlphaStrike] skill=18140001 coinIdx=3 → target=10006
```

코인마다 `target=` 값이 달라지면 광역난사 정상 동작.  
`target=` 값이 모두 동일하면 `ChangeMainTargetSinAction`이 무시되는 것 → 대안 접근 필요.

---

## 실패한 접근 방법 (시도 금지)

| 방법 | 실패 원인 |
|---|---|
| `isRandomAreaAttack: true` (JSON) | 아무 효과 없음 |
| `UnitScriptBase.AddAppendUnitScriptToBattleUnitModel<UnitScript_1347>` | abnormality-unit에서 전투 종료 시 `AccessViolationException` 크래시 |
| `ScriptsFor1347.IsThat1347` / `SkillAbility_1347AlphaStrike` 패치 단독 | 전투 중 해당 메서드 자체가 비정상 유닛에서 호출 안 됨 |
| `SkillAbility_DealRandomTargetAmongTargets.OnStartCoin` Postfix | CallerCount=0, abnormality 전투 경로에서 호출 안 됨 |
| `BattleUnitModel_Abnormality.OverwriteTargetableList` Postfix | 액션 단위(코인 무관) 1회 호출 → 코인별 랜덤화 불가 |

---

## 원본 1347 vs 커스텀 1814001 비교

| 항목 | 원본 Furios(1347) | 커스텀 1814001 |
|---|---|---|
| 유닛 타입 | enemy | abnormality-unit |
| 스킬 ID | `134711` 등 | `18140001`~`18140008` |
| 타겟 수 | 7 | 3~7 (스킬별 상이) |
| `DealRandomTargetAmongTargetsMTFirst` | ✅ JSON | ✅ JSON |
| `1347AlphaStrike` | ✅ JSON | ✅ JSON |
| `UnitScript_1347` 부착 | 자동 | ❌ 크래시 발생, 미적용 |
| 코인별 타겟팅 훅 | `SkillAbility.OnStartCoin` | `BattleActionModel.OnStartCoin` Postfix |
| `IsThat1347` 통과 | 기본 (ID=1347) | Harmony Postfix |
