# 거울던전 완전 재현 계획

## 원칙

- **서버 무의존**: 모든 상호작용은 원래 서버 응답에 의존했다. 각 단계마다 "이 버튼/UI가 실제로 무엇을 호출하는가"를 먼저 역공학으로 규명하고, 그 결과를 로컬에서 직접 구성해 대체한다. 짐작으로 땜질하지 않는다.
- **검증 우선**: 지금까지 만든 코드(RunState, MapGenerator, NodeInjector, MapView 등)는 "기능이 동작하는지" 시험한 프로토타입이다. 실제 게임의 상호작용 방식을 규명한 뒤, 필요하면 이 프로토타입도 다시 짠다 — 기존 코드에 종속되지 않는다.
- **순서대로 축적**: 아래 단계는 실제 플레이 순서를 따른다. 각 단계는 이전 단계가 인게임에서 확인된 뒤에만 착수한다.
- **단계 착수 시 리서치 선행**: 이 문서는 리서치 없이 뼈대만 작성한 것이다. 각 단계에 들어가기 전 ilspycmd로 관련 타입/메서드를 규명하는 조사가 반드시 선행된다 (문서 내 "조사 필요" 표시).

## 확보된 사실 (재확인 없이 재사용 가능)

- `Dungeon.Map.ENCOUNTER` enum 확정: START=0, BATTLE=1, HARD_BATTLE=2, EVENT=3, SAVE=4, AB_BATTLE=5, BOSS=6, EVENT_BATTLE=7, EVENT_HARD_BATTLE=8, EVENT_AB_BATTLE=9, MIRROR_SHOP=10, MIRROR_SELECT_EVENT=11, STAIRS=12, STORY=13, HARD_AB_BATTLE=14, HIDDEN_BATTLE=15
- `TryMoveToHere()`는 존재하지만 기존 코드 주석에 "배틀 팝업(편성) 열려다 실패 → HTTP 요청 미발송"이라 기록됨 — 원래 흐름이 서버 왕복을 전제로 함을 시사. 실제 어디서 끊기는지 미규명.
- 보스 클리어 시도 중 실제로 발생한 크래시(로그 확보):
  ```
  NullReferenceException at MainUI.MirrorDungeonFinishedPanel.SetDataOpen(
      UserMirrorDungeonSaveData saveData, MirrorDungeonRewardArrangedData reward,
      MainUI.MirrorDungeonFinishedPanel+LocalizeText localizeText,
      Dungeon.Mirror.MirrorDungeonResultData resultData, DelegateEvent confirmEvent)
  at Dungeon.Mirror.MirrorDungeonUIManager.<>c__DisplayClass62_0.<ShowRewardPreview>b__0(MirrorDungeonRewardArrangedData result)
  at UserMirrorDungeonSaveDataManager.<>c__DisplayClass26_0.<SendGetMirrorDungeonRewardChip>b__0(Server.ResPacket_PreviewMirrorDungeonExitReward result)
  ```
  → 층 클리어 보상 흐름이 `SendGetMirrorDungeonRewardChip`(서버 요청)의 응답(`ResPacket_PreviewMirrorDungeonExitReward`)을 받아 `MirrorDungeonRewardArrangedData`를 만들고 그걸 결과창에 넘기는 구조. 오프라인이라 응답이 없어 reward가 null인 채로 SetDataOpen 호출됨.
- 로컬 스태틱 데이터 확인됨 (`Lethe\dumpedData\limbus_data\`): `mirrordungeon-start-buffs`(가호), `mirrordungeon-theme-floor`(테마팩), `mirrordungeon-constraint`(제약), `mirror-dungeon-common-data`(스타라이트/보상공식), `ego-gift-mirrordungeon`, `mirrordungeon-encounterinfo`(보상확률), `mirrordungeon-battle-reward-case-group`.
- `mirrordungeon/0.json`은 지금까지 `id==7`만 로드했고 5층(floor 0~4, winFloorIdx=4) 구성만 확인됨. 유저가 설명한 "5층→평행중첩(6~10층)→익스트림(11~15층)" 구조라면 같은 id=7 안에 `typeIndex`가 다른 항목이 더 있을 가능성이 높음 — **미확인, Phase 8 착수 시 조사 필수**.

---

## 단계 목록

### Phase 1 — 수감자 편성 (검증만)
이미 동작 확인됨 (`ShowNativeFormationPanel`, `Patch_FormationUIPanel_*`). 이번 재설계에서 망가뜨리지 않았는지만 회귀 확인.
- **조사 필요**: 없음 (기존 동작 유지 확인만)
- **테스트**: MD 진입 시 편성 패널 정상 표시·확정 동작.

### Phase 2 — 꿈결 별의 가호 설정
런 시작 시(편성 확정 직후 또는 테마 선택 전) 스타트 버프를 고르는 창.
- **조사 필요**: `MirrorDungeonStartBuffNodeTypes` enum과 연계된 UI 패널 클래스 규명 (Open/SetData 시그니처), 선택 결과가 `currentInfo.startKeyword`/`startBufPoint`에 어떻게 반영되는지, `mirrordungeon-start-buffs` JSON을 후보 풀로 사용하는 방식.
- **구현**: 로컬 데이터로 후보 3개 구성 → 패널 오픈 → 선택 결과를 currentInfo에 직접 기록.
- **테스트**: MD 진입 직후 가호 선택 UI가 뜨고, 고른 버프가 실제 전투에 적용되는지 확인.

### Phase 3 — 테마팩 선택 (최초 진입 + 매 층 반복 공용)
1층 진입 전(및 이후 매 층 클리어 후) 테마 3택 UI.
- **조사 필요**: 테마 선택 패널 클래스, `ConfirmSelectTheme(idx, themeId)`가 이미 사용 중인데 이게 실제로 선택 UI가 호출하는 그 메서드인지, 후보 3개를 고르는 로직(현재 dungeonIdx/floor에서 `exceptionConditions` 필터링 후 랜덤 3개 뽑는 방식 추정 — 실제 확률/필터 규명).
- **구현**: `MapGenerator`에 테마 후보 3개 뽑는 함수 추가 → 선택 UI에 후보 전달 → 확정 시 `RunState.ThemeId` 갱신 후 `MapGenerator.GenerateFloor` 호출.
- **테스트**: 매 층 진입 전 3택 UI가 뜨고 고른 테마의 맵이 실제로 생성되는지.

### Phase 4 — 노드 이동 (TryMoveToHere 경유로 교체)
현재는 `UIButton.OnPointerClick`을 가로채 노드 종류를 직접 판별하고 `StartStage`를 바로 호출하는 우회 방식(애니메이션·카메라 이동 없음). 실제 게임처럼 플레이어 토큰이 노드로 이동하는 연출을 살린다.
- **조사 필요**: `TryMoveToHere()` 전체 디컴파일 — 어디서 멈추는지 정확히 특정. `MirrorDungeonManager.MoveCameraAndExecuteEncounter(MirrorDungeonNodeUI, bool isReturn)` 전체 디컴파일 — 인카운터 타입별로 이후 무엇을 호출하는지, 어느 지점에서 서버 요청(`Send*` 메서드)을 거는지.
- **구현**: 서버 요청 지점만 Harmony로 가로채 로컬 응답으로 대체하고, 그 앞뒤(카메라 이동, 애니메이션, 인카운터 디스패치)는 게임 원본 코드가 그대로 돌게 한다. 현재의 "OnPointerClick 가로채기 우회"는 폐기.
- **테스트**: 노드 클릭 → 카메라/토큰이 실제로 이동하는 연출 → 해당 인카운터가 정상 트리거.

### Phase 5 — 노드별 상호작용 버튼 (전투/이벤트/상점/보스 진입 트리거)
Phase 4에서 규명한 인카운터 디스패치 지점을 기준으로, 각 인카운터 타입이 실제로 여는 UI/트리거를 원본 경로로 연결.
- **조사 필요**: 인카운터 타입별 라우팅 로직 (BATTLE/AB_BATTLE/HARD_BATTLE → 전투 진입 트리거, EVENT/MIRROR_SELECT_EVENT → 이벤트 컨트롤러, SAVE/MIRROR_SHOP → 상점, BOSS → 보스 전투) 각각이 부르는 정확한 메서드.
- **구현**: 현재 임시로 만든 "EVENT 자동 통과" 자리표시자 제거하고 실제 라우팅으로 교체. 전투 진입은 Phase 4/5에서 규명된 경로로 통합 (기존 `EnterBattleNode`의 `GetDungeonStage` 직접 호출 방식은 임시 우회였으므로 재검토).
- **테스트**: 4종 노드(전투/이벤트/상점/보스) 전부 원본 트리거 경로로 진입.

### Phase 6 — 스테이지 내 UI 패널 (보유 에고 기프트 패널 / 수감자 패널)
맵 화면에서 상시 접근 가능한 패널들.
- **조사 필요**: `EgoGiftInventoryPanel`(GO명은 이미 알고 있음, 정확한 컨트롤러/모델 타입과 Refresh 메서드 미규명) — 어떤 리스트(`List<DungeonMapEgoGift>`?)로 채워지는지. 수감자 패널(HP/스태거/키워드 등 표시) 컨트롤러 타입. 기존에 NRE를 그냥 Finalizer로 삼켜버린 `UnitInformationController.Init`, `UnitInfoTooltipUIBase.InitInteraction`을 전체 디컴파일해 진짜 원인(어떤 필드가 null인지) 규명 후 근본 수정으로 교체 (삼키기 제거).
- **구현**: 두 패널 모두 로컬 데이터로 채워 실제 오픈 가능하게.
- **테스트**: 맵 화면에서 두 패널 모두 열리고 내용이 실제 상태와 일치.

### Phase 7 — EGO gift 선택창 (전투 승리 보상)
- **조사 필요**: `GetEgoGiftPopup`/`MainUI.SelectEgoGiftPanel`/`GetSelectEgoGiftPanelModel` 전체 디컴파일 — 후보 리스트/선택 확정이 로컬 콜백으로 끝나는지 서버 왕복이 필요한지.
- **구현**: `mirrordungeon-encounterinfo`(확률) + 테마 `egoGiftPool`(티어 필터)로 후보 산출 → 선택 UI 오픈 → 확정 시 `currentInfo._egoGifts`에 직접 추가.
- **테스트**: 전투 승리 후 실제 선택 UI가 뜨고 고른 기프트가 보유 목록에 반영.

### Phase 8 — EGO gift 관측 (상세 보기)
- **조사 필요**: 상세 패널 클래스 규명 (`MainUI.EgoGiftListPopup`은 이미 부분 패치돼 있음 — 전체 디컴파일해 상세보기 진입점 확인).
- **구현**: 클릭 시 상세 패널 오픈, 로컬 데이터(`ego-gift-mirrordungeon`)로 능력치/설명 표시.
- **테스트**: 인벤토리에서 기프트 클릭 → 상세 정보 정상 표시.

### Phase 9 — 보스 클리어 → 층 클리어 보상 → 결과창
- **조사 필요**: 확보된 사실의 크래시 스택트레이스 기준 — `UserMirrorDungeonSaveDataManager.SendGetMirrorDungeonRewardChip`, `Server.ResPacket_PreviewMirrorDungeonExitReward`, `MirrorDungeonRewardArrangedData`, `Dungeon.Mirror.MirrorDungeonResultData` 전체 디컴파일해 필요한 필드 전부 파악.
- **구현**: `SendGetMirrorDungeonRewardChip` 요청 지점을 가로채 로컬에서 `MirrorDungeonRewardArrangedData`를 직접 구성(보상 테이블은 `mirrordungeon-battle-reward-case-group` + `mirror-dungeon-common-data` 공식 사용) → `MirrorDungeonFinishedPanel.SetDataOpen`에 정상 데이터 전달.
- **테스트**: 보스 처치 후 크래시 없이 층 클리어 보상창이 뜨고 확인 버튼이 동작.

### Phase 10 — 층 반복 (2~5층, 테마팩 선택 루프)
Phase 3(테마 선택)~Phase 9(보상)까지의 사이클을 층마다 반복.
- **조사 필요**: 층 전환 시 `MoveToNextFloor()`(존재 확인됨, 시그니처 3종) 호출이 필요한지, 아니면 위 사이클 재실행만으로 충분한지.
- **구현**: RunState.FloorIndex 증가 + 사이클 재진입.
- **테스트**: 1층 보스 클리어 → 보상 → 2층 테마 선택 → ... → 5층까지 자연스럽게 이어짐.

### Phase 11 — 평행중첩 (6~10층)
5층 클리어 후 "더 진행할지" 여부를 묻는 확인창, 진행 시 6~10층이 동일 사이클로 반복.
- **조사 필요**: 확인 다이얼로그 클래스, `mirrordungeon/0.json`에 6~10층에 해당하는 별도 `typeIndex` 항목이 존재하는지 (id=7 리스트 전체를 다시 덤프해 typeIndex별 floors 구성 확인 — 현재 로더는 첫 매치만 사용 중이라 수정 필요할 가능성 높음).
- **구현**: 확인창 → 예 선택 시 다음 티어 데이터로 RunState 전환, 아니오 시 Phase 9의 결과창으로 종료.
- **테스트**: 5층 클리어 후 진행 여부 확인창 → 진행 선택 시 6층부터 동일 사이클로 이어짐.

### Phase 12 — 익스트림 (11~15층) + 제약 선택
10층 클리어 후 진행 여부 확인, 진행 시 제약(난이도 강화) 선택 후 11~15층 반복.
- **조사 필요**: 제약 선택 UI 클래스, `mirrordungeon-constraint`의 score 기반 선택 로직(몇 개 선택 가능한지, 상호배제 규칙), 익스트림 진입 확인창이 평행중첩과 같은 클래스인지 별도인지.
- **구현**: 제약 선택 UI → 선택된 제약을 currentInfo 또는 별도 상태에 기록 → 이후 전투 난이도(적 레벨/버프)에 반영 → 11~15층 반복.
- **테스트**: 10층 클리어 후 확인창 → 제약 선택 → 11층부터 강화된 난이도로 진행.

### Phase 13 — 최종 결과 화면 (5/10/15층 각 종료 시나리오)
5층에서 멈추거나(평행중첩 거부), 10층에서 멈추거나(익스트림 거부), 15층까지 완주한 경우 모두 최종 결과창.
- **조사 필요**: Phase 9에서 규명한 `MirrorDungeonFinishedPanel`/`MirrorDungeonResultData`가 이 최종 결과창과 동일 클래스인지, 층 클리어 보상창과 최종 결과창이 다른 클래스인지 구분.
- **구현**: 위 세 종료 지점 각각에서 결과창 호출, 누적 통계(획득 기프트/처치 수 등)를 `statistics`에 반영.
- **테스트**: 세 종료 시나리오 모두 정상적으로 결과창이 뜨고 메인으로 복귀.

---

## 진행 방식

각 Phase 착수 시:
1. "조사 필요" 항목을 ilspycmd로 실제 규명 (읽기 전용, 게임 미실행 상태에서도 가능)
2. 규명 결과를 바탕으로 코드 작성 (필요시 기존 Phase 0/1 코드도 수정)
3. 빌드 → 배포 → 인게임 테스트
4. 다음 Phase로 이동

기존 진행 중이던 "Phase 0~6"(전투/보상/층전환/이벤트/경제) 계획은 이 문서로 대체한다. 특히 기존 Phase 2(EnterBattleNode의 GetDungeonStage 직접 호출)와 Phase 5(EVENT 자동통과)는 검증용 우회였으므로, 여기 Phase 4/5의 원본 경로 규명 후 재작성 대상이다.
