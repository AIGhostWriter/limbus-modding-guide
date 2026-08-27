import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Overview from './pages/getting-started/Overview'
import Sources from './pages/getting-started/Sources'
import FileStructure from './pages/getting-started/FileStructure'
import FirstSkill from './pages/getting-started/FirstSkill'
import ScriptStructure from './pages/guide/ScriptStructure'
import Targeting from './pages/guide/Targeting'
import Conditions from './pages/guide/Conditions'
import MTData from './pages/guide/MTData'
import Values from './pages/guide/Values'
import DynamicLocale from './pages/guide/DynamicLocale'
import GlobalLuaData from './pages/guide/GlobalLuaData'
import IdentitySkills from './pages/guide/IdentitySkills'
import IdentityPassives from './pages/guide/IdentityPassives'
import EGO from './pages/guide/EGO'
import BossUnit from './pages/guide/BossUnit'
import BossPatterns from './pages/guide/BossPatterns'
import BossEncounter from './pages/guide/BossEncounter'
import CustomBuffs from './pages/guide/CustomBuffs'
import Troubleshooting from './pages/guide/Troubleshooting'
import FunctionReference from './pages/reference/FunctionReference'
import DllIndex from './pages/dll/DllIndex'
import DllSetup from './pages/dll/DllSetup'
import BuildDeploy from './pages/dll/BuildDeploy'
import Gwangyeoknansa from './pages/dll/Gwangyeoknansa'
import MdDungeon from './pages/dll/MdDungeon'
import BasicExamples from './pages/examples/BasicExamples'
import IntermediateExamples from './pages/examples/IntermediateExamples'
import AdvancedExamples from './pages/examples/AdvancedExamples'
import Placeholder from './pages/Placeholder'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />

          {/* 시작하기 */}
          <Route path="getting-started" element={<Overview />} />
          <Route path="getting-started/sources" element={<Sources />} />
          <Route path="getting-started/file-structure" element={<FileStructure />} />
          <Route path="getting-started/first-skill" element={<FirstSkill />} />

          {/* 가이드 — 스크립트 기초 */}
          <Route path="guide/script-basics/structure" element={<ScriptStructure />} />
          <Route path="guide/script-basics/values" element={<Values />} />
          <Route path="guide/script-basics/timings" element={<FunctionReference defaultCategory="timing" />} />
          <Route path="guide/script-basics/conditions" element={<Conditions />} />
          <Route path="guide/script-basics/targeting" element={<Targeting />} />

          {/* 가이드 — MT 확장 */}
          <Route path="guide/mt/mtdata" element={<MTData />} />
          <Route path="guide/mt/dynamic-locale" element={<DynamicLocale />} />
          <Route path="guide/mt/timings" element={<FunctionReference defaultCategory="timing" defaultSource="mt" />} />
          <Route path="guide/mt/global-lua" element={<GlobalLuaData />} />

          {/* 가이드 — 아이덴티티 */}
          <Route path="guide/identity/skills" element={<IdentitySkills />} />
          <Route path="guide/identity/passives" element={<IdentityPassives />} />
          <Route path="guide/identity/ego" element={<EGO />} />

          {/* 가이드 — 보스 */}
          <Route path="guide/boss/unit" element={<BossUnit />} />
          <Route path="guide/boss/patterns" element={<BossPatterns />} />
          <Route path="guide/boss/encounter" element={<BossEncounter />} />
          <Route path="guide/boss/buffs" element={<CustomBuffs />} />
          <Route path="guide/troubleshooting" element={<Troubleshooting />} />

          {/* 레퍼런스 */}
          <Route path="reference" element={<Navigate to="reference/timings" replace />} />
          <Route path="reference/timings" element={<FunctionReference defaultCategory="timing" />} />
          <Route path="reference/acquirers" element={<FunctionReference defaultCategory="acquirer" />} />
          <Route path="reference/consequences" element={<FunctionReference defaultCategory="consequence" />} />
          <Route path="reference/targeting" element={<Targeting />} />

          {/* DLL */}
          <Route path="dll" element={<DllIndex />} />
          <Route path="dll/setup" element={<DllSetup />} />
          <Route path="dll/build-deploy" element={<BuildDeploy />} />
          <Route path="dll/gwangyeoknansa" element={<Gwangyeoknansa />} />
          <Route path="dll/md-dungeon" element={<MdDungeon />} />

          {/* 예제 */}
          <Route path="examples/basic" element={<BasicExamples />} />
          <Route path="examples/intermediate" element={<IntermediateExamples />} />
          <Route path="examples/advanced" element={<AdvancedExamples />} />

          {/* 미작성 페이지 폴백 */}
          <Route path="*" element={<Placeholder title="작성 중" />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
