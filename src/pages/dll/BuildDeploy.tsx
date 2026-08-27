import CodeBlock from '../../components/CodeBlock'

export default function BuildDeploy() {
  return (
    <div>
      <h1>빌드 &amp; 배포</h1>
      <p>
        DLL 플러그인을 빌드하고 게임에 배포하는 워크플로입니다.
      </p>

      <h2>빌드 명령</h2>
      <CodeBlock
        language="bash"
        code={`dotnet build MyMod.csproj -c Release -v minimal`}
      />
      <p>
        빌드 결과물은 <code>bin/Release/net472/MyMod.dll</code>에 생성됩니다.
      </p>

      <h2>배포 경로</h2>
      <CodeBlock
        language="text"
        code={`Limbus Company/
└── BepInEx/
    └── plugins/
        └── MyMod/
            └── MyMod.dll`}
      />

      <h2>빌드 후 자동 복사 (PostBuild)</h2>
      <CodeBlock
        title=".csproj에 추가"
        language="xml"
        code={`<Target Name="PostBuild" AfterTargets="PostBuildEvent">
  <Copy
    SourceFiles="$(OutputPath)$(AssemblyName).dll"
    DestinationFolder="$(LimbusPath)\\BepInEx\\plugins\\$(AssemblyName)"
    SkipUnchangedFiles="false"
  />
</Target>`}
      />

      <h2>릴리즈 배포 구조</h2>
      <p>
        다른 사용자가 설치할 수 있게 패키징할 경우 다음 구조를 따릅니다.
      </p>
      <CodeBlock
        language="text"
        code={`MyMod_v1.0.0.zip
└── BepInEx/
    └── plugins/
        └── MyMod/
            └── MyMod.dll`}
      />

      <h2>버전 관리</h2>
      <CodeBlock
        title="Plugin.cs BepInPlugin attribute"
        language="csharp"
        code={`[BepInPlugin("com.yourname.mymod", "MyMod", "1.0.0")]`}
      />
      <p>
        버전은 <code>MAJOR.MINOR.PATCH</code> 형식을 따릅니다.
        게임 업데이트로 인해 패치가 필요할 때 버전을 올리세요.
      </p>

      <h2>의존성 선언</h2>
      <CodeBlock
        language="csharp"
        code={`// 다른 플러그인에 의존할 경우
[BepInDependency("com.other.plugin", "2.0.0")]
[BepInPlugin("com.yourname.mymod", "MyMod", "1.0.0")]
public class Plugin : BaseUnityPlugin { }`}
      />

      <h2>로그로 동작 확인</h2>
      <CodeBlock
        language="text"
        code={`// 게임 실행 후 확인
BepInEx/LogOutput.log

// 기대 출력
[Info : MyMod] MyMod loaded`}
      />
    </div>
  )
}
