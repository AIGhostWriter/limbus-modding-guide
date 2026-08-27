# Battle Cinematic Player 배포 및 사용 안내

## 개요

Battle Cinematic Player는 Limbus Company 전투의 첫 라운드가 시작되기 전에 Unity Timeline 기반 커스텀 시네마틱을 재생하는 BepInEx IL2CPP 플러그인입니다.

플러그인은 게임의 `BattleProduceManager`와 `ProduceBase` 흐름을 이용하므로 시네마틱이 재생되는 동안 전투 진행을 대기시키고, 재생 종료 후 카메라와 전투 흐름을 복원합니다.

v0.2.0부터 특정 모드 이름, encounter ID, 번들 절대 경로를 DLL에 하드코딩하지 않습니다. 플러그인이 각 Lethe 모드의 폴더를 자동 탐색합니다.

## 요구 사항

- Windows 64비트
- Limbus Company
- 게임 버전과 호환되는 BepInEx 6 IL2CPP 및 interop 어셈블리
- Lethe 기반 모드 환경
- Unity 2021.3.28f1로 Windows 64비트용 빌드한 AssetBundle

게임 또는 interop 어셈블리 버전이 다르면 DLL이 로드되지 않거나 Harmony 패치 대상 메서드를 찾지 못할 수 있습니다.

## 배포 파일 구성

배포 압축 파일은 다음 구조를 권장합니다.

```text
BepInEx/
├─ plugins/
│  ├─ BattleCinematicPlayer.dll
│  └─ Lethe/
│     └─ mods/
│        └─ <모드 폴더>/
│           └─ custom_battle_cinematics/
│              ├─ story1cinematic
│              ├─ cinematics.json
│              └─ battle_cinematics.json  # 여러 encounter가 있거나 명시적 연결이 필요할 때
└─ config/
   └─ com.lethe.battlecinematicplayer.cfg  # 최초 실행 시 자동 생성
```

`.manifest`, `.deps.json`, Unity 프로젝트 소스는 일반 사용자의 설치 파일에 필요하지 않습니다.

## 설치

1. 게임을 완전히 종료합니다.
2. `BattleCinematicPlayer.dll`을 `BepInEx\plugins`에 넣습니다.
3. 시네마틱 번들과 JSON을 모드의 `custom_battle_cinematics` 폴더에 넣습니다.
4. 같은 모드의 `custom_encounters` 아래에 `encounter.json`을 둡니다.
5. 게임을 실행합니다. 모드에 encounter가 하나뿐이면 자동 연결됩니다.

```ini
[General]
Enabled = true

[Discovery]
ModsRoot = C:\게임경로\BepInEx\plugins\Lethe\mods
```

각 모드 내부의 번들·JSON 경로는 상대 경로로 관리되므로 제작자의 개인 PC 경로를 배포할 필요가 없습니다.

## Encounter 자동 연결

모드에 `custom_encounters/**/encounter.json`이 정확히 하나 있으면 다음 기본값으로 자동 등록됩니다.

- 번들: `custom_battle_cinematics/story1cinematic`
- 프리팹: `Story1Cinematic`
- 설정: `custom_battle_cinematics/cinematics.json`
- 시퀀스: `Story1`

encounter가 여러 개이거나 다른 이름을 사용하려면 `custom_battle_cinematics/battle_cinematics.json`을 추가합니다.

```json
{
  "cinematics": [
    {
      "name": "Story1",
      "encounter": "../custom_encounters/load/encounter.json",
      "bundle": "story1cinematic",
      "prefab": "Story1Cinematic",
      "settings": "cinematics.json",
      "sequence": "Story1"
    }
  ]
}
```

`encounter`의 JSON에서 `id`를 자동으로 읽습니다. 모든 경로는 `custom_battle_cinematics` 기준 상대 경로입니다. 서로 다른 모드가 같은 encounter ID를 등록하면 충돌로 처리하며 어느 쪽도 실행하지 않습니다.

## Unity 번들 제작

시네마틱 프리팹은 다음 조건을 만족해야 합니다.

- 루트 프리팹 이름: `Story1Cinematic` 또는 설정의 `PrefabName`과 같은 이름
- 자식에 `PlayableDirector`가 하나 이상 존재
- `PlayableDirector.playableAsset`이 유효한 `TimelineAsset`
- Timeline이 제어하는 SpriteRenderer, Animator, VFX 오브젝트가 프리팹 내부에 포함
- 번들 이름: 자유롭게 지정할 수 있으나 `BundlePath`와 일치해야 함
- 빌드 대상: `StandaloneWindows64`

### Aqua에서 빌드하기: 전체 과정

빌더는 현재 열린 씬의 오브젝트를 이름으로 찾습니다. 따라서 아래 이름과 컴포넌트 위치를 정확히 맞춰야 합니다.

#### 1. Story1 Timeline 준비

1. Unity에서 `C:\Users\이동혁\Desktop\Aqua` 프로젝트를 엽니다.
2. 시네마틱을 편집한 씬을 엽니다.
3. Hierarchy에 빈 GameObject를 만들고 이름을 정확히 `Story1`로 지정합니다.
4. `Story1` 오브젝트 자체에 `PlayableDirector`를 추가합니다. 자식에만 추가하면 빌더가 찾지 못합니다.
5. `PlayableDirector`의 `Playable Asset`에 완성한 `Story1.playable`을 연결합니다.
6. Timeline 창에서 `Story1.playable`을 열고 모든 트랙을 실제 씬 오브젝트에 바인딩합니다.

예시:

```text
Hierarchy
├─ Story1                    ← PlayableDirector가 이 오브젝트에 있어야 함
├─ Appearance               ← Animation Track 바인딩
├─ sword_vfx                ← Animation Track 바인딩
├─ shadow_0                 ← Animation Track 바인딩
└─ 기타 VFX/스프라이트       ← 해당 Timeline 트랙 바인딩
```

Timeline 트랙 왼쪽의 바인딩 칸이 `None`이면 해당 오브젝트는 번들 프리팹에 복제되지 않습니다. 필요한 Animation/Activation/Control 트랙이 전부 올바른 GameObject, Animator 또는 Component를 가리키는지 확인하세요.

#### 2. Unity 안에서 먼저 검증

1. Timeline의 시간을 `0`으로 되돌립니다.
2. Timeline의 Preview를 켜고 재생합니다.
3. 캐릭터, 검 이펙트, 그림자 등 모든 요소가 원하는 상대 위치에서 재생되는지 확인합니다.
4. `SpriteRenderer.color.a`, 활성화 시점, 정렬 순서와 전체 재생 시간을 확인합니다.
5. Console에 컴파일 오류가 하나라도 있으면 먼저 해결합니다. 컴파일 오류가 있으면 메뉴가 나타나지 않거나 빌드가 실행되지 않습니다.

#### 3. 전용 번들 생성

상단 메뉴에서 실행합니다.

```text
Tools → Battle Cinematic → Build Story1Cinematic Bundle
```

메뉴를 실행하면 빌더가 자동으로 다음 작업을 수행합니다.

1. Hierarchy에서 이름이 정확히 `Story1`인 활성 오브젝트를 찾음
2. `Story1` 오브젝트의 `PlayableDirector`와 `playableAsset` 확인
3. `Story1Cinematic`이라는 새 임시 루트 생성
4. `Story1`과 Timeline 출력에 바인딩된 각 오브젝트를 루트 아래에 복제
5. 복제된 Director의 트랙 바인딩을 복제 오브젝트로 교체
6. 중첩 프리팹 연결을 풀어 번들을 독립적으로 구성
7. `Assets/Story1Cinematic.prefab` 저장
8. 프리팹과 `Story1.playable`을 Windows 64비트용 `story1cinematic` 번들로 빌드

원본 씬 오브젝트와 `motion.bundle`은 변경하지 않습니다.

#### 4. 생성 결과 확인

성공하면 다음 파일이 생깁니다.

```text
Aqua/Assets/Story1Cinematic.prefab
Aqua/Assets/AssetBundles/story1cinematic
Aqua/Assets/AssetBundles/story1cinematic.manifest
```

실제 배포에 필요한 파일은 확장자가 없는 `story1cinematic`입니다. `.manifest` 파일은 필요하지 않습니다.

생성된 `Story1Cinematic.prefab`을 Prefab Mode로 열어 다음을 확인하세요.

- 루트 아래에 `Story1`, Appearance, VFX 등 필요한 오브젝트가 존재
- 자식 `Story1`에 `PlayableDirector`가 존재
- Director의 `Playable Asset`이 비어 있지 않음
- Timeline 바인딩이 `Missing` 또는 `None`이 아님

#### 5. 모드에 배치

번들을 대상 모드에 복사합니다.

```text
BepInEx/plugins/Lethe/mods/<모드명>/custom_battle_cinematics/story1cinematic
```

같은 폴더에 다음 파일도 둡니다.

```text
cinematics.json
battle_cinematics.json   # 명시적 encounter 연결 시
```

`battle_cinematics.json`의 `bundle` 값이 `story1cinematic`인지, `prefab` 값이 `Story1Cinematic`인지 확인합니다.

#### 빌드 실패 점검

- 메뉴가 없음: `Assets/Editor/BuildStory1Cinematic.cs`가 없거나 Unity 컴파일 오류가 있음
- `Story1을 찾지 못함`: Hierarchy 이름이 다르거나 Story1이 비활성 상태임
- Director를 찾지 못함: `PlayableDirector`가 Story1 자체가 아니라 자식에 붙어 있음
- 생성은 됐지만 일부 요소가 없음: 해당 Timeline 트랙의 씬 바인딩이 `None`이었음
- 게임에서 프리팹을 찾지 못함: 매니페스트의 `prefab`과 `Story1Cinematic` 이름이 다름
- 수정 내용이 반영되지 않음: 게임을 완전히 종료한 뒤 기존 번들을 새 파일로 교체해야 함

## cinematics.json

```json
{
  "sequences": {
    "Story1": {
      "rootPosition": { "x": 0.0, "y": 0.0, "z": 0.0 },
      "initialCameraPosition": null,
      "initialCameraZ": null,
      "cameraRotation": { "x": 30.0, "y": 0.0, "z": 0.0 },
      "fieldOfView": 30.0,
      "cameraZooms": [
        { "delay": 0.0, "duration": 2.5, "z": -4.0 }
      ],
      "cameraMoves": [
        { "delay": 0.5, "duration": 1.5, "x": 9.0, "y": 1.0 }
      ]
    }
  }
}
```

| 필드 | 설명 |
|---|---|
| `rootPosition` | 시네마틱 루트의 월드 좌표 |
| `initialCameraPosition` | 시작 카메라 X/Y. `null`이면 현재 게임 값 유지 |
| `initialCameraZ` | 시작 카메라 Z. `null`이면 현재 게임 값 유지 |
| `cameraRotation` | 카메라 Euler 회전. `null`이면 현재 값 유지 |
| `fieldOfView` | 원근 카메라 시야각. `null`이면 현재 값 유지 |
| `cameraZooms` | `delay` 후 `duration` 동안 카메라 Z를 목표값으로 이동 |
| `cameraMoves` | `delay` 후 `duration` 동안 카메라 X/Y를 목표값으로 이동 |

`cameraZooms`와 `cameraMoves`는 `delay` 순서로 자동 정렬됩니다. 값이 없는 배열은 `[]`로 작성하세요.

## 정상 동작 확인

`BepInEx\LogOutput.log`에서 다음 로그를 확인합니다.

```text
[BattleCinematicPlayer] Loaded
[BattleCinematicPlayer] Story1 Produce prepared
[BattleCinematicPlayer] Story1 ending through native Produce path
[BattleCinematicPlayer] Main camera restored
```

자주 발생하는 오류:

- `Bundle not found`: `BundlePath`가 잘못됐거나 파일이 없음
- `Prefab ... was not found`: 번들 내부 프리팹 이름과 `PrefabName`이 다름
- `PlayableDirector/Timeline was unavailable`: 프리팹에 유효한 Director/Timeline이 없음
- 시네마틱이 전혀 실행되지 않음: 현재 빌드에 고정된 encounter ID와 실제 전투 ID가 다름

## 하드코딩 감사 및 현재 제한

코드 감사 결과는 다음과 같습니다.

### v0.2.0에서 제거된 하드코딩

- encounter ID `810001`
- `load` 또는 `FloorOfHistory` 모드 이름
- 번들 및 JSON의 사용자 절대 경로
- JSON 시퀀스 키 `Story1` 강제 사용
- 고정 Produce 키와 런타임 오브젝트 이름

### 아직 남은 개발 환경 항목

1. `Directory.Build.props`
   - 개발자의 Limbus 설치 절대 경로가 하드코딩됨
   - 현재 파일에는 한글 사용자 경로가 깨진 문자로 저장되어 있어 다른 PC에서 바로 빌드할 수 없음

### 설정으로 이미 변경 가능한 항목

- 플러그인 활성화 여부
- Lethe 모드 루트 경로
- 매니페스트의 번들·프리팹·설정·시퀀스 이름
- 루트 위치
- 카메라 시작 위치, Z, 회전, FOV
- 카메라 이동 및 줌 타이밍

### 기술적 결합

- `StageController.StartStage`, `BattleProduceManager`, `BattleCamManager`, `ProduceBase`의 게임 내부 필드와 메서드에 직접 의존
- 게임 업데이트로 이름이나 시그니처가 바뀌면 재빌드가 필요할 수 있음
- 하나의 전투에서 한 번만 재생하도록 `_played` 정적 상태 사용
- encounter 하나당 하나의 시네마틱 매핑을 지원
- AssetBundle은 프로세스 동안 캐시되며 실행 중 파일 교체를 지원하지 않음

## 향후 권장 사항

- 설정 시작 시 번들·프리팹·JSON을 미리 검증
- 같은 encounter에 여러 시네마틱을 순차 재생하는 기능
- 게임/interop 호환 버전 명시
- 배포 전에 깨끗한 게임 환경에서 시네마틱 종료 후 첫 라운드 시작과 카메라 복원을 검증

## 빌드

1. `Directory.Build.props`의 `LimbusCompanyFolder`를 자신의 게임 경로로 수정합니다.
2. .NET 6 SDK를 설치합니다.
3. 프로젝트 폴더에서 실행합니다.

```powershell
dotnet build BattleCinematicPlayer.csproj -c Release
```

출력 파일:

```text
Release\BattleCinematicPlayer.dll
```
