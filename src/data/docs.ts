export type DocSection = { title: string; body: string; code?: string; language?: string; note?: string }
export type DocPage = { title: string; kicker: string; summary: string; sections: DocSection[] }

export const navGroups: { label: string; items: [string, string][] }[] = [
  { label: 'SCRIPT REFERENCE', items: [['All functions','/docs/reference/functions'],['Reload matrix','/docs/reference/reload'],['Troubleshooting','/docs/reference/troubleshooting']] },
  { label: 'GLITCHSCRIPT', items: [['GlitchScript catalog','/docs/reference/glitch'],['Execution model','/docs/glitch/structure'],['VALUE registers','/docs/glitch/values'],['Conditions & loops','/docs/glitch/conditions'],['Target selectors','/docs/glitch/targeting']] },
  { label: 'MT CUSTOM SCRIPTS', items: [['MT catalog','/docs/reference/mt'],['MT extensions','/docs/mt/overview'],['MTData','/docs/mt/data'],['Dynamic Locale','/docs/mt/locale'],['Global Lua Data','/docs/mt/lua']] },
  { label: 'LETHE GUIDE', items: [['Chapter 1 · Boss data','/docs/original/chapter-1'],['Chapter 2 · Encounter','/docs/original/chapter-2'],['Chapter 3 · Lua','/docs/original/chapter-3'],['Chapter 4 · Soji Abi','/docs/original/chapter-4'],['Custom Identity','/docs/original/identity']] },
  { label: 'DLL', items: [['DLL','/docs/dll']] },
]

export const docs: Record<string, DocPage> = {
  '/docs/install': {
    title: 'Installation and data dump', kicker: 'START HERE',
    summary: 'Prepare a reproducible Lethe workspace, obtain reference data, and know exactly when a reload is sufficient.',
    sections: [
      { title: 'Requirements', body: 'Use a working Lethe installation, a text editor with JSON support, and a clean mod directory. Keep the game data dump as read-only reference material; never edit dumped records in place.' },
      { title: 'Dump static data', body: 'Use Lethe keybind 0 in a safe menu to generate the current static-data reference. Copy only the records you need into your mod and assign your own IDs. Regenerate the dump after updates that change record structures.' },
      { title: 'Fast iteration', body: 'Keybind 8 reloads most ordinary data and locale. New DLL builds, new custom_buffs registrations, and new custom_unit_keywords require a full game restart. Verify one small change per cycle and keep LogOutput.log open beside the editor.' },
    ],
  },
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
    title: 'Identity and enemy skills', kicker: 'LETHE GUIDE',
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
    title: 'Passives', kicker: 'LETHE GUIDE',
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
    title: 'E.G.O. integration', kicker: 'LETHE GUIDE',
    summary: 'E.G.O. content connects awakening/corrosion skills, resource costs, passives, locale, and the owning identity.',
    sections: [
      { title: 'Build order', body: 'Verify the awakening skill first, then corrosion, then cost and passive activation. Reusing a known E.G.O. record as a base prevents missing display and ownership fields.' },
      { title: 'Runtime helpers', body: 'MT exposes listegoskillids for inspection and activateegopassive for an equipped E.G.O. when the timing and owner are valid.' },
      { title: 'Test matrix', body: 'Check normal use, overclock/corrosion, insufficient resources, passive activation, and UI refresh separately.' },
    ],
  },
  '/docs/content/boss': {
    title: 'Boss unit and body part', kicker: 'LETHE GUIDE',
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
    title: 'Boss pattern design', kicker: 'LETHE GUIDE',
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
    title: 'Encounter stage', kicker: 'LETHE GUIDE',
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
    title: 'Custom buffs', kicker: 'LETHE GUIDE',
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
  '/docs/content/locale': {
    title: 'Localization', kicker: 'LETHE GUIDE',
    summary: 'Treat locale as part of the data graph: an ID is not complete until every player-facing name, description, and keyword resolves.',
    sections: [
      { title: 'Directory contract', body: 'Place language files under custom_limbus_locale/<LANG>. Mirror the official list names such as personalityList, skillList, passiveList, bufList, and keywordList. Keep IDs identical to their data records.' },
      { title: 'Minimal skill locale', body: 'A skill normally needs a name and description. Keep description placeholders aligned with the runtime values supplied by the script.', code: `{
  "dataList": [{
    "id": 681001010,
    "name": "Workshop Strike",
    "desc": "On hit, inflict 3 Workshop Mark."
  }]
}`, language: 'json' },
      { title: 'Dynamic text', body: 'MT Dynamic Locale can read runtime values and custom properties. Use it only after the static entry resolves correctly, and provide safe fallback text when the value is unavailable.' },
    ],
  },
  '/docs/content/maps-stories': {
    title: 'Maps and stories', kicker: 'LETHE GUIDE',
    summary: 'Connect a battle map, story script, and encounter node without hiding the dependency chain.',
    sections: [
      { title: 'Map selection', body: 'Start from a confirmed dumped mapName and explicit mapSize. A stage that loads with a blank arena usually has an invalid map reference or a plugin-specific asset requirement.' },
      { title: 'Story chain', body: 'A custom chapter connects chapter registration, node UI, encounter data, and story scripts. Test the story file independently before attaching it to a battle transition.' },
      { title: 'StoryScriptLoader extension', body: 'The local StoryScriptLoader project adds battle-story encounter discovery and a configurable story JSON format. Its guide documents optional fields, folder layout, and the runtime loading path; the final page will distinguish standard Lethe story data from DLL-provided behavior.' },
    ],
  },
  '/docs/content/motions': {
    title: 'Motions, VFX and SFX', kicker: 'LETHE GUIDE',
    summary: 'Build presentation assets as a separate layer so combat logic stays testable when bundles or effects fail.',
    sections: [
      { title: 'Motion package', body: 'The motions ecosystem separates bundle setup, attack timelines, character VFX, dashboard VFX, buff VFX, SFX, and screen borders. Begin with the smallest valid motion before adding effects.' },
      { title: 'Asset isolation', body: 'Give bundles and assets stable unique names. Verify loading first, then playback, then timing. Avoid diagnosing a missing VFX by changing the skill script and bundle simultaneously.' },
      { title: 'Runtime control', body: 'MT functions can play or alter motions at runtime. Document whether a command targets a unit, skill, dashboard element, or world position, because each context has different valid timings.' },
    ],
  },
  '/docs/recipes/basic': {
    title: 'Basic recipes', kicker: 'PRACTICAL RECIPES',
    summary: 'Copy-ready effects that demonstrate one timing, one target, and one consequence at a time.',
    sections: [
      { title: 'Apply a status on hit', body: 'Attach this to a coin. OSA fires only when that coin successfully attacks.', code: 'Modular/TIMING:OSA/buff(Target,Combustion,3,0,0)' },
      { title: 'Recover SP on use', body: 'Attach this at skill level so it runs once per skill rather than once per coin.', code: 'Modular/TIMING:WhenUse/healsp(Self,5)' },
      { title: 'Gain a shield', body: 'Use a self target and verify the shield appears before introducing any scaling formula.', code: 'Modular/TIMING:WhenUse/shield(Self,10)' },
    ],
  },
  '/docs/recipes/intermediate': {
    title: 'Intermediate recipes', kicker: 'PRACTICAL RECIPES',
    summary: 'Combine acquisition, conditions, registers, and loops while keeping the execution order visible.',
    sections: [
      { title: 'Scale from a status', body: 'Clear registers, read the target status, cap the result, and apply the final value.', code: 'Modular/TIMING:OSA/CLEARVALUES/VALUE_0:getbuff(Target,Combustion)/VALUE_0:math(VALUE_0!5)/bonusdmg(Target,VALUE_0,COMBAT)' },
      { title: 'Conditional support', body: 'Read an ally value before gating the remaining batches.', code: 'Modular/TIMING:RoundStart/VALUE_0:getspeed(SlowestAlly)/CONTINUEIF(VALUE_0<5)/buff(SlowestAlly,Haste,3,0,1)' },
      { title: 'Loop safely', body: 'Use LOOP only when each member needs independent acquisition and conditions. Clear or overwrite registers inside the loop to prevent values leaking between members.' },
    ],
  },
  '/docs/recipes/advanced': {
    title: 'Advanced recipes', kicker: 'PRACTICAL RECIPES',
    summary: 'Compose persistent state, instance identity, random branches, and Lua into maintainable battle systems.',
    sections: [
      { title: 'Persistent hit counter', body: 'Read MTData, increment it, store it, and trigger a payoff at the threshold. Reset the key deliberately at RoundStart or after the payoff rather than relying on VALUE lifetime.' },
      { title: 'Per-instance state', body: 'Use instance IDs when multiple copies of the same unit or buff can exist. Character IDs identify a record type; instance IDs identify the live combat object.' },
      { title: 'State-machine rule', body: 'Give every state one entry condition, one effect, and one explicit transition. Log the state name before applying damage or changing skills so a bad transition is observable.' },
    ],
  },
  '/docs/dll': {
    title: 'DLL', kicker: 'DLL',
    summary: 'DLL documentation has been cleared and will be rebuilt from the original project data.',
    sections: [],
  },
  '/docs/dll/battle': {
    title: 'Battle and skill plugins', kicker: 'DLL HUB',
    summary: 'Plugins that alter target selection, action flow, field state, passives, or skill execution.',
    sections: [
      { title: 'GwangYeokNansa / AlphaStrike', body: 'Implements coin-by-coin random ally targeting for registered enemy skills. The local guide covers DLL deployment, skill-ID registration, JSON prerequisites, ID collision avoidance, logs, and troubleshooting. AlphaStrike research identifies the working hook and records failed approaches that should not be repeated.' },
      { title: 'SkillInterrupter', body: 'Interrupts the current skill through a narrow runtime hook. Its local documentation explains why the hook was selected, the minimal skill JSON, coexistence with other abilities, deployment, and expected log output.' },
      { title: 'BattleMessage and FireFieldForcer', body: 'BattleMessage parses passive commands at defined timings and maps special Dante abilities. FireFieldForcer forces a field effect through native APIs and includes a full patch example, unit retargeting, build steps, and effect-specific troubleshooting.' },
      { title: 'Additional inventory', body: 'EncounterRetry, Clash Overdrive, LetheGiftLua, EgoGiftInjector, UnitScaler, SkillRoulette, SubUnitSpawner, UnitRetreater, and related experiments will receive separate pages after their source-level behavior is verified.' },
    ],
  },
  '/docs/dll/presentation': {
    title: 'Cinematics and presentation', kicker: 'DLL HUB',
    summary: 'Native extensions for pre-battle sequences, lyrics, trails, UI control, and showcase presentation.',
    sections: [
      { title: 'BattleCinematicPlayer', body: 'Discovers encounter mappings, loads a Unity bundle, and drives cinematics.json. The local English guide covers package layout, Aqua bundle construction, installation, verification, configurable values, and current technical coupling.' },
      { title: 'Native pre-battle research', body: 'The companion research tracks StageController call order, ProduceWait transitions, BattleProduceManager state, callback order, camera changes, HUD visibility, PlayableDirector state, and Harmony conflicts. It will be labeled Research rather than presented as a stable API.' },
      { title: 'LyricsOverride and visual utilities', body: 'LyricsOverride documents configuration fields, text styles, Harmony patches, and build steps. BattleCinematicObserver, SpriteTrailRuntime, GachaShowcase, NoMoreUI, and PR_MIRROR remain source-verification candidates.' },
    ],
  },
  '/docs/dll/maps': {
    title: 'Map and story plugins', kicker: 'DLL HUB',
    summary: 'Extensions that load animated media, custom story scripts, or additional chapter behavior.',
    sections: [
      { title: 'AnimatedMapSupport', body: 'Supports static images, GIF, video, and PNG sequences. Its JSON system includes common object fields, idle animation presets, event triggers, movement, scale, rotation, fade, tint, shake, media controls, loops, and waypoint movement.' },
      { title: 'GifMapSupport', body: 'A narrower animated-map implementation retained as a separate compatibility entry until overlap with AnimatedMapSupport is verified.' },
      { title: 'Story plugins', body: 'StoryScriptLoader has a documented battle-story format and runtime loading path. StoryEditorPlugin, CustomStoryBattle, and MyCustomChapterMod will be described from their actual registration and lifecycle code.' },
    ],
  },
  '/docs/dll/mirror-dungeon': {
    title: 'Mirror Dungeon systems', kicker: 'DLL HUB',
    summary: 'Research and extensions for reproducing server-backed Mirror Dungeon flows locally.',
    sections: [
      { title: 'MDOffline scope', body: 'The local plan covers team formation, star blessings, theme-pack selection, node movement, interaction buttons, stage panels, E.G.O gift rewards and inspection, floor rewards, repeated floors, parallel overlap, Extreme constraints, and final results.' },
      { title: 'Encounter configuration', body: 'A separate user guide documents changing the custom encounter through configuration, applying the change, verification, and the internal path that no longer needs manual source edits.' },
      { title: 'Research boundary', body: 'MDOffline, MDServerBridge, MirrorDungeon, and OpenLethe integrations depend on packet and server-boundary behavior. Pages will explicitly separate confirmed offline replacements from planned phases and unsupported live-service behavior.' },
    ],
  },
  '/docs/dll/build': {
    title: 'Build and deployment', kicker: 'DLL HUB',
    summary: 'A conservative workflow for BepInEx IL2CPP plugins that minimizes stale assemblies and hard-to-diagnose patch conflicts.',
    sections: [
      { title: 'Project references', body: 'Reference the exact current interop and BepInEx assemblies used by the installed game. Avoid copying arbitrary older DLLs into the project because signatures can compile while failing at runtime.' },
      { title: 'Observe before patching', body: 'Decompile the target type, identify the real caller, and add a unique observation log before changing behavior. Patch the narrowest stable method and document Prefix, Postfix, or transpiler ownership.' },
      { title: 'Deploy and verify', body: 'Close the game, build the release configuration, copy only the intended plugin and required dependencies, restart fully, and search LogOutput.log for the plugin GUID and a unique verification marker.' },
      { title: 'Rollback', body: 'Keep configuration and generated assets separate from the plugin binary. To roll back, remove or restore the specific DLL rather than replacing the complete plugins directory.' },
    ],
  },
  '/docs/reference/reload': {
    title: 'Reload and restart matrix', kicker: 'REFERENCE',
    summary: 'Choose the shortest safe feedback loop for the type of asset you changed.',
    sections: [
      { title: 'Usually reloadable', body: 'Most existing JSON records, locale edits, Modular script strings, encounter values, patterns, and numeric balance changes can be tested with Lethe keybind 8.' },
      { title: 'Full restart required', body: 'DLL changes, newly registered custom_buffs, newly registered custom_unit_keywords, plugin initialization, and assembly reference changes require closing and reopening the game.' },
      { title: 'When uncertain', body: 'Restart once before diagnosing the implementation. If the issue disappears only after a restart, record that data type as restart-sensitive in the project README.' },
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
