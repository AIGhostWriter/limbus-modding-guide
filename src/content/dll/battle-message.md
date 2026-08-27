# BattleMessage 플러그인 문서

## 개요

ModularSkillScripts(MSS) 의존 BepInEx IL2CPP 플러그인.  
패시브 JSON의 `requireIDList`에 커맨드를 선언해 전투 UI 연출을 트리거한다.

- **플러그인 ID**: `com.mod.battlemessage`
- **소스**: `C:\Users\이동혁\Desktop\BattleMessage\BattleMessagePlugin.cs`
- **배포 경로**: `BepInEx\plugins\BattleMessage.dll`

---

## 패시브 JSON 작성법

```json
{
    "list": [
        {
            "id": 8050999,
            "attributeStockCondition": [],
            "requireIDList": [
                "Modular/TIMING:IgnoreBreak/ignorebreak(1)",
                "Modular/TIMING:CommandPhase/danteunlock(MALKUTH_IMPERFECT,GEBURA,HOKMA,CHESED,BINAH)"
            ]
        }
    ]
}
```

### 파서 규칙
- `TIMING:X` → MSS `timingDict`에서 X를 찾아 `activationTiming` 설정
- 커맨드명과 괄호 안 인자는 `,`로 구분
- **콜론 `:` 사용 금지** — 파서가 key-value 구분자로 인식

---

## 타이밍

| 타이밍 키 | 값 | 발동 시점 |
|---|---|---|
| `IgnoreBreak` | 내장 | 브레이크 무시 |
| `CommandPhase` | 100 (커스텀) | 라운드 시작 후 명령 선택창 열릴 때 (`AfterStartRound`) |

`CommandPhase`는 `StageController.AfterStartRound` Postfix에서 `activationTiming == 100`인 ModularSA를 수동 dispatch한다.

---

## 커맨드 목록

### ✅ 작동 확인

| 커맨드 | 인자 | 설명 |
|---|---|---|
| `showdialog(text,sec)` | text, 시간(초) | **내 팀** 유닛 위 말풍선 |
| `showdialog_oppo(text,sec)` | text, 시간(초) | **상대** 유닛 위 말풍선 |
| `abnotice(text)` | text | **화면 중앙** 텍스트 표시 (`ShowAbChoiceNotice`) |
| `announce(text)` | text | 좌상단 공지 텍스트 |
| `announceportrait(id)` | 아나운서 ID | 초상화 포함 공지 |
| `roundtypo(n)` | 라운드 번호 | 라운드 N 타이포 연출 |
| `wavetypo(n)` | 웨이브 번호 | 웨이브 N 타이포 연출 |
| `starttypo()` | — | START 타이포 |
| `continuetypo()` | — | CONTINUE 타이포 |
| `damagepopup(text)` | text | 유닛 위 데미지 팝업 |
| `buffpopup(text)` | text | 유닛 위 버프 팝업 |
| `specialpopup(text)` | text | 유닛 위 특수 팝업 |
| `breakpopup()` | — | 유닛 위 브레이크 팝업 |
| `recovertypo(n)` | 회복량 | 유닛 위 HP 회복 수치 |
| `guardtypo(type)` | GUARD/EVADE/COUNTER 등 | 유닛 위 방어 타입 표시 |
| `mentalbreak()` | — | 유닛 정신붕괴 타이포 |
| `lowmorale()` | — | 유닛 사기저하 타이포 |
| `danteunlock(세피라...)` | 세피라 이름 목록 | 단테 능력 해금 연출 (아래 참고) |

### ❌ 사용 불가 (일반 전투)

| 커맨드 | 이유 |
|---|---|
| `dialog(text,sec)` | `OutterGradiantEffectController` 전용 — 스킬 컷씬(letterbox) 상태에서만 표시됨 |
| `dialog_mid(text,sec)` | 동일 (`CallerCount=0`, 미사용 dead code) |
| `dialog_upper(text,sec,y)` | 동일 |
| `overclock()` | `_actOverClock` 씬에 없음 |
| `waveend()` | 카메라 무빙 연출 — 불필요 |
| `roundend()` | 카메라 무빙 연출 — 불필요 |
| `fade(in/out,sec)` | 카메라 무빙 연출 — 불필요 |

---

## danteunlock 상세

### 사용법
```
danteunlock(SEPIRA1,SEPIRA2,...)
```

세피라를 여러 개 나열하면 첫 번째 애니메이션 종료 콜백에서 다음이 자동 실행된다 (체이닝).

### 세피라 → abilityId 매핑

| SEPIRA | abilityId | 능력명 |
|---|---|---|
| `HOKMA` | 90101 | PIGRITIA |
| `BINAH` | 80101 | SUPERBIA |
| `CHESED` | 70101 | MOROSITAS |
| `GEBURA` | 60101 | IRA |
| `MALKUTH` | 10102 | M@!L%#TH |
| `MALKUTH_IMPERFECT` | 10102 | M@!L%#TH |

### 마름 예시 (첫 턴 5개 순서 재생)
```
"Modular/TIMING:CommandPhase/danteunlock(MALKUTH_IMPERFECT,GEBURA,HOKMA,CHESED,BINAH)"
```

---

## 주요 발견사항

- `BattleUIRoot.SetDialog_Mid`는 `CallerCount=0` — 실제 게임에서 미사용, 호출해도 아무것도 표시 안 됨
- 화면 중앙 텍스트는 `BattleBasicUIController.ShowAbChoiceNotice(text)` → `abnotice` 커맨드
- `danteunlock`에서 `DanteAbilityUseAnim.PlayUseAnim()`은 올바른 abilityId가 없으면 `ArgumentException: The Object you want to instantiate is null` 발생
- `BattleUIDialogManager`(선택창 자동 대사)는 직접 UI를 렌더링하지 않고 `BattleUnitView`를 통해 말풍선으로 표시하는 로직 컨트롤러
- `OutterGradiantEffectController`는 `[Canvas]BattleRetterBoxUI`에 부착 — 스킬 컷씬 letterbox 전용
