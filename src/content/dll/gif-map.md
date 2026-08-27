# GifMapSupport

A BepInEx plugin for Limbus Company that extends Lethe's custom map system to support animated GIF files.

By default, Lethe only accepts PNG images for map elements. This plugin intercepts the sprite loading pipeline and adds GIF decoding with per-frame animation.

---

## Installation

1. Copy `GifMapSupport.dll` into `BepInEx/plugins/`.
2. Requires **Lethe** to be installed.

---

## Usage

In your custom map JSON, set the `"Image"` field to a `.gif` file path instead of `.png`:

```json
{
  "Name": "!custom_silence",
  "Walls": [
    {
      "Image": "Background.gif",
      "Position": [0, 4.2, 15],
      "Rotation": [0, 0, 0],
      "Scale": [7, 7, 1]
    }
  ],
  "Floors": [
    {
      "Image": "Floor.png",
      "Position": [0, 0, 25],
      "Rotation": [90, 0, 0],
      "Scale": [8, 20, 1]
    }
  ]
}
```

The path is resolved relative to the JSON file's directory, same as PNG files.

---

## How It Works

```
Lethe loads custom map JSON
  └─ Maps.LoadSpriteFromFile("Background.gif")
       └─ [Harmony Prefix] .gif detected
            └─ GifDecoder.Decode() — pure C# GIF89a decoder
                 ├─ Extracts all frames + per-frame delay
                 └─ Returns first frame as Sprite

  └─ SpriteRenderer.sprite = firstSprite
       └─ [Harmony Postfix on set_sprite]
            └─ GifAnimator attached to the GameObject
                 └─ Update() loop cycles frames at correct timing
```

### Harmony Patches

| Target | Purpose |
|--------|---------|
| `Lethe.Patches.Maps.LoadSpriteFromFile` | Intercepts `.gif` paths, decodes frames, returns first frame |
| `UnityEngine.SpriteRenderer.set_sprite` | Detects pending GIF and attaches `GifAnimator` to the renderer |

---

## GIF Support

| Feature | Supported |
|---------|-----------|
| GIF87a / GIF89a | Yes |
| Multiple frames (animation) | Yes |
| Per-frame delay | Yes |
| Global / local color table | Yes |
| Interlaced frames | Yes |
| Transparent color index | Yes |
| Disposal methods (0, 1, 2, 3) | Yes |
| Single-frame GIF (static) | Yes — treated as a normal sprite |

---

## Notes

- `.png` files are unaffected — they pass through Lethe's original loader unchanged.
- Frame timing uses the GIF's built-in delay values (in centiseconds). Minimum enforced delay is 20ms to avoid zero-delay infinite loops.
- The animation loops indefinitely while the map is active.

---

## Build

```powershell
dotnet build GifMapSupport.csproj -c Release
```

Output: `bin/Release/net6.0/GifMapSupport.dll`
