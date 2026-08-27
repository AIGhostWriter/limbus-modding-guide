# LyricsOverride

A BepInEx plugin for Limbus Company that displays custom lyrics on the battle screen.

Lyrics are played sequentially based on elapsed time, independent of the game's BGM system.

---

## Installation

Copy `LyricsOverride.dll` into `BepInEx/plugins/`.

---

## Lyrics Configuration

Lyrics are loaded from `lyrics_config.json` placed inside each encounter mod folder.

```
BepInEx/plugins/Lethe/mods/<mod-folder>/lyrics_config.json
```

Example:
```json
{
  "lyrics": [
    { "delay": 4.0,  "text": "Ten feet twenty, the Flower Man", "tempo": 0.8, "endTime": 4.0, "vocalId": 0 },
    { "delay": 8.5,  "text": "Is waiting for the touch of his hand", "tempo": 0.8, "endTime": 4.0, "vocalId": 0 },
    { "delay": 13.0, "text": "Straightening petals out without a plan", "tempo": 0.8, "endTime": 4.0, "vocalId": 0 }
  ]
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `delay` | float | Seconds after battle start before this line appears |
| `text` | string | Lyric text to display |
| `tempo` | float | Unused (internally fixed at 120f) |
| `endTime` | float | How long the line stays on screen (seconds) |
| `vocalId` | int | Vocal ID (0 = default) |

### Text Styles

TMP style tags from the game can be applied to the text.

| Tag | Color |
|-----|-------|
| none | White (default) |
| `<style="dkr">` | Dark (Korean build) |
| `<style="den">` | Dark (English build) |

---

## How It Works

```
Game Start
  └─ LyricsWatcher (DontDestroyOnLoad MonoBehaviour)
       └─ Detects BattleScene entry
            ├─ Loads BattleLyricsContoller prefab via Resources.Load
            ├─ Registers prefab into BattleEffectManager.EffectPool
            └─ Starts LyricsRunner

LyricsRunner (Update loop)
  ├─ Compares elapsed time (Time.time - startTime) against each entry's delay
  ├─ On delay reached:
  │    ├─ Sets OverrideText / OverrideVocalId
  │    └─ Calls BattleEffectManager.SetOverrideLyrics(0, 120f, endTime)
  └─ SetOverrideLyrics internally:
       ├─ Calls BattleSoundGenerator.PrintLyrics()
       │    └─ Calls BgmLyricsJsonDataList.GetLyricsData()
       │         └─ [Harmony patch] Returns OverrideText
       ├─ Displays text on screen for endTime seconds
       └─ Calls EndLyrics() to clean up

BattleScene exit
  └─ Destroys LyricsRunner, resets BattleEffectManager cache
```

### Harmony Patches

| Target | Purpose |
|--------|---------|
| `BgmLyricsJsonDataList.GetLyricsData` | Injects custom text when PrintLyrics is called |
| `BattleObjectPoolManager.AddObject` | Caches the lyrics prefab when the game registers it during boss battles |

---

## Notes

- If multiple mod folders contain a `lyrics_config.json`, all entries are merged.
- Timing is managed manually via `delay` values — write them in any order.
- The timer starts from the moment the `BattleScene` scene loads.
- In boss battles, the game's own lyrics and custom lyrics may appear simultaneously.

---

## Build

```powershell
dotnet build LyricsOverride.csproj -c Release
```

Output: `bin/Release/net6.0/LyricsOverride.dll`
