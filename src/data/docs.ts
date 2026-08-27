export type DocSection = { title: string; body: string; code?: string; language?: string; note?: string }
export type DocPage = { title: string; kicker: string; summary: string; sections: DocSection[] }

export const navGroups: { label: string; items: [string, string][] }[] = [
  { label: 'START HERE', items: [['Overview','/docs/overview'],['Source & version policy','/docs/sources'],['Mod folder structure','/docs/file-structure'],['Your first script','/docs/first-script']] },
  { label: 'GLITCHSCRIPT', items: [['Execution model','/docs/glitch/structure'],['VALUE registers','/docs/glitch/values'],['Conditions & loops','/docs/glitch/conditions'],['Target selectors','/docs/glitch/targeting']] },
  { label: 'MT CUSTOM SCRIPTS', items: [['MT extensions','/docs/mt/overview'],['MTData','/docs/mt/data'],['Dynamic Locale','/docs/mt/locale'],['Global Lua Data','/docs/mt/lua']] },
  { label: 'CONTENT AUTHORING', items: [['Identity skills','/docs/content/skills'],['Passives','/docs/content/passives'],['E.G.O. integration','/docs/content/ego'],['Boss unit & part','/docs/content/boss'],['Pattern design','/docs/content/patterns'],['Encounter stage','/docs/content/encounter'],['Custom buffs','/docs/content/buffs']] },
  { label: 'REFERENCE', items: [['Function catalog','/docs/reference/functions'],['DLL development','/docs/reference/dll'],['Troubleshooting','/docs/reference/troubleshooting']] },
]

export const docs: Record<string, DocPage> = {
  '/docs/overview': {
    title: 'Documentation overview', kicker: 'START HERE',
    summary: 'A practical field manual for authors who already have Lethe installed and want to build skills, identities, encounters, bosses, and native extensions.',
    sections: [
      { title: 'Choose the right layer', body: 'Lethe JSON defines static game data. GlitchScript adds event-driven behavior. MT Custom Scripts extends the runtime with state, targeting, dynamic text, motion, and additional timings. Lua handles table-heavy or reusable logic. A DLL is the final option when the required game API is not exposed by data or scripts.' },
      { title: 'Recommended learning route', body: 'Start with one complete skill, then learn VALUE and target selectors. Add MTData only after a stateless script works. Build an encounter with an existing unit before creating a custom boss. Keep DLL work separate from data authoring until you can identify the exact engine boundary you need.' },
      { title: 'Minimal verification loop', body: 'Make one change, restart the game when the data type requires it, reproduce one action, and read the first relevant warning in LogOutput.log. Never combine an unverified timing, selector, and consequence in the same first test.', code: 'Modular/TIMING:WhenUse/log(WorkshopSkill_WhenUse)' },
    ],
  },
  '/docs/sources': {
    title: 'Source and version policy', kicker: 'START HERE',
    summary: 'Know which source answers which question, and what to do when documentation and your installed build disagree.',
    sections: [
      { title: 'Primary sources', body: 'GlitchScript is the baseline syntax reference. MT’s Custom Scripts documents extensions and version history. Modular Examples demonstrates composition patterns. The official Lethe Guide defines encounter and JSON file relationships. LEAGUE OF NINE repositories are the implementation-level source of truth.' },
      { title: 'Version snapshot', body: 'The MT reference in this guide is organized around the v24.102.4 document snapshot. Function names, argument order, supported timings, and restrictions can change. Always compare the installed plugin version with the upstream changelog.', note: 'If runtime behavior and this guide differ, trust your installed assembly, its log output, and the matching upstream version.' },
      { title: 'Evidence order', body: 'Use documentation for intent, dumpedData for valid shapes, source or interop metadata for signatures, and runtime logs for actual behavior. Do not promote an assumption to a rule until it survives a minimal in-game test.' },
    ],
  },
  '/docs/file-structure': {
    title: 'Mod folder structure', kicker: 'START HERE',
    summary: 'One directory under Lethe/mods is one mod. Keep data, locale, sprites, encounters, and scripts separated so failures are easy to isolate.',
    sections: [
      { title: 'Recommended layout', body: 'Only create folders your mod actually uses. Encounter registration needs both encounter.json and subchapterui.json in the same encounter directory.', code: `MyWorkshopMod/
├─ custom_encounters/
│  └─ WorkshopBoss/
│     ├─ encounter.json
│     └─ subchapterui.json
├─ custom_limbus_data/
│  ├─ abnormality-unit/boss.json
│  ├─ abnormality-part/body.json
│  ├─ skill/skills.json
│  └─ buff/mark.json
├─ custom_limbus_locale/EN/
├─ custom_buffs/WorkshopMark.txt
├─ custom_sprites/
└─ modular_lua/` },
      { title: 'Responsibility boundaries', body: 'Data files define records and references. Locale files provide display text. custom_buffs registers new keywords. modular_lua contains reusable behavior. Keeping these responsibilities separate makes ID and load failures visible.' },
      { title: 'ID strategy', body: 'Reserve a consistent numeric prefix for your mod. Keep encounter, unit, part, skill, passive, and locale IDs predictable. Leave gaps between skill IDs so later insertions do not require renumbering.' },
    ],
  },
  '/docs/first-script': {
    title: 'Your first Modular script', kicker: 'START HERE',
    summary: 'Create one observable effect, place it at the correct data level, and verify it before adding conditions.',
    sections: [
      { title: 'Complete skill-level example', body: 'This line runs once when the skill is used and restores 5 SP to the user.', code: `{
  "abilityScriptList": [
    {
      "scriptName": "Modular/TIMING:WhenUse/healsp(Self,5)"
    }
  ]
}`, language: 'json' },
      { title: 'Complete coin-level example', body: 'Place this inside a coin abilityScriptList. It applies 3 Burn potency when that coin lands a successful hit.', code: `{
  "operatorType": "ADD",
  "scale": 3,
  "abilityScriptList": [
    {
      "scriptName": "Modular/TIMING:OSA/buff(Target,Combustion,3,0,0)"
    }
  ]
}`, language: 'json' },
      { title: 'Verification', body: 'Confirm that the skill appears, WhenUse changes SP exactly once, and OSA only fires on a successful coin hit. If it fails, replace the consequence with log() before changing IDs or arguments.' },
    ],
  },
  '/docs/glitch/structure': {
    title: 'GlitchScript execution model', kicker: 'GLITCHSCRIPT',
    summary: 'Read every script as timing → acquire → gate → consequence. Slash-delimited batches execute from left to right.',
    sections: [
      { title: 'Annotated flow', body: 'CLEARVALUES prevents stale registers. getsp stores a value. CONTINUEIF stops the remaining batches when the condition is false.', code: `Modular
/TIMING:WhenUse
/CLEARVALUES
/VALUE_0:getsp(Self)
/CONTINUEIF(VALUE_0>29)
/buff(Self,Haste,2,0,1)` },
      { title: 'Main batches', body: 'TIMING selects the event. LOOP iterates targets. LUA and LUAMAIN call external Lua. RESETWHENUSE clears power modifiers between uses. EXPECTED asks the preview calculation to include compatible changes.' },
      { title: 'Critical rule', body: 'When multiple TIMING declarations exist in one script, the final declaration is the active one. Split effects that belong to different events into separate script strings.', note: 'Test the timing with log() before introducing selectors, VALUE math, or state.' },
    ],
  },
  '/docs/glitch/values': {
    title: 'VALUE registers', kicker: 'GLITCHSCRIPT',
    summary: 'VALUE_0 through VALUE_9 are integer registers used to move data between batches during one execution flow.',
    sections: [
      { title: 'Acquire and reuse', body: 'An acquirer returns a value. Assign it to a register before passing it to math, conditions, or consequences.', code: `Modular/TIMING:WhenUse/CLEARVALUES
/VALUE_0:getbuff(Self,Sinking,stack)
/VALUE_1:math(VALUE_0*2)
/scale(VALUE_1)` },
      { title: 'Operators', body: '+ adds, - subtracts, * multiplies, % divides as an integer, ? returns the remainder, ! clamps to a maximum, and ¡ clamps to a minimum.' },
      { title: 'Lifetime', body: 'VALUE registers are not named persistent state. Clear them in repeating passive flows. Use MTData when a value must survive into another timing or round.' },
    ],
  },
  '/docs/glitch/conditions': {
    title: 'Conditions and loops', kicker: 'GLITCHSCRIPT',
    summary: 'Choose IF for one conditional consequence and CONTINUEIF when the rest of the pipeline should stop.',
    sections: [
      { title: 'IF versus CONTINUEIF', body: 'IF guards only the consequence attached to it. CONTINUEIF controls every later batch in the current flow.', code: `/IF(VALUE_0>29):buff(Self,Haste,2,0,1)
/healsp(Self,5)

/CONTINUEIF(VALUE_0>29)
/buff(Self,Haste,2,0,1)
/healsp(Self,5)` },
      { title: 'Compound conditions', body: 'AND requires every condition, OR requires at least one, and XOR requires exactly one matching branch.', code: '/CONTINUEIF(AND,VALUE_0>0,VALUE_0<6)/' },
      { title: 'Loop discipline', body: 'LOOP changes Target to the current item. Re-acquire values inside the loop and use CONTINUEIF to skip the current item without terminating unrelated targets.' },
    ],
  },
  '/docs/glitch/targeting': {
    title: 'Target selectors', kicker: 'GLITCHSCRIPT',
    summary: 'Selectors determine which unit, skill, or coin an acquirer reads and a consequence changes.',
    sections: [
      { title: 'Unit selectors', body: 'Self is the script owner. Target or MainTarget is the primary skill target. Victim and Killer exist in damage or death timings. Ally and Enemy describe factions. EveryTarget spans all valid combatants.' },
      { title: 'Filtered targeting', body: 'Combine faction, sorting, exclusion, and count: SlowestAlly, FastestEnemy3, LowestHPAlly, or Ally ExceptSelf. Validate multi-target support in the function signature.' },
      { title: 'Skill and coin selectors', body: 'MT adds S-1, S-2-0, D-1, ModularSkill, ActiveAction selectors, original and real coin indexes, and property filters such as HEAD-true, ACTIVE-true, and COLOR-RED.' },
    ],
  },
  '/docs/mt/overview': {
    title: 'MT Custom Scripts', kicker: 'MT EXTENSIONS',
    summary: 'MT extends Modular with persistent values, dynamic locale, more timings, richer target selection, and runtime manipulation.',
    sections: [
      { title: 'Use MT when', body: 'You need state across timings, dashboard replacement, motion playback, dynamic text, world position changes, richer target control, buff inspection, or timings not exposed by baseline GlitchScript.' },
      { title: 'High-value additions', body: 'AfterSlots, BeforeRoundStart, OnGainBuff, OnChangeSP, WaitCommand, MTData, Dynamic Locale, playmotion, changeanimspeed, betterskillsend, setmaintarget, and custom skill/coin selectors cover most advanced authoring needs.' },
      { title: 'Compatibility rule', body: 'Every advanced feature has a minimum version and sometimes a narrow timing or battle-type restriction. Treat version and timing as part of the function signature.', note: 'OnSlotSelectsTarget and OnSlotSelectedAsTarget are abnormality-battle-only in the referenced snapshot.' },
    ],
  },
  '/docs/mt/data': {
    title: 'MTData', kicker: 'MT EXTENSIONS',
    summary: 'MTData stores named values by unit, data ID, and optional source so state can be read by a later execution.',
    sections: [
      { title: 'Write and read', body: 'Use a source namespace when multiple effects could reuse the same key.', code: `Modular/TIMING:OSA/CLEARVALUES
/VALUE_0:getmtdata(Self,HitCount,WorkshopPassive)
/VALUE_1:math(VALUE_0+1)
/setmtdata(Self,HitCount,VALUE_1,WorkshopPassive)` },
      { title: 'Every third hit', body: 'Read, increment, store, then test the remainder. This is a small state machine with an explicit update order.', code: `/VALUE_2:math(VALUE_1?3)
/CONTINUEIF(VALUE_2=0)
/buff(Self,Haste,3,0,1)` },
      { title: 'Reset policy', body: 'MTData is not automatically cleared like a local register. Reset round counters at RoundStart or RoundEnd, and document whether a key is per unit, per wave, or per encounter.' },
    ],
  },
  '/docs/mt/locale': {
    title: 'Dynamic Locale', kicker: 'MT EXTENSIONS',
    summary: 'Dynamic Locale changes visible descriptions without duplicating entire locale records.',
    sections: [
      { title: 'Text paths', body: 'Wrap alternatives in indexed blocks and activate the path that represents the current state.', code: `Deal +[0](50 damage)[1](50% damage)

Modular/TIMING:WhenUse/dlactivatepath(1)` },
      { title: 'Custom properties', body: 'Properties such as <!POTENCY0>, <!COUNT0>, and <!NAME> can render live buff data in supported locale contexts.' },
      { title: 'Authoring rule', body: 'Write a readable fallback sentence first. Dynamic text should clarify live mechanics, not hide essential rules behind runtime-only state.' },
    ],
  },
  '/docs/mt/lua': {
    title: 'Global Lua Data', kicker: 'MT EXTENSIONS',
    summary: 'Global Lua Data shares Lua values beyond one callback and can hold structured tables that VALUE and MTData cannot represent.',
    sections: [
      { title: 'API', body: 'setgdata(key, value) stores a Lua value, getgdata(key) reads it, and clearallgdata() resets the shared store.' },
      { title: 'Appropriate use', body: 'Use it for cached lookup tables, cross-script registries, or state that genuinely needs Lua structures. Prefer MTData for simple per-unit integers.' },
      { title: 'Lifetime warning', body: 'Global data may survive battles and client refreshes but resets when the client closes. Always initialize missing keys and never assume another mod owns the same namespace.' },
    ],
  },
  '/docs/content/skills': {
    title: 'Identity and enemy skills', kicker: 'CONTENT AUTHORING',
    summary: 'A skill combines target rules, combat type, motion, base power, coins, and behavior scripts.',
    sections: [
      { title: 'Core shape', body: 'Start from a dumped skill of the same owner and motion type. Preserve fields you do not fully understand, then change one concern at a time.', code: `{
  "id": 99000101,
  "textID": 99000101,
  "skillType": "SKILL",
  "skillTier": 1,
  "skillData": [{
    "skillTargetType": "RANDOM",
    "canDuel": true,
    "attributeType": "CRIMSON",
    "atkType": "SLASH",
    "defType": "ATTACK",
    "skillMotion": "S1",
    "targetNum": 1,
    "defaultValue": 4,
    "coinList": [
      { "operatorType": "ADD", "scale": 3, "abilityScriptList": [] }
    ]
  }]
}`, language: 'json' },
      { title: 'Skill versus coin scripts', body: 'Top-level abilityScriptList affects the whole use. Each coin abilityScriptList fires in that coin’s lifecycle. Put On Use behavior at skill level and On Hit behavior on the relevant coin.' },
      { title: 'Enemy conversion', body: 'Player identity skill IDs cannot always be referenced directly by an abnormality unit. Clone them into custom skill records and include the enemy targeting/body scripts required by the owner type.' },
    ],
  },
  '/docs/content/passives': {
    title: 'Passives', kicker: 'CONTENT AUTHORING',
    summary: 'Passives are long-lived event listeners. Their main risks are duplicate activation, stale registers, and effects firing for the wrong unit.',
    sections: [
      { title: 'Minimal passive', body: 'Keep one timing and one consequence until ownership and activation are verified.', code: `{
  "id": 99000201,
  "requireIDList": [
    "Modular/TIMING:RoundStart/buff(Self,Haste,1,0,0)"
  ]
}`, language: 'json' },
      { title: 'State hygiene', body: 'Use CLEARVALUES for repeated calculations, a data source for MTData, and explicit duplicate rules when adding passives at runtime.' },
      { title: 'Scope test', body: 'Log Self ID and instance ID during the intended timing. A passive that appears correct in a one-unit test may affect every unit when attached at the wrong data level.' },
    ],
  },
  '/docs/content/ego': {
    title: 'E.G.O. integration', kicker: 'CONTENT AUTHORING',
    summary: 'E.G.O. content connects awakening/corrosion skills, resource costs, passives, locale, and the owning identity.',
    sections: [
      { title: 'Build order', body: 'Verify the awakening skill first, then corrosion, then cost and passive activation. Reusing a known E.G.O. record as a base prevents missing display and ownership fields.' },
      { title: 'Runtime helpers', body: 'MT exposes listegoskillids for inspection and activateegopassive for an equipped E.G.O. when the timing and owner are valid.' },
      { title: 'Test matrix', body: 'Check normal use, overclock/corrosion, insufficient resources, passive activation, and UI refresh separately.' },
    ],
  },
  '/docs/content/boss': {
    title: 'Boss unit and body part', kicker: 'CONTENT AUTHORING',
    summary: 'The abnormality unit owns behavior and skills; the abnormality part receives attacks and owns HP, speed, break sections, and resistances.',
    sections: [
      { title: 'Unit-to-part contract', body: 'Every ID in abnormalityPartList must resolve to a part record. Every pattern skill must be registered in attributeList.', code: `{
  "id": 6810001,
  "appearance": "400006_VespaAppearance",
  "startActionSlotNum": 6,
  "maxActionSlotNum": 6,
  "patternID": "PickByPattern_Abnormality_UptoActionSlotCnt",
  "abnormalityPartList": [6810101],
  "attributeList": [
    { "skillId": 681001010, "number": 0 }
  ]
}`, language: 'json' },
      { title: 'Part contract', body: 'The part ID must match the unit reference. Use explicit speed arrays and verify resistance semantics against a known dumped part.' },
      { title: 'Known traps', body: 'Do not use 999 as a slot count. A starting buff with an invalid lifetime can silently fail. Unit HP and part HP should follow a deliberate scaling strategy.', note: 'For the official Yellow Harpoon example, the guide uses explicit slot counts and a starting-buff turn value of 99.' },
    ],
  },
  '/docs/content/patterns': {
    title: 'Boss pattern design', kicker: 'CONTENT AUTHORING',
    summary: 'patternList is a turn-indexed schedule of action slots. The engine cycles back to the first pattern after the final entry.',
    sections: [
      { title: 'One slot', body: 'A slot contains parent choices and child skill choices. Keep chance values simple until deterministic behavior works.', code: `{
  "skillParentList": [{
    "skillChildList": [{
      "skillID": 681001010,
      "chance": 1
    }],
    "chance": 1
  }]
}`, language: 'json' },
      { title: 'Alignment rules', body: 'The slotList length should match startActionSlotNum. Every referenced skill belongs in attributeList. Keep signature skills in stable slot positions when readability matters.' },
      { title: 'Design advice', body: 'Alternate pressure, setup, defense, and payoff turns. Verify the pattern cycle with harmless skills before adding phase transitions or forced turn endings.' },
    ],
  },
  '/docs/content/encounter': {
    title: 'Encounter stage', kicker: 'CONTENT AUTHORING',
    summary: 'A visible custom stage requires encounter.json and subchapterui.json, plus every enemy unit referenced by the wave.',
    sections: [
      { title: 'Encounter record', body: 'The encounter defines stage rules, participant limits, map, waves, positions, BGM, cost, and turn limit.', code: `{
  "id": 681001,
  "stageLevel": 60,
  "stageType": "Abnormality",
  "participantInfo": { "min": 1, "max": 12 },
  "waveList": [{
    "battleMapInfo": {
      "mapName": "Cp9_Middlefinger",
      "mapSize": 33.0
    },
    "unitList": [{
      "unitID": 6810001,
      "unitCount": 1,
      "unitLevel": 87
    }]
  }],
  "staminaCost": 0,
  "turnLimit": 99
}`, language: 'json' },
      { title: 'Stage node', body: 'subchapterId and nodeId should match encounter.id. Playground placement is the simplest development target because it avoids story progression dependencies.' },
      { title: 'Multi-wave rule', body: 'Add another wave object. When retaining the current map, later waves can use an empty mapName where supported by the current Lethe behavior.' },
    ],
  },
  '/docs/content/buffs': {
    title: 'Custom buffs', kicker: 'CONTENT AUTHORING',
    summary: 'A custom buff needs keyword registration, behavior data, locale, and an application path that all share the exact same ID.',
    sections: [
      { title: 'Required files', body: 'Create custom_buffs/WorkshopMark.txt, custom_limbus_data/buff/workshop_mark.json, and EN locale entries under bufList and keywordList. Add a custom sprite only when needed.' },
      { title: 'Behavior record', body: 'Choose a buff class that matches the values you need: NonvolatileBuff or VolatileBuff for potency-only behavior, CountableBuff for potency and count, or sinBuff for major-status-style behavior.', code: `{
  "list": [{
    "id": "WorkshopMark",
    "iconId": "Nail",
    "buffClass": "CountableBuff",
    "buffType": "Positive",
    "maxStack": 20,
    "maxTurn": 10,
    "destroyableOnZero": true,
    "destroyableOnZeroTurn": true,
    "canBeDespelled": false,
    "list": [],
    "categoryKeywordList": []
  }]
}`, language: 'json' },
      { title: 'Apply from a coin', body: 'The keyword is case-sensitive and must match the registration filename and locale IDs.', code: `{
  "scriptName": "GiveBuffOnSucceedAttack",
  "buffData": {
    "buffKeyword": "WorkshopMark",
    "target": "Target",
    "stack": 3,
    "turn": 2
  }
}`, language: 'json' },
    ],
  },
  '/docs/reference/functions': {
    title: 'Function catalog', kicker: 'REFERENCE',
    summary: 'Use the catalog by intent: first select a timing, then an acquirer, then a consequence. The signature includes target cardinality and version restrictions.',
    sections: [
      { title: 'High-frequency timings', body: 'WhenUse, BeforeAttack, WinDuel, OSA, BSA, EndSkill, RoundStart, EncounterStart, WhenHit, OnDie, AfterSlots, BeforeRoundStart, and OnGainBuff cover most behaviors.' },
      { title: 'High-frequency acquirers', body: 'gethp, getsp, getshield, getbuff, getround, getdmg, getskillid, coinstate, iscrit, getdata, getmtdata, getspeed, getpattern, and random.' },
      { title: 'High-frequency consequences', body: 'buff, healsp, healhp, shield, bonusdmg, scale, base, final, clash, reusecoin, coincancel, changeskill, skillsend, setmtdata, playmotion, and log.' },
    ],
  },
  '/docs/reference/dll': {
    title: 'DLL development', kicker: 'REFERENCE',
    summary: 'Use a BepInEx IL2CPP DLL only when the feature requires engine APIs, lifecycle interception, or reusable native integration that scripts cannot express safely.',
    sections: [
      { title: 'Before writing code', body: 'Identify the exact type and method with ilspycmd against the current interop assembly. Separate confirmed signatures from assumptions. Search existing mods for patch ownership and lifecycle conflicts.' },
      { title: 'Safe development loop', body: 'Observe first, patch the narrowest method, build, deploy only while the game is closed, and validate with a unique log prefix. Do not swallow exceptions as a substitute for initialization.' },
      { title: 'Document each DLL', body: 'Record purpose, supported game build, patch targets, configuration, deployment path, known conflicts, test steps, and rollback procedure.' },
    ],
  },
  '/docs/reference/troubleshooting': {
    title: 'Troubleshooting', kicker: 'REFERENCE',
    summary: 'Debug in four layers: file load, ID graph, timing activation, then consequence execution.',
    sections: [
      { title: 'Stage is missing', body: 'Confirm subchapterui.json exists beside encounter.json. Match encounter.id, subchapterId, and nodeId. Read the first Lethe warning during mod load.' },
      { title: 'Boss has empty slots', body: 'Confirm the skill is a valid enemy-side custom record, appears in attributeList, is referenced by patternList, and the slot count matches slotList.' },
      { title: 'Script does not fire', body: 'Replace the consequence with log(). If no log appears, the problem is timing, attachment level, owner, or data loading—not the original consequence.', code: 'Modular/TIMING:WhenUse/log(WorkshopProbe)' },
      { title: 'Read the first error', body: 'A later NullReferenceException is often a consequence of an earlier load or ID failure. Start at the first warning after the mod begins loading.' },
    ],
  },
}
