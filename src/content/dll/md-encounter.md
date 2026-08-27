# How to Change the Custom Encounter

This guide explains how to replace the BOSS node battle in MDOffline with a different Lethe custom encounter.

**As of this update, this no longer requires editing or rebuilding the DLL.** The BOSS encounter ID is read at runtime from a config file.

---

## Config File

```
BepInEx/plugins/Lethe/mods/MirrorDungeon/custom_encounters/MD 던전/encounter.json
```

Just set the `MD_ID` field to whichever encounter ID you want to use for the BOSS node:

```json
{
    "MD_ID": 9381841,
    "id": 91300001,
    ...
}
```

- `MD_ID` is a custom field MDOffline reads on plugin startup — it is not a Lethe-standard field and does not affect this file's own `id`/encounter data.
- The encounter referenced by `MD_ID` must exist in some installed Lethe mod's `custom_encounters/<folder>/encounter.json` (e.g. `AlphaDulcineaV1`).
- If `MD_ID` is missing or the file doesn't exist, MDOffline falls back to the hardcoded default (`9381841`).

---

## Applying the Change

1. Close the game.
2. Edit `MD_ID` in the config file above.
3. Launch the game — no rebuild/redeploy needed.

---

## Verifying It Works

Check `BepInEx/LogOutput.log` right after launch:

```
[MDOffline] BOSS 인카운터 ID 설정 로드: MD_ID=9381841
```

After clicking the BOSS node:

```
[MDOffline] GetDungeonStage(9381841,2)=StageStaticData
```

Once you enter the battle, confirm the correct map and units are loading in the Lethe logs:

```
[Lethe] Loaded encounter data for stage 9381841 from ...AlphaDulcineaV1\custom_encounters\...
[Lethe] LoadAndAddMap called with mapID: Cp7_LamanchaAreaC_3
```

---

## Notes

- The Lethe mod containing the target encounter must be installed. Setting `MD_ID` alone does nothing without the mod present.
- If `"participantInfo"` in that encounter's `encounter.json` does not match your formation size, the battle may not start correctly.
- To revert to the original default battle, set `MD_ID` back to `9000003`.

---

## Internals (for reference — no longer needs manual editing)

`MDOfflinePlugin.ConfiguredBossEncounterId` is loaded once in `Load()` via `LoadBossEncounterConfig()` and used everywhere the BOSS encounter ID is needed:

- `InjectNodes()` — BOSS node creation
- `AllNodes()` — mock server response node list
- `PendingEncounterId` — default value
- `TrySendEnterBossNode()` — stage data lookup (`bossId` local var)
