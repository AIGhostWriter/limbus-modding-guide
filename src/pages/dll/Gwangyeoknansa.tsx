import CodeBlock from '../../components/CodeBlock'

export default function Gwangyeoknansa() {
  return (
    <div>
      <h1>광역난사 (GwangYeokNansa)</h1>
      <p>
        코인 단위 무작위 타겟팅 플러그인입니다. 퓨리오스(Furioso) 메커니즘을 구현합니다.
        스킬의 각 코인이 독립적으로 무작위 대상을 선택합니다.
      </p>

      <h2>작동 원리</h2>
      <p>
        일반적인 광역 스킬은 <code>targetNum</code>을 올려 여러 적을 동시에 공격합니다.
        그러나 <code>targetNum &gt; 1</code>이면 스킬 시작 시 모든 타겟이 동시에 피격 모션을 취하는
        버그가 발생합니다. 이 DLL은 <code>targetNum</code>을 1로 유지한 채로,
        코인 결과가 확정될 때마다 타겟을 동적으로 교체해 순차 피격을 구현합니다.
      </p>

      <h2>파일 배치</h2>
      <CodeBlock
        language="text"
        code={`GwangYeokNansa.dll → BepInEx/plugins/GwangYeokNansa.dll`}
      />

      <h2>스킬 JSON 필수 설정</h2>
      <CodeBlock
        language="json"
        code={`{
  "id": 90000001,
  "skillData": [{
    "targetNum": 1,
    "canChangeTarget": true,
    "coinList": [ ... ]
  }]
}`}
      />
      <p>
        <strong><code>targetNum</code>은 반드시 1이어야 합니다.</strong>
        <code>canChangeTarget: true</code>도 필수입니다.
      </p>

      <h2>스킬 ID 등록</h2>
      <p>
        <code>광역난사Plugin.cs</code>의 HashSet에 스킬 ID를 등록합니다.
      </p>

      <CodeBlock
        title="보스 → 아군 방향"
        language="csharp"
        code={`internal static readonly HashSet<int> BossToPlayerIDs = new()
{
    90000001,
    // 추가할 스킬 ID
};`}
      />

      <CodeBlock
        title="아군 → 적 방향"
        language="csharp"
        code={`internal static readonly HashSet<int> PlayerToEnemyIDs = new()
{
    19999901,
};`}
      />

      <h2>빌드 및 배포</h2>
      <CodeBlock
        language="powershell"
        code={`# 빌드
dotnet build 광역난사.csproj -c Release -v minimal

# 배포 (게임 종료 후)
Copy-Item .\\bin\\Release\\net6.0\\GwangYeokNansa.dll \`
  ..\\LetheLauncher-Distribution-7\\BepInEx\\plugins\\GwangYeokNansa.dll -Force`}
      />

      <h2>로드 확인</h2>
      <p>
        게임 실행 후 <code>BepInEx/LogOutput.log</code>에서 다음 로그를 확인합니다.
      </p>
      <CodeBlock
        language="text"
        code={`[Info  : 광역난사] 플러그인 로드 완료.`}
      />

      <h2>트러블슈팅</h2>
      <table>
        <thead>
          <tr>
            <th>증상</th>
            <th>원인</th>
            <th>해결</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>동시 피격 모션</td>
            <td><code>targetNum</code>이 1이 아님</td>
            <td>JSON에서 <code>"targetNum": 1</code> 확인</td>
          </tr>
          <tr>
            <td>타겟이 바뀌지 않음</td>
            <td>스킬 ID가 HashSet에 없음</td>
            <td><code>BossToPlayerIDs</code> 또는 <code>PlayerToEnemyIDs</code>에 추가 후 재빌드</td>
          </tr>
          <tr>
            <td>로드 메시지 없음</td>
            <td>DLL이 plugins 폴더에 없음</td>
            <td>배포 경로 재확인</td>
          </tr>
          <tr>
            <td>보스가 스킬 없음</td>
            <td>스킬 ID가 attributeList에 없음</td>
            <td><code>abnormality-unit</code> JSON의 <code>attributeList</code> 확인</td>
          </tr>
        </tbody>
      </table>

      <h2>ID 충돌 방지</h2>
      <table>
        <thead>
          <tr>
            <th>범위</th>
            <th>용도</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>101375</code></td><td>원본 Rien 퓨리오스 — 사용 금지</td></tr>
          <tr><td><code>90000001~</code></td><td>광역난사 테스트 전용</td></tr>
          <tr><td><code>19999901~03</code></td><td>플레이어 향 예시 (미사용)</td></tr>
          <tr><td><code>5999001</code></td><td>광역난사 테스트 보스 유닛</td></tr>
          <tr><td><code>599901</code></td><td>광역난사 테스트 인카운터</td></tr>
        </tbody>
      </table>

      <h2>소스 위치</h2>
      <CodeBlock
        language="text"
        code={`C:\\Users\\이동혁\\Desktop\\LIMBUS\\광역난사\\
├── 광역난사.csproj
├── 광역난사Plugin.cs
└── SkillTemplate.json`}
      />
    </div>
  )
}
