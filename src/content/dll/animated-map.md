# AnimatedMapSupport — 모드 개발 가이드

커스텀 맵에 MP4 영상, GIF, 아이들 애니메이션, 트리거, Lua 스크립팅, 웨이포인트 이동을 추가하는 방법을 설명합니다.

---

## 목차

1. [파일 구조](#1-파일-구조)
2. [JSON 기본 필드](#2-json-기본-필드)
3. [미디어 타입](#3-미디어-타입)
4. [Idle 애니메이션](#4-idle-애니메이션)
5. [Trigger 시스템](#5-trigger-시스템)
6. [Trigger Action 목록](#6-trigger-action-목록)
7. [웨이포인트 이동](#7-웨이포인트-이동)
8. [패럴랙스](#8-패럴랙스)
9. [이징 함수 목록](#9-이징-함수-목록)
10. [Lua 스크립팅](#10-lua-스크립팅)
11. [전체 예제](#11-전체-예제)

---

## 1. 파일 구조

```
mods/load/custom_maps/
└── MyMap/
    ├── my_map.json     ← 맵 설정 (필수)
    ├── map.lua         ← Lua 스크립트 (선택)
    ├── background.mp4  ← 영상 배경
    ├── logo.gif        ← GIF 애니메이션
    └── icon.png        ← 정적 이미지
```

Image 경로는 JSON 파일 기준 **상대 경로**로 지정합니다.

---

## 2. JSON 기본 필드

```json
{
  "Name": "!custom_mymap",
  "LuaScript": "map.lua",
  "Walls": [ ... ],
  "Floors": [ ... ]
}
```

| 필드 | 타입 | 설명 |
|---|---|---|
| `Name` | string | 맵 식별자. Lethe의 맵 이름과 일치해야 함 (`!custom_` 접두사 권장) |
| `LuaScript` | string | Lua 파일명 (생략 시 Lua 없음) |
| `Walls` | 배열 | 벽 오브젝트 목록 |
| `Floors` | 배열 | 바닥 오브젝트 목록 |

### 오브젝트 공통 필드

```json
{
  "Id": "bg",
  "Image": "background.mp4",
  "Position": [0, -15, 25],
  "Rotation": [0, 0, 0],
  "Scale": [10, 10, 1],
  "Alpha": 1.0,
  "Color": [1.0, 1.0, 1.0],
  "SortOrder": 0,
  "Loop": true,
  "Speed": 1.0,
  "Muted": true,
  "AutoPlay": true
}
```

| 필드 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `Id` | string | Image 경로 | Lua에서 이 ID로 오브젝트를 참조 |
| `Image` | string | — | 파일 경로 (PNG, JPG, GIF, MP4, WebM, 또는 폴더) |
| `Position` | [x, y, z] | [0, 0, 0] | 로컬 위치 |
| `Rotation` | [x, y, z] | [0, 0, 0] | 오일러 각도 |
| `Scale` | [x, y, z] | [1, 1, 1] | 로컬 스케일 |
| `Alpha` | float | 1.0 | 투명도 (0 = 완전 투명, 1 = 불투명) |
| `Color` | [r, g, b] | [1, 1, 1] | 색조 (0.0 ~ 1.0) |
| `SortOrder` | int | 0 | 렌더링 순서 (높을수록 앞) |
| `Loop` | bool | true | GIF/영상 반복 |
| `Speed` | float | 1.0 | 재생 속도 배율 |
| `Muted` | bool | true | 영상 음소거 |
| `AutoPlay` | bool | true | 자동 재생 |

---

## 3. 미디어 타입

### PNG / JPG — 정적 이미지

```json
{
  "Id": "logo",
  "Image": "logo.png",
  "Position": [0, 3, 0],
  "Scale": [2, 2, 1]
}
```

### GIF — 애니메이션 이미지

```json
{
  "Id": "anim",
  "Image": "effect.gif",
  "Position": [0, 0, 0],
  "Scale": [3, 3, 1],
  "Speed": 1.5,
  "Loop": true
}
```

### MP4 / WebM / MOV — 영상

```json
{
  "Id": "bg",
  "Image": "background.mp4",
  "Position": [0, -15, 25],
  "Scale": [10, 10, 1],
  "Loop": true,
  "Muted": true,
  "AutoPlay": true,
  "SortOrder": -10
}
```

### PNG 시퀀스 폴더

폴더 안에 `001.png`, `002.png`, ... 처럼 이름 순서로 정렬된 PNG/JPG를 넣으면 프레임 애니메이션으로 재생됩니다.

```json
{
  "Id": "explosion",
  "Image": "explosion_frames",
  "Speed": 24.0,
  "Loop": false
}
```

> `Speed`가 초당 프레임 수(FPS)로 사용됩니다. 기본값은 12 FPS입니다.

---

## 4. Idle 애니메이션

오브젝트에 지속적으로 반복되는 애니메이션을 추가합니다. Trigger로 발동되는 트윈과는 별개로 항상 실행됩니다.

### float — 위아래/좌우 부유

```json
"Idle": {
  "Type": "float",
  "Axis": [0, 1, 0],
  "Amplitude": 0.3,
  "Period": 2.5,
  "Offset": 0
}
```

| 필드 | 설명 |
|---|---|
| `Axis` | 이동 방향 벡터. `[0,1,0]` = Y축(위아래), `[1,0,0]` = X축(좌우) |
| `Amplitude` | 진폭 (유닛 단위) |
| `Period` | 주기 (초) |
| `Offset` | 초기 위상 오프셋 (초) |

### rotate — 연속 회전

```json
"Idle": {
  "Type": "rotate",
  "Speed": 45.0
}
```

`Speed`는 초당 회전 각도(deg/s)입니다.

Z축 기준으로 회전합니다. `Speed`를 음수로 주면 반대 방향으로 회전합니다.

### pulse — 크기 맥동

```json
"Idle": {
  "Type": "pulse",
  "Amplitude": 0.15,
  "Period": 1.8
}
```

`1 ± Amplitude` 범위로 스케일이 사인파 형태로 진동합니다.

### uvScroll — 텍스처 스크롤

GIF/MP4에는 효과 없음. 머티리얼이 있는 오브젝트에 사용하세요.

```json
"Idle": {
  "Type": "uvScroll",
  "ScrollSpeed": [0.1, 0.0]
}
```

`ScrollSpeed`는 `[u방향_속도, v방향_속도]`입니다.

### colorCycle — 색상 순환

```json
"Idle": {
  "Type": "colorCycle",
  "Period": 4.0,
  "Colors": [
    [1.0, 0.3, 0.3],
    [0.3, 1.0, 0.3],
    [0.3, 0.3, 1.0]
  ]
}
```

`Colors` 배열을 `Period`초 동안 순환하며 보간합니다.

---

## 5. Trigger 시스템

게임 이벤트에 반응해서 Action을 실행합니다. 하나의 오브젝트에 여러 트리거를 배열로 설정할 수 있습니다.

```json
"Triggers": [
  { "On": "이벤트명", ...이벤트_옵션..., "Action": "액션명", ...액션_옵션... },
  { "On": "BattleStart", "Action": "fadeIn", "Duration": 1.5 }
]
```

### 이벤트 종류

#### BattleStart — 배틀 시작

```json
{ "On": "BattleStart", "Action": "fadeIn", "Duration": 1.0, "Ease": "sineOut" }
```

#### BattleEnd — 배틀 종료

```json
{ "On": "BattleEnd", "Action": "fadeOut", "Duration": 2.0, "Ease": "sineIn" }
```

#### TurnStart / TurnEnd — 매 턴 시작/종료

```json
{ "On": "TurnEnd", "Action": "shake", "Duration": 0.3, "Magnitude": 0.2 }
```

`Every` 필드로 N턴마다 한 번만 실행할 수 있습니다.

```json
{
  "On": "TurnEnd",
  "Every": 3,
  "Action": "scaleTo",
  "To": [1.5, 1.5, 1],
  "Duration": 0.5,
  "Ease": "outBack"
}
```

`Every: 3`이면 턴 번호가 0, 3, 6, 9, ... 일 때 실행됩니다.

#### EnemyHPBelow — 적 HP 임계값 이하

적 중 하나의 HP가 임계값 이하로 떨어지면 **처음 한 번만** 실행됩니다.

```json
{
  "On": "EnemyHPBelow",
  "Threshold": 0.5,
  "Action": "colorTo",
  "Color": [1.0, 0.2, 0.2],
  "Duration": 1.5,
  "Ease": "sineOut"
}
```

`Threshold`는 0.0 ~ 1.0 범위의 HP 비율입니다. (0.5 = 50%)

#### EnemyDie — 적 사망

```json
{ "On": "EnemyDie", "Action": "shake", "Duration": 0.8, "Magnitude": 0.5 }
```

#### Time — 배틀 경과 시간

배틀 시작 후 `After`초가 지나면 **한 번만** 실행됩니다.

```json
{
  "On": "Time",
  "After": 10.0,
  "Action": "moveTo",
  "To": [3, 0, 0],
  "Duration": 2.0,
  "Ease": "sineInOut"
}
```

---

## 6. Trigger Action 목록

### moveTo — 위치 이동

```json
{ "Action": "moveTo", "To": [3.0, 1.0, 0], "Duration": 1.2, "Ease": "sineInOut", "Loop": "once" }
```

### moveBy — 현재 위치에서 상대 이동

```json
{ "Action": "moveBy", "By": [2.0, 0, 0], "Duration": 0.8, "Ease": "outCubic" }
```

### scaleTo — 스케일 설정

```json
{ "Action": "scaleTo", "To": [2.0, 2.0, 1], "Duration": 0.5, "Ease": "outBack" }
```

### scaleBy — 현재 스케일에 곱하기

```json
{ "Action": "scaleBy", "By": [1.5, 1.5, 1], "Duration": 0.4, "Ease": "outElastic" }
```

### rotateTo — 절대 각도로 회전

```json
{ "Action": "rotateTo", "To": [0, 0, 180], "Duration": 1.0, "Ease": "inOutSine" }
```

### rotateBy — 현재 각도에서 상대 회전

```json
{ "Action": "rotateBy", "By": [0, 0, 90], "Duration": 0.5, "Ease": "outQuad" }
```

### fadeIn / fadeOut — 불투명/투명으로 페이드

```json
{ "Action": "fadeIn",  "Duration": 1.5, "Ease": "sineOut" }
{ "Action": "fadeOut", "Duration": 1.0, "Ease": "sineIn"  }
```

### fadeTo — 특정 투명도로 페이드

```json
{ "Action": "fadeTo", "Alpha": 0.6, "Duration": 2.0, "Ease": "linear" }
```

### colorTo — 색조 변경

```json
{ "Action": "colorTo", "Color": [1.0, 0.3, 0.3], "Duration": 1.5, "Ease": "sineOut" }
```

### shake — 화면 흔들기

```json
{ "Action": "shake", "Magnitude": 0.3, "Duration": 0.6 }
```

### show / hide — 즉시 표시/숨기기

```json
{ "Action": "show" }
{ "Action": "hide" }
```

### swapImage — 이미지 교체 (PNG/JPG)

```json
{ "Action": "swapImage", "Image": "icon_red.png" }
```

경로는 JSON 파일 기준 **절대 경로** 또는 Lua에서 절대 경로로 지정해야 합니다.

### play / pause / stop — 영상/GIF 제어

```json
{ "Action": "play" }
{ "Action": "pause" }
{ "Action": "stop" }
```

### setVideoSpeed — 영상 재생 속도 변경

```json
{ "Action": "setVideoSpeed", "Speed": 2.0 }
```

### Loop 옵션 (이동/스케일/회전 액션 공통)

```json
{ "Action": "moveTo", "To": [3, 0, 0], "Duration": 1.0, "Loop": "pingpong" }
```

| 값 | 설명 |
|---|---|
| `"once"` | 한 번만 실행 (기본값) |
| `"loop"` | 무한 반복 |
| `"pingpong"` | 왕복 반복 |

---

## 7. 웨이포인트 이동

오브젝트가 지정된 좌표들을 **Catmull-Rom 곡선**으로 부드럽게 순환 이동합니다.

```json
{
  "Id": "orbit",
  "Image": "icon.png",
  "Position": [3, 0, 0],
  "Waypoints": [
    [3,  0, 0],
    [0,  3, 0],
    [-3, 0, 0],
    [0, -3, 0],
    [3,  0, 0]
  ],
  "WaypointDuration": 6.0,
  "WaypointLoop": "loop",
  "WaypointEase": "sineInOut"
}
```

| 필드 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `Waypoints` | [[x,y,z], ...] | — | 경유점 목록 (최소 2개) |
| `WaypointDuration` | float | 5.0 | 전체 경로 한 바퀴 시간 (초) |
| `WaypointLoop` | string | `"loop"` | `"once"`, `"loop"`, `"pingpong"` |
| `WaypointEase` | string | `"linear"` | 이징 함수 |

> 웨이포인트는 오브젝트 생성 직후부터 바로 움직이기 시작합니다.  
> Idle의 `float`/`rotate`와 동시에 사용 가능합니다.

---

## 8. 패럴랙스

카메라 이동에 반응해 오브젝트가 느리게 따라오는 시차 효과입니다. 배경 레이어를 깊이감 있게 만들 때 사용합니다.

```json
{
  "Id": "bg_far",
  "Image": "sky.png",
  "Scale": [12, 12, 1],
  "SortOrder": -20,
  "ParallaxX": 0.3,
  "ParallaxY": 0.1
}
```

| 필드 | 설명 |
|---|---|
| `ParallaxX` | X축 패럴랙스 강도 (0 = 고정, 1 = 카메라와 동일) |
| `ParallaxY` | Y축 패럴랙스 강도 |

---

## 9. 이징 함수 목록

Trigger Action의 `Ease` 필드 및 웨이포인트의 `WaypointEase`에 사용합니다.

| 값 | 설명 |
|---|---|
| `linear` | 등속 |
| `inSine` / `outSine` / `inOutSine` | 사인 |
| `inQuad` / `outQuad` / `inOutQuad` | 2차 |
| `inCubic` / `outCubic` / `inOutCubic` | 3차 |
| `outElastic` / `inElastic` | 탄성 (바운스 후 안정) |
| `outBounce` | 바운스 착지 |
| `inBack` / `outBack` | 약간 되감았다가 튐 |

> 이름 앞의 `in`은 느리게 시작, `out`은 느리게 끝, `inOut`은 양쪽 모두입니다.

---

## 10. Lua 스크립팅

JSON만으로는 표현하기 어려운 복잡한 로직을 Lua로 작성합니다.

### 콜백 함수

| 함수 | 호출 시점 | 파라미터 |
|---|---|---|
| `onMapLoad()` | 맵 오브젝트 생성 직후 | — |
| `onBattleStart()` | 배틀 시작 | — |
| `onBattleEnd(win)` | 배틀 종료 | `win`: bool |
| `onTurnStart(turn)` | 턴 시작 | `turn`: int (0-based) |
| `onTurnEnd(turn)` | 턴 종료 | `turn`: int |
| `onEnemyHP(id, frac)` | 적 HP 변화 | `id`: int, `frac`: 0.0~1.0 |
| `onEnemyDie(id)` | 적 사망 | `id`: int |
| `onTime(elapsed)` | 0.5초 간격 폴링 | `elapsed`: float (초) |

### map.* API

#### 이동

```lua
map.moveTo("오브젝트ID", x, y, z, duration, ease, loop)
map.moveBy("오브젝트ID", dx, dy, dz, duration, ease)
```

```lua
-- BG를 2초 동안 오른쪽으로 이동
map.moveTo("bg", 3, 0, 0, 2.0, "sineInOut", "once")

-- 현재 위치에서 위로 1 이동
map.moveBy("icon", 0, 1, 0, 0.5)
```

#### 스케일

```lua
map.scaleTo("오브젝트ID", x, y, z, duration, ease)
```

```lua
map.scaleTo("logo", 2.0, 2.0, 1, 0.4, "outElastic")
```

#### 회전

```lua
map.rotateTo("오브젝트ID", rx, ry, rz, duration, ease)
map.rotateBy("오브젝트ID", drx, dry, drz, duration, ease)
```

```lua
map.rotateTo("wheel", 0, 0, 360, 1.0, "linear")
map.rotateBy("pointer", 0, 0, 45, 0.3)
```

#### 페이드

```lua
map.fadeIn("오브젝트ID", duration, ease)
map.fadeOut("오브젝트ID", duration, ease)
map.fadeTo("오브젝트ID", alpha, duration, ease)
```

```lua
map.fadeIn("bg", 2.0, "sineOut")
map.fadeTo("dim", 0.4, 1.5, "linear")
```

#### 색상

```lua
map.colorTo("오브젝트ID", r, g, b, duration, ease)
```

```lua
-- 빨간색으로 1.5초 전환
map.colorTo("bg", 1.0, 0.2, 0.2, 1.5, "sineOut")
-- 흰색으로 복구
map.colorTo("bg", 1.0, 1.0, 1.0, 1.0, "sineOut")
```

#### 효과

```lua
map.shake("오브젝트ID", duration, magnitude)
map.show("오브젝트ID")
map.hide("오브젝트ID")
```

#### 미디어

```lua
map.play("오브젝트ID")
map.pause("오브젝트ID")
map.stop("오브젝트ID")
map.setSpeed("오브젝트ID", speed)
```

```lua
-- 배틀 시작 시 영상 속도 1.5배
map.setSpeed("bg", 1.5)
```

#### 정보 조회

```lua
map.getBattleTime()  -- 배틀 경과 시간 (초)
map.getTurn()        -- 현재 턴 번호
map.inBattle()       -- 배틀 중 여부 (bool)
```

#### 로그

```lua
log("메시지")   -- BepInEx 콘솔에 출력 ([Lua] 태그)
```

### Lua 예제 — 턴에 따라 배경 색 변화

```lua
local colors = {
  {1.0, 1.0, 1.0},  -- 1턴: 기본
  {0.9, 0.8, 0.8},  -- 2턴: 붉은 빛
  {0.8, 0.8, 1.0},  -- 3턴: 푸른 빛
}

function onTurnEnd(turn)
  local idx = (turn % #colors) + 1
  local c = colors[idx]
  map.colorTo("bg", c[1], c[2], c[3], 1.0, "sineInOut")
end
```

### Lua 예제 — 적 HP에 따라 배경 영상 속도 조절

```lua
local triggered = {}

function onEnemyHP(id, frac)
  if frac <= 0.75 and not triggered[75] then
    triggered[75] = true
    map.setSpeed("bg", 1.2)
    log("Phase 2")
  end
  if frac <= 0.5 and not triggered[50] then
    triggered[50] = true
    map.setSpeed("bg", 1.5)
    log("Phase 3")
  end
  if frac <= 0.25 and not triggered[25] then
    triggered[25] = true
    map.setSpeed("bg", 2.0)
    map.colorTo("bg", 1.0, 0.5, 0.5, 1.0, "sineOut")
    log("Final phase")
  end
end

function onBattleStart()
  triggered = {}
  map.setSpeed("bg", 1.0)
end
```

### Lua 예제 — 승패에 따른 연출

```lua
function onBattleEnd(win)
  if win then
    map.colorTo("bg", 1.2, 1.2, 1.0, 1.5, "sineOut")
    map.setSpeed("bg", 0.5)
  else
    map.fadeTo("bg", 0.1, 3.0, "sineIn")
    map.setSpeed("bg", 0.2)
  end
end
```

---

## 11. 전체 예제

`MyMap/my_map.json`

```json
{
  "Name": "!custom_mymap",
  "LuaScript": "map.lua",
  "Walls": [

    {
      "Id": "bg",
      "Image": "background.mp4",
      "Position": [0, -15, 25],
      "Scale": [10, 10, 1],
      "Loop": true,
      "Muted": true,
      "AutoPlay": true,
      "SortOrder": -10,
      "Triggers": [
        { "On": "BattleStart", "Action": "fadeTo", "Alpha": 0.85, "Duration": 2.0, "Ease": "sineOut" },
        { "On": "BattleEnd",   "Action": "fadeTo", "Alpha": 0.3,  "Duration": 3.0, "Ease": "sineIn"  }
      ]
    },

    {
      "Id": "logo",
      "Image": "logo.png",
      "Position": [0, 4, 0],
      "Scale": [2, 2, 1],
      "Alpha": 0.0,
      "SortOrder": 10,
      "Idle": {
        "Type": "float",
        "Axis": [0, 1, 0],
        "Amplitude": 0.2,
        "Period": 3.0
      },
      "Triggers": [
        { "On": "BattleStart",    "Action": "fadeIn",   "Duration": 1.5, "Ease": "sineOut"    },
        { "On": "EnemyHPBelow",   "Threshold": 0.5,
          "Action": "colorTo",    "Color": [1.0, 0.3, 0.3], "Duration": 1.0, "Ease": "sineOut" },
        { "On": "EnemyDie",       "Action": "shake",    "Duration": 0.8, "Magnitude": 0.4     },
        { "On": "BattleEnd",      "Action": "fadeOut",  "Duration": 1.2, "Ease": "sineIn"     }
      ]
    },

    {
      "Id": "orb",
      "Image": "orb.gif",
      "Position": [4, 0, 0],
      "Scale": [1, 1, 1],
      "Alpha": 0.0,
      "SortOrder": 5,
      "Idle": {
        "Type": "pulse",
        "Amplitude": 0.1,
        "Period": 1.5
      },
      "Waypoints": [
        [ 4,  0, 0],
        [ 0,  4, 0],
        [-4,  0, 0],
        [ 0, -4, 0],
        [ 4,  0, 0]
      ],
      "WaypointDuration": 8.0,
      "WaypointLoop": "loop",
      "WaypointEase": "sineInOut",
      "Triggers": [
        { "On": "BattleStart", "Action": "fadeIn",  "Duration": 2.0, "Ease": "sineOut" },
        { "On": "TurnEnd", "Every": 2, "Action": "shake", "Duration": 0.3, "Magnitude": 0.15 },
        { "On": "BattleEnd",   "Action": "fadeOut", "Duration": 1.5, "Ease": "sineIn"  }
      ]
    }

  ]
}
```

`MyMap/map.lua`

```lua
local hpPhase = 0

function onBattleStart()
  hpPhase = 0
  log("Battle started")
  map.setSpeed("bg", 1.1)
end

function onBattleEnd(win)
  if win then
    map.colorTo("logo", 1.0, 1.0, 1.0, 2.0)
    map.setSpeed("bg", 0.5)
  else
    map.fadeTo("bg", 0.05, 4.0, "sineIn")
  end
end

function onTurnEnd(turn)
  -- 3턴마다 orb 흔들기
  if turn % 3 == 0 then
    map.shake("orb", 0.4, 0.2)
  end
end

function onEnemyHP(id, frac)
  if frac <= 0.5 and hpPhase < 1 then
    hpPhase = 1
    map.setSpeed("bg", 1.4)
    map.shake("logo", 0.5, 0.3)
  end
  if frac <= 0.25 and hpPhase < 2 then
    hpPhase = 2
    map.setSpeed("bg", 1.8)
    map.colorTo("bg", 0.9, 0.6, 0.6, 1.5, "sineOut")
  end
end

function onEnemyDie(id)
  log("Enemy " .. id .. " defeated")
  map.shake("orb", 1.0, 0.5)
  map.scaleTo("logo", 2.5, 2.5, 1, 0.3, "outElastic")
end
```

---

## 주의 사항

- `Id`를 지정하지 않으면 Image 경로가 Id로 사용됩니다. Lua에서 참조하려면 반드시 `Id`를 명시하세요.
- `Alpha: 0.0`으로 시작해 `fadeIn` 트리거로 등장시키는 것이 일반적인 패턴입니다.
- Idle 애니메이션은 Trigger 트윈이 진행 중일 때 자동으로 중단되고, 트윈 완료 후 재개됩니다.
- `EnemyHPBelow` 트리거는 같은 Threshold 값에 대해 배틀당 한 번만 실행됩니다. Lua에서도 플래그 변수로 동일하게 처리하세요.
- `Time` 트리거도 배틀당 한 번만 실행됩니다.
- 로그 확인: `BepInEx/LogOutput.log`에서 `[AMS]`, `[Lua]` 태그로 검색하면 각 오브젝트의 로드 및 이벤트 실행 상태를 확인할 수 있습니다.
