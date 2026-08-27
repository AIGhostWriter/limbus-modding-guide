# FireFieldForcer 플러그인 문서

## 개요

특정 유닛이 포함된 전투에서 신클레어 필립2 전용 "불타는 배경" 시각 이펙트(`FireFieldBuff`)를 강제 적용하는 BepInEx IL2CPP 플러그인.

- **플러그인 ID**: `com.mod.firefieldforcer`
- **소스**: `C:\Users\이동혁\Desktop\FireFieldForcer\FireFieldForcerPlugin.cs`
- **배포 경로**: `BepInEx\plugins\FireFieldForcer.dll`

---

## 동작 원리

| 훅 포인트 | 역할 |
|---|---|
| `StageController.StartWave` Postfix | 웨이브 시작 시 유닛 확인 후 이펙트 최초 적용 |
| `StageController.AfterStartRound` Postfix | 매 라운드 시작마다 이펙트 유지 |
| `ScriptsFor1347.IsThat1347` Postfix | 1814001 유닛도 true 반환 → `1347AlphaStrike` 스킬어빌리티 활성화 |

타겟 유닛(ID: `1814001`)이 적 팩션에 존재할 때만 `FireFieldBuff.SetMapEffect(true)` 호출.  
또한 `IsThat1347(BattleActionModel)` 체크 시 1814001 유닛도 통과하도록 Postfix 적용.

---

## 전체 플러그인 코드

```csharp
#nullable disable
using System;
using BepInEx;
using BepInEx.Logging;
using BepInEx.Unity.IL2CPP;
using HarmonyLib;

namespace FireFieldForcer
{
    [BepInPlugin("com.mod.firefieldforcer", "FireFieldForcer", "1.0.0")]
    public class FireFieldForcerPlugin : BasePlugin
    {
        public static ManualLogSource Logger;
        const int TARGET_UNIT_ID = 1814001;  // ← 여기만 바꾸면 됨

        public override void Load()
        {
            Logger = Log;
            new Harmony("com.mod.firefieldforcer").PatchAll();
        }

        public static bool HasTargetUnit()
        {
            var bom = BattleObjectManager.Instance;
            if (bom == null) return false;
            var enemies = bom.GetModelList(UNIT_FACTION.ENEMY, false);
            if (enemies == null) return false;
            for (int i = 0; i < enemies.Count; i++)
            {
                if (enemies[i]?.GetOriginUnitID() == TARGET_UNIT_ID)
                    return true;
            }
            return false;
        }

        public static void TrySetFireField()
        {
            try
            {
                if (!HasTargetUnit()) return;
                FireFieldBuff.SetMapEffect(true);
                Logger.LogInfo("[FireFieldForcer] SetMapEffect(true) applied.");
            }
            catch (Exception ex) { Logger.LogError($"[TrySetFireField] {ex.Message}"); }
        }
    }

    // 웨이브 시작 시 (유닛 배치 완료 후) 최초 적용
    [HarmonyPatch(typeof(StageController), "StartWave")]
    class Patch_StartWave
    {
        static void Postfix() => FireFieldForcerPlugin.TrySetFireField();
    }

    // 매 라운드 시작마다 유지
    [HarmonyPatch(typeof(StageController), "AfterStartRound")]
    class Patch_AfterStartRound
    {
        static void Postfix() => FireFieldForcerPlugin.TrySetFireField();
    }

    // 1347AlphaStrike 스킬어빌리티 내부 IsThat1347 체크 시 1814001도 통과
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
}
```

---

## 타겟 유닛 변경

`TARGET_UNIT_ID` 상수만 바꾸고 빌드하면 된다:

```csharp
// 단일 유닛
const int TARGET_UNIT_ID = 9991234;

// 여러 유닛을 대상으로 할 경우 — HasTargetUnit 수정
static readonly HashSet<int> TARGET_IDS = new() { 1814001, 9991234 };

public static bool HasTargetUnit()
{
    var bom = BattleObjectManager.Instance;
    if (bom == null) return false;
    var enemies = bom.GetModelList(UNIT_FACTION.ENEMY, false);
    if (enemies == null) return false;
    for (int i = 0; i < enemies.Count; i++)
        if (TARGET_IDS.Contains(enemies[i]?.GetOriginUnitID() ?? -1))
            return true;
    return false;
}
```

---

## 빌드 및 배포

```powershell
# 빌드
dotnet build "C:\Users\이동혁\Desktop\FireFieldForcer\FireFieldForcer.csproj" -c Release -v minimal

# 게임 종료 후 배포
Copy-Item "C:\Users\이동혁\Desktop\FireFieldForcer\bin\Release\net6.0\FireFieldForcer.dll" `
  "C:\Users\이동혁\Desktop\LIMBUS\LetheLauncher-Distribution-7\BepInEx\plugins\FireFieldForcer.dll" -Force
```

---

## 이펙트 정보

`battle-effect/10.json` 기준:

| 키워드 | 프리팹 경로 |
|---|---|
| `FireFieldBuff` | `Assets/Prefab/Effect/PC/3_Sinclair/Pilip/FX_PC_3_Sinclair_Pilip2_BGBurningField1.prefab` |
| `FireFieldBuffStart` | `Assets/Prefab/Effect/PC/3_Sinclair/Pilip/FX_PC_3_Sinclair_Pilip2_BGBurningField1_Start.prefab` |
| `FireFieldUsage` | `Assets/Prefab/Effect/PC/3_Sinclair/Pilip/FX_PC_3_Sinclair_Pilip2_BGBurningField_Drain1.prefab` |

---

## 로그 확인

`BepInEx\LogOutput.log`에서:

```
[Info   :FireFieldForcer] [FireFieldForcer] Loaded. Target unit: 1814001
[Info   :FireFieldForcer] [FireFieldForcer] SetMapEffect(true) applied.
```

`SetMapEffect(true) applied`가 출력되면 호출 성공.  
시각 이펙트가 여전히 안 보이면 `InitEffectForcely()`도 추가 호출 필요 (별도 테스트 필요).

---

## 트러블슈팅

| 증상 | 원인 및 해결 |
|---|---|
| 로그에 `applied` 없음 | 타겟 유닛 ID가 틀리거나 PLAYER 팩션에 있음 → `GetModelList(PLAYER)` 도 검색 추가 |
| 로그는 찍히나 이펙트 안 보임 | `FireFieldBuff.InitEffectForcely()` 추가 호출 필요 |
| `[TrySetFireField]` 에러 | `FireFieldBuff.BuffInstance`가 null → 예외 무시하고 계속 진행 중 |
