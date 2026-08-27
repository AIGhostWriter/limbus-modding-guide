import CodeBlock from '../../components/CodeBlock'

export default function DllSetup() {
  return (
    <div>
      <h1>개발환경 세팅</h1>
      <p>
        Limbus Company BepInEx 플러그인(DLL)을 개발하기 위한 환경 구성입니다.
      </p>

      <h2>필수 도구</h2>
      <table>
        <thead><tr><th>도구</th><th>버전</th><th>용도</th></tr></thead>
        <tbody>
          <tr><td>.NET SDK</td><td>6.0+</td><td>C# 컴파일</td></tr>
          <tr><td>Visual Studio / Rider</td><td>최신</td><td>IDE</td></tr>
          <tr><td>BepInEx</td><td>5.4.x</td><td>모드 로더</td></tr>
          <tr><td>dnSpy / ILSpy</td><td>-</td><td>게임 DLL 디컴파일</td></tr>
        </tbody>
      </table>

      <h2>프로젝트 생성</h2>
      <CodeBlock
        language="bash"
        code={`mkdir MyMod
cd MyMod
dotnet new classlib -n MyMod -f net472`}
      />

      <h2>.csproj 설정</h2>
      <CodeBlock
        title="MyMod.csproj"
        language="xml"
        code={`<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net472</TargetFramework>
    <AssemblyName>MyMod</AssemblyName>
    <RootNamespace>MyMod</RootNamespace>
  </PropertyGroup>

  <ItemGroup>
    <!-- BepInEx core -->
    <Reference Include="BepInEx">
      <HintPath>$(LimbusPath)\\BepInEx\\core\\BepInEx.dll</HintPath>
      <Private>false</Private>
    </Reference>

    <!-- 게임 어셈블리 -->
    <Reference Include="Assembly-CSharp">
      <HintPath>$(LimbusPath)\\Limbus Company_Data\\Managed\\Assembly-CSharp.dll</HintPath>
      <Private>false</Private>
    </Reference>
  </ItemGroup>
</Project>`}
      />

      <h2>LimbusPath 환경변수 설정</h2>
      <CodeBlock
        language="powershell"
        code={`# 시스템 환경변수로 게임 경로 지정
[System.Environment]::SetEnvironmentVariable(
  "LimbusPath",
  "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Limbus Company",
  "User"
)`}
      />

      <h2>기본 플러그인 클래스</h2>
      <CodeBlock
        title="Plugin.cs"
        language="csharp"
        code={`using BepInEx;
using BepInEx.Logging;
using HarmonyLib;

namespace MyMod
{
    [BepInPlugin("com.yourname.mymod", "MyMod", "1.0.0")]
    public class Plugin : BaseUnityPlugin
    {
        internal static ManualLogSource Log;
        private readonly Harmony _harmony = new Harmony("com.yourname.mymod");

        private void Awake()
        {
            Log = Logger;
            _harmony.PatchAll();
            Log.LogInfo("MyMod loaded");
        }
    }
}`}
      />

      <h2>Harmony 패치 예시</h2>
      <CodeBlock
        language="csharp"
        code={`using HarmonyLib;

[HarmonyPatch(typeof(TargetClass), "MethodName")]
public class MyPatch
{
    static void Postfix(TargetClass __instance)
    {
        // 원본 메서드 실행 후 추가 로직
        Plugin.Log.LogInfo("Patched!");
    }
}`}
      />

      <h2>디버그 로그 확인</h2>
      <CodeBlock
        language="text"
        code={`// BepInEx/LogOutput.log 에서 확인
// 게임 실행 후 해당 파일을 열어 로그 확인
BepInEx\\LogOutput.log`}
      />
    </div>
  )
}
