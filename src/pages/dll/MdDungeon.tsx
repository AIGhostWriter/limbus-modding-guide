import CodeBlock from '../../components/CodeBlock'

export default function MdDungeon() {
  return (
    <div>
      <h1>MDOffline DLL</h1>
      <p>
        MDOffline은 미러던전을 오프라인(서버 없이) 플레이할 수 있게 만드는 BepInEx 플러그인입니다.
        서버 의존 구간을 직접 재현하거나 우회해 인카운터 진입, 보스 클리어, 상점 이용이 가능합니다.
      </p>

      <h2>소스 및 경로</h2>
      <CodeBlock
        language="text"
        code={`소스: C:\\Users\\이동혁\\Desktop\\MDOffline\\MDOffline.cs
빌드: MDOffline\\bin\\Release\\net6.0\\MDOffline.dll
배포: BepInEx\\plugins\\MDOffline.dll`}
      />

      <h2>빌드 & 배포</h2>
      <CodeBlock
        language="powershell"
        code={`dotnet build MDOffline.csproj -c Release -v minimal

# 빌드 후 복사
Copy-Item "MDOffline\\bin\\Release\\net6.0\\MDOffline.dll" \`
  "LIMBUS\\BepInEx\\plugins\\MDOffline.dll" -Force`}
      />

      <h2>핵심 설계 원칙</h2>
      <p>
        서버 요청을 모킹하거나 가로채는 방식은 Lethe 자체가 더 앞단(<code>HttpApiRequester.AddRequest</code>)을
        이미 패치하기 때문에 동작하지 않습니다.
        서버가 반환해야 할 데이터를 직접 분석해 하드코딩으로 재구현해야 합니다.
      </p>

      <h2>주요 훅 포인트</h2>
      <table>
        <thead><tr><th>패치 대상</th><th>설명</th></tr></thead>
        <tbody>
          <tr>
            <td><code>MirrorDungeonManager.Init</code> Postfix</td>
            <td>노드 강제 주입</td>
          </tr>
          <tr>
            <td><code>MirrorDungeonManager.TryEnterCurrentEncounterNode</code> Prefix</td>
            <td>전투/이벤트 인터셉트</td>
          </tr>
          <tr>
            <td><code>UIButton.OnPointerClick</code></td>
            <td>BOSS 노드 클릭 시 <code>DungeonBattleStartManager.StartStage</code> 직접 호출</td>
          </tr>
        </tbody>
      </table>

      <h2>ENCOUNTER 타입 enum</h2>
      <CodeBlock
        language="csharp"
        code={`// 확정된 ENCOUNTER 값
START        = 0
BATTLE       = 1
HARD_BATTLE  = 2
EVENT        = 3
SAVE         = 4
AB_BATTLE    = 5
BOSS         = 6
MIRROR_SHOP  = 10
MIRROR_SELECT_EVENT = 11
HARD_AB_BATTLE      = 14
HIDDEN_BATTLE       = 15`}
      />

      <h2>보스 클리어 후 복귀 — LeaveStageWithoutServerManager</h2>
      <p>
        전투 종료 후 서버 의존 결과조회 경로가 막혀 멈추는 문제는
        <code>LeaveStageWithoutServerManager.LeaveStage()</code>로 해결합니다.
        이 static 함수가 게임 내부의 공식 오프라인 복귀 경로입니다.
      </p>
      <CodeBlock
        language="csharp"
        code={`// StageResultData를 리플렉션으로 직접 구성
var stageResult = new StageResultData();
var setResult = typeof(StageResultData).GetMethod("SetResult");

// 파라미터를 이름으로 매핑해 SetResult 호출
setResult.Invoke(stageResult, BuildSetResultArgs(
    isWin: true,
    isNormalEnd: true,
    stageData: PendingStageData,
    formation: CachedFormation,
    stageType: STAGE_TYPE.MIRROR_DUNGEON
));

LeaveStageWithoutServerManager.LeaveStage(stageResult, CachedFormation);`}
      />

      <h2>커스텀 인카운터 교체</h2>
      <CodeBlock
        language="csharp"
        code={`// 원본 BOSS 노드(ID 9000003) → 커스텀 인카운터로 교체
const int CUSTOM_ENCOUNTER_ID = 9381841;

var stageData = GlobalData.GetDungeonStage(CUSTOM_ENCOUNTER_ID, false, 2);
if (stageData == null)
    stageData = GlobalData.GetDungeonStage(9000003, false, 2); // 폴백`}
      />

      <h2>상점 UI (MIRROR_SHOP)</h2>
      <CodeBlock
        language="csharp"
        code={`// MirrorDungeonShopUI_Season5 는 비활성 상태로 존재
var shopGO = Resources
    .FindObjectsOfTypeAll<GameObject>()
    .FirstOrDefault(g => g.name == "MirrorDungeonShopUI_Season5");

// DOTween 페이드 충돌 우회: 매 10프레임 alpha 강제 복원
if (_frameCount % 10 == 0)
    shopCanvasGroup.alpha = 1f;

// 검정 오버레이 제거
MirrorDungeonManager.Instance.SetBlackIamgeActive(false);`}
      />

      <h2>shopInfo JSON 구조</h2>
      <CodeBlock
        language="json"
        code={`{
  "shopInfo": [
    {
      "slotType": "EGO_GIFT_SLOT",
      "egoGiftId": 10001,
      "isPurchased": false,
      "isKeywordRefreshable": true,
      "keyword": "BURN",
      "chipCount": 5
    }
  ]
}`}
      />

      <h2>REPL(UnityExplorer) 활용</h2>
      <p>
        정적 분석이 막힐 때 게임 내 C# 콘솔로 라이브 상태를 직접 조회합니다.
      </p>
      <CodeBlock
        language="csharp"
        code={`// 비활성 오브젝트 포함 전체 검색
var all = Resources.FindObjectsOfTypeAll<GameObject>();
foreach (var go in all)
    if (go.name.Contains("MirrorDungeon"))
        Log(go.name + " active=" + go.activeSelf);`}
      />

      <h2>스태틱 데이터 경로</h2>
      <CodeBlock
        language="text"
        code={`BepInEx/plugins/Lethe/dumpedData/limbus_data/
├── mirrordungeon/0.json          ← 층 설정
├── mirrordungeon-theme-floor/    ← 테마별 에고 기프트 풀
├── ego-gift-mirrordungeon/       ← 에고 기프트 데이터
├── battle-mirrordungeon/         ← 전투팩
├── generatenodepool/             ← 노드 풀 (732개)
└── encounterinfo/                ← 보상 테이블`}
      />
    </div>
  )
}
