# StoryScriptLoader

커스텀 스토리 스크립트(대화/컷신)를 모드 폴더에서 로컬 JSON 파일로 로드하는 BepInEx 플러그인.  
`StorySystem.StoryManager.CallStory(string, ...)` 를 가로채서 서버 다운로드 없이 로컬 파일로 재생.

---

## 설치

`StoryScriptLoader.dll` 을 아래 경로에 복사:

```
BepInEx/plugins/StoryScriptLoader.dll
```

---

## 폴더 구조

```
BepInEx/plugins/Lethe/mods/내모드/
  custom_limbus_data/
    battle-story/
      encounter.json         ← 스테이지 → 스토리 ID 연결
    scenario-asset/
      asset.json             ← 등장 캐릭터 외형 정의 (선택)
  custom_story_scripts/
    MY_STORY_ENTER.json      ← 전투 입장 전 스토리 스크립트
    MY_STORY_EXIT.json       ← 전투 종료 후 스토리 스크립트
```

---

## battle-story encounter.json 예시

```json
{
  "waveList": [ ... ],
  "story": {
    "enter": ["MY_STORY_ENTER"],
    "exit":  ["MY_STORY_EXIT"]
  }
}
```

---

## 스토리 스크립트 JSON 형식

`custom_story_scripts/{스토리ID}.json`

```json
{
  "dialogs": [
    {
      "teller": "단테",
      "content": "...",
      "bg": "",
      "bgm": "Battle_Cp1_Ally_1",
      "feeling": "Normal",
      "model": "단테"
    },
    {
      "teller": "파우스트",
      "content": "...",
      "feeling": "Sad"
    }
  ]
}
```

### 모든 필드 (선택 사항, 생략 시 빈 값)

| 필드 | 타입 | 설명 |
|---|---|---|
| `teller` | string | 화자 이름 (scenario-asset에 정의된 이름) |
| `title` | string | 화자 표시 이름 (없으면 teller 사용) |
| `content` | string | 대사 텍스트 |
| `place` | string | 장소 설명 |
| `model` | string | 캐릭터 모델 이름 |
| `feeling` | string | 표정/감정 (Normal, Sad, Angry 등) |
| `emotion` | string | 추가 감정 |
| `bg` | string | 배경 이미지 이름 |
| `cg` | string | CG 이미지 이름 |
| `bgm` | string | 배경음악 이름 |
| `soundEffect` | string | 효과음 |
| `voice` | string | 음성 파일 이름 |
| `customEvent` | string | 커스텀 이벤트 |
| `effect` | string | 화면 효과 |
| `filter` | string | 화면 필터 |
| `video` | string | 동영상 |
| `waitTime` | float | 자동 진행 대기 시간 (초) |
| `autoNext` | bool | true면 waitTime 후 자동 다음 |
| `forceMonologue` | bool | 강제 독백 모드 |
| `credit` | int | 크레딧 표시 |
| `produce` | string | Produce 제어 |
| `prompt` | string | 선택지 |
| `characterList` | string | 등장 캐릭터 목록 |
| `setDialogUI` | string | 대화창 UI 종류 |
| `setGlitchFilter` | string | 글리치 필터 |
| `time` | string | 시간대 |

---

## 동작 원리

1. 게임이 스토리 재생 요청 (`StoryManager.CallStory("MY_STORY_ENTER", ...)`)
2. Harmony Prefix가 가로챔
3. 모든 모드 폴더에서 `custom_story_scripts/MY_STORY_ENTER.json` 검색
4. 파일 발견 시: JSON 파싱 → `Scenario` + `List<Dialog>` 객체 구성
5. private `CallStory(Scenario, lang, callback)` 직접 호출 → 원본 다운로드 건너뜀
6. 파일 없으면 원래 서버 다운로드 로직 그대로 실행

---

## 빌드 환경

- .NET 6.0 / LangVersion 10
- BepInEx IL2CPP (Limbus Company)
- 참조: `BepInEx.Core`, `BepInEx.Unity.IL2CPP`, `0Harmony`, `Assembly-CSharp` (interop)
