export interface NavItem {
  label: string
  path?: string
  children?: NavItem[]
}

export const navigation: NavItem[] = [
  {
    label: '시작하기',
    children: [
      { label: '개요', path: '/getting-started' },
      { label: '자료와 검증 기준', path: '/getting-started/sources' },
      { label: '파일 구조', path: '/getting-started/file-structure' },
      { label: '첫 번째 스킬', path: '/getting-started/first-skill' },
    ],
  },
  {
    label: '가이드',
    children: [
      {
        label: '스크립트 기초',
        children: [
          { label: 'GlitchScript 구조', path: '/guide/script-basics/structure' },
          { label: 'VALUE 시스템', path: '/guide/script-basics/values' },
          { label: '타이밍', path: '/guide/script-basics/timings' },
          { label: '조건문 & 반복문', path: '/guide/script-basics/conditions' },
          { label: '타겟팅', path: '/guide/script-basics/targeting' },
        ],
      },
      {
        label: 'MT 확장 스크립트',
        children: [
          { label: 'MTData 시스템', path: '/guide/mt/mtdata' },
          { label: 'Dynamic Locale', path: '/guide/mt/dynamic-locale' },
          { label: '추가 타이밍', path: '/guide/mt/timings' },
          { label: 'Global Lua Data', path: '/guide/mt/global-lua' },
        ],
      },
      {
        label: '커스텀 아이덴티티',
        children: [
          { label: '스킬 설계', path: '/guide/identity/skills' },
          { label: '패시브 설계', path: '/guide/identity/passives' },
          { label: 'EGO 연동', path: '/guide/identity/ego' },
        ],
      },
      {
        label: '커스텀 보스',
        children: [
          { label: '보스 유닛 설정', path: '/guide/boss/unit' },
          { label: '패턴 설계', path: '/guide/boss/patterns' },
          { label: '인카운터 구성', path: '/guide/boss/encounter' },
          { label: '커스텀 버프', path: '/guide/boss/buffs' },
        ],
      },
      { label: '문제 해결', path: '/guide/troubleshooting' },
    ],
  },
  {
    label: '레퍼런스',
    children: [
      { label: '타이밍 목록', path: '/reference/timings' },
      { label: '획득자 함수', path: '/reference/acquirers' },
      { label: '결과 함수', path: '/reference/consequences' },
      { label: '타겟팅 명세', path: '/reference/targeting' },
    ],
  },
  {
    label: 'DLL 개발',
    children: [
      { label: '개요', path: '/dll' },
      { label: '개발환경 세팅', path: '/dll/setup' },
      { label: '빌드 & 배포', path: '/dll/build-deploy' },
      { label: '광역난사', path: '/dll/gwangyeoknansa' },
      { label: 'MD 던전 DLL', path: '/dll/md-dungeon' },
    ],
  },
  {
    label: '예제',
    children: [
      { label: '기초', path: '/examples/basic' },
      { label: '중급', path: '/examples/intermediate' },
      { label: '고급', path: '/examples/advanced' },
    ],
  },
]
