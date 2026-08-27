import CodeBlock from '../../components/CodeBlock'

export default function GlobalLuaData() {
  return (
    <div>
      <h1>Global Lua Data</h1>
      <p>
        MT Custom Scripts v0.18.7에서 추가된 기능입니다.
        전투 종료 후에도 유지되는 전역 Lua 저장소입니다.
        클라이언트를 닫으면 초기화됩니다.
      </p>

      <h2>함수</h2>
      <table>
        <thead><tr><th>함수</th><th>설명</th></tr></thead>
        <tbody>
          <tr>
            <td><code>setgdata(key, luaValue)</code></td>
            <td>전역 값을 저장합니다</td>
          </tr>
          <tr>
            <td><code>getgdata(key)</code></td>
            <td>전역 값을 조회합니다</td>
          </tr>
          <tr>
            <td><code>clearallgdata()</code></td>
            <td>모든 전역 값을 초기화합니다</td>
          </tr>
        </tbody>
      </table>

      <h2>MTData와의 차이</h2>
      <table>
        <thead><tr><th>특성</th><th>MTData</th><th>Global Lua Data</th></tr></thead>
        <tbody>
          <tr><td>범위</td><td>유닛별, 전투 내</td><td>전역, 전투 간 유지</td></tr>
          <tr><td>유형</td><td>정수</td><td>Lua 값 (테이블, 문자열 포함)</td></tr>
          <tr><td>초기화 시점</td><td>전투 종료 시</td><td>클라이언트 종료 시</td></tr>
          <tr><td>사용 가능 위치</td><td>Modular 스크립트</td><td>Lua 스크립트 전용</td></tr>
        </tbody>
      </table>

      <h2>사용 예 (Lua 스크립트)</h2>
      <CodeBlock
        title="저장"
        language="lua"
        code={`-- 전투 결과를 전역으로 저장
local result = { wins = 3, losses = 1 }
setgdata("battleResult", result)`}
      />
      <CodeBlock
        title="조회"
        language="lua"
        code={`local data = getgdata("battleResult")
if data ~= nil then
    log("Wins: " .. data.wins)
end`}
      />

      <h2>주의사항</h2>
      <ul>
        <li>Lua 스크립트 전용입니다. Modular 스크립트 배치에서 직접 사용할 수 없습니다.</li>
        <li>전투 간 상태 추적이 필요한 경우에만 사용하세요. 단순한 전투 내 카운터는 MTData로 충분합니다.</li>
        <li>클라이언트 재시작 시 초기화되므로 영구 저장이 아닙니다.</li>
      </ul>
    </div>
  )
}
