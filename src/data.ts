import type { Character } from './types';

export const charactersData: Character[] = [
  // ============================================
  // 5-STAR CHARACTERS
  // ============================================
  {
    id: 'aemeath', name: 'Aemeath', element: 'Fusion', weaponType: 'Sword',
    bestWeapon: 'Everbright Polestar', bestEcho: 'Sigillum', recommendedSets: '5-pc Trailblazing Star',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Fusion DMG or ATK%', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Fusion DMG Bonus': 1.0 }
  },
  {
    id: 'augusta', name: 'Augusta', element: 'Electro', weaponType: 'Broadblade',
    bestWeapon: 'Thunderflare Dominion', bestEcho: 'The False Sovereign', recommendedSets: '3-pc Crown of Valor + 2-pc Void Thunder',
    mainStat4: 'Crit DMG or Crit Rate', mainStat3: 'Electro DMG or ATK%', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Electro DMG Bonus': 1.0 }
  },
  {
    id: 'brant', name: 'Brant', element: 'Fusion', weaponType: 'Sword',
    bestWeapon: 'Unflickering Valor', bestEcho: 'Dragon of Dirge', recommendedSets: '5-pc Tidebreaking Courage',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Energy Regen or Fusion DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Fusion DMG Bonus': 1.0, 'Energy Regen': 0.5 }
  },
  {
    id: 'calcharo', name: 'Calcharo', element: 'Electro', weaponType: 'Broadblade',
    bestWeapon: 'Lustrous Razor', bestEcho: 'Nightmare: Thundering Mephis', recommendedSets: '5-pc Void Thunder',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Electro DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Electro DMG Bonus': 1.0 }
  },
  {
    id: 'camellya', name: 'Camellya', element: 'Havoc', weaponType: 'Sword',
    bestWeapon: 'Red Spring', bestEcho: 'Nightmare: Crownless', recommendedSets: '5-pc Havoc Eclipse',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Havoc DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Havoc DMG Bonus': 1.0 }
  },
  {
    id: 'cantarella', name: 'Cantarella', element: 'Havoc', weaponType: 'Rectifier',
    bestWeapon: 'Whispers of Sirens', bestEcho: 'Lorelei', recommendedSets: '5-pc Midnight Veil',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Havoc DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Havoc DMG Bonus': 1.0 }
  },
  {
    id: 'carlotta', name: 'Carlotta', element: 'Glacio', weaponType: 'Pistol',
    bestWeapon: 'The Last Dance', bestEcho: 'Sentry Construct', recommendedSets: '5-pc Frosty Resolve',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Glacio DMG or ATK%', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Glacio DMG Bonus': 1.0 }
  },
  {
    id: 'cartethyia', name: 'Cartethyia', element: 'Aero', weaponType: 'Sword',
    bestWeapon: "Defier's Thorn", bestEcho: 'Reminiscence: Fleurdelys', recommendedSets: '5-pc Windward Pilgrimage',
    mainStat4: 'Crit Rate & Crit DMG', mainStat3: '-', mainStat1: 'HP%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'HP%': 1.0, 'Aero DMG Bonus': 1.0 }
  },
  {
    id: 'changli', name: 'Changli', element: 'Fusion', weaponType: 'Sword',
    bestWeapon: 'Blazing Brilliance', bestEcho: 'Nightmare: Inferno Rider', recommendedSets: '5-pc Molten Rift',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Fusion DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Fusion DMG Bonus': 1.0 }
  },
  {
    id: 'chisa', name: 'Chisa', element: 'Havoc', weaponType: 'Broadblade',
    bestWeapon: 'Kumokiri', bestEcho: 'Reminiscence: Threnodian - Leviathan', recommendedSets: '3-pc Thread of Severed Fate + 2-pc Havoc Eclipse',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'ATK% or Havoc DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Havoc DMG Bonus': 1.0 }
  },
  {
    id: 'ciaccona', name: 'Ciaccona', element: 'Aero', weaponType: 'Pistol',
    bestWeapon: 'Woodland Aria', bestEcho: 'Reminiscence: Fleurdelys', recommendedSets: '5-pc Gusts of Welkin',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Aero DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Aero DMG Bonus': 1.0 }
  },
  {
    id: 'denia', name: 'Denia', element: 'Fusion', weaponType: 'Rectifier',
    bestWeapon: 'Forged Dwarf Star', bestEcho: 'Reminiscence: Denia', recommendedSets: '5-pc Chromatic Foam',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Fusion DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Fusion DMG Bonus': 1.0 }
  },
  {
    id: 'encore', name: 'Encore', element: 'Fusion', weaponType: 'Rectifier',
    bestWeapon: 'Stringmaster', bestEcho: 'Nightmare: Inferno Rider', recommendedSets: '5-pc Molten Rift',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Fusion DMG', mainStat1: 'ATK% or Energy Regen',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Fusion DMG Bonus': 1.0 }
  },
  {
    id: 'galbrena', name: 'Galbrena', element: 'Fusion', weaponType: 'Pistol',
    bestWeapon: 'Lux & Umbra', bestEcho: 'Corrosaurus', recommendedSets: "3-pc Flamewing's Shadow + 2-pc Flaming Clawprint",
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Fusion DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Fusion DMG Bonus': 1.0 }
  },
  {
    id: 'hiyuki', name: 'Hiyuki', element: 'Glacio', weaponType: 'Sword',
    bestWeapon: 'Frostburn', bestEcho: 'Reminiscence: Threnodian - Voidborne Construct', recommendedSets: '5-pc Wishes of Quiet Snowfall',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Glacio DMG or ATK%', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Glacio DMG Bonus': 1.0 }
  },
  {
    id: 'hsin', name: 'Hsin', element: 'Electro', weaponType: 'Rectifier',
    bestWeapon: 'Blooming Jadehaven', bestEcho: 'Reminiscence: Suhsin the Inevitable', recommendedSets: '5-pc Heart of Sworn Vigil',
    mainStat4: 'Crit DMG or Crit Rate', mainStat3: 'Electro DMG and ATK', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Electro DMG Bonus': 1.0 }
  },
  {
    id: 'iuno', name: 'Iuno', element: 'Aero', weaponType: 'Gauntlet',
    bestWeapon: "Moongazer's Sigil", bestEcho: 'Lady of the Sea', recommendedSets: '3-pc Crown of Valor + 2-pc Sierra Gale',
    mainStat4: 'Crit DMG or Crit Rate', mainStat3: 'Aero DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Aero DMG Bonus': 1.0 }
  },
  {
    id: 'jianxin', name: 'Jianxin', element: 'Aero', weaponType: 'Gauntlet',
    bestWeapon: "Verity's Handle", bestEcho: 'Impermanence Heron', recommendedSets: '5-pc Moonlit Clouds',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Aero DMG or Energy Regen', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Aero DMG Bonus': 1.0 }
  },
  {
    id: 'jingran', name: 'Jingran', element: 'Fusion', weaponType: 'Broadblade',
    bestWeapon: 'Thousandfold Deliverance', bestEcho: 'Myriad Snare: Rustfire Chassis', recommendedSets: '5-pc Lamp of Nether Road',
    mainStat4: 'Crit DMG or Crit Rate', mainStat3: '-', mainStat1: 'HP%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'HP%': 1.0, 'Fusion DMG Bonus': 1.0 }
  },
  {
    id: 'jinhsi', name: 'Jinhsi', element: 'Spectro', weaponType: 'Broadblade',
    bestWeapon: 'Ages of Harvest', bestEcho: 'Jué', recommendedSets: '5-pc Celestial Light',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Spectro DMG or ATK%', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Spectro DMG Bonus': 1.0 }
  },
  {
    id: 'jiyan', name: 'Jiyan', element: 'Aero', weaponType: 'Broadblade',
    bestWeapon: 'Verdant Summit', bestEcho: 'Nightmare: Feilian Beringal', recommendedSets: '5-pc Sierra Gale',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Aero DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Aero DMG Bonus': 1.0 }
  },
  {
    id: 'lily', name: 'Lily', element: 'Spectro', weaponType: 'Pistol',
    bestWeapon: 'Lullaby', bestEcho: 'Formrender', recommendedSets: '5-pc Flower of Tinged Yearning',
    mainStat4: 'Healing Bonus or HP%', mainStat3: 'Energy Regen or HP%', mainStat1: 'HP%',
    weights: { 'Energy Regen': 1.5, 'HP%': 1.0, 'Healing Bonus': 1.0 }
  },
  {
    id: 'lingyang', name: 'Lingyang', element: 'Glacio', weaponType: 'Gauntlet',
    bestWeapon: 'Abyss Surges', bestEcho: 'Sentry Construct', recommendedSets: '5-pc Frosty Resolve',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Glacio DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Glacio DMG Bonus': 1.0 }
  },
  {
    id: 'lucilla', name: 'Lucilla', element: 'Glacio', weaponType: 'Rectifier',
    bestWeapon: 'Freeze Frame', bestEcho: 'Glommoth', recommendedSets: '5-pc Wishes of Quiet Snowfall',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Glacio DMG or ATK%', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Glacio DMG Bonus': 1.0 }
  },
  {
    id: 'lucy', name: 'Lucy', element: 'Spectro', weaponType: 'Pistol',
    bestWeapon: 'Spectral Trigger', bestEcho: 'Reminiscence: Nightmare Adam Smasher', recommendedSets: '1-pc Shadow of Shattered Dreams + 2-pc Rite of Gilded Revelation + 2-pc Reel of Spliced Memories',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Spectro DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Spectro DMG Bonus': 1.0 }
  },
  {
    id: 'lupa', name: 'Lupa', element: 'Fusion', weaponType: 'Broadblade',
    bestWeapon: 'Wildfire Mark', bestEcho: 'Lioness of Glory', recommendedSets: '5-pc Flaming Clawprint',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Fusion DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Fusion DMG Bonus': 1.0 }
  },
  {
    id: 'luuk-herssen', name: 'Luuk Herssen', element: 'Spectro', weaponType: 'Gauntlet',
    bestWeapon: "Daybreaker's Spine", bestEcho: 'Twin Nova - Nebulous Cannon', recommendedSets: '5-pc Rite of Gilded Revelation',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Spectro DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Spectro DMG Bonus': 1.0 }
  },
  {
    id: 'lynae', name: 'Lynae', element: 'Spectro', weaponType: 'Pistol',
    bestWeapon: 'Spectrum Blaster', bestEcho: 'Hyvatia', recommendedSets: '5-pc Pact of Neonlight Leap',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Spectro DMG or Energy Regen', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Spectro DMG Bonus': 1.0 }
  },
  {
    id: 'mornye', name: 'Mornye', element: 'Fusion', weaponType: 'Broadblade',
    bestWeapon: 'Starfield Calibrator', bestEcho: 'Reactor Husk', recommendedSets: '5-pc Halo of Starry Radiance',
    mainStat4: 'Healing Bonus', mainStat3: 'Energy Regen', mainStat1: 'DEF%',
    weights: { 'Energy Regen': 1.5, 'DEF%': 1.0, 'Healing Bonus': 1.0 }
  },
  {
    id: 'phoebe', name: 'Phoebe', element: 'Spectro', weaponType: 'Rectifier',
    bestWeapon: 'Luminous Hymn', bestEcho: 'Capitaneus', recommendedSets: '5-pc Eternal Radiance',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Spectro DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Spectro DMG Bonus': 1.0 }
  },
  {
    id: 'phrolova', name: 'Phrolova', element: 'Havoc', weaponType: 'Rectifier',
    bestWeapon: 'Lethean Elegy', bestEcho: 'Nightmare: Hecate', recommendedSets: '3-pc Dream of the Lost + 2-pc Havoc Eclipse',
    mainStat4: 'Crit DMG or Crit Rate', mainStat3: 'Havoc DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Havoc DMG Bonus': 1.0 }
  },
  {
    id: 'qingxiao', name: 'Qingxiao', element: 'Aero', weaponType: 'Sword',
    bestWeapon: 'Glint of Clouds', bestEcho: 'Calamity Effigy', recommendedSets: "5-pc Heart of Evil's Purge",
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Aero DMG and ATK%', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Aero DMG Bonus': 1.0 }
  },
  {
    id: 'qiuyuan', name: 'Qiuyuan', element: 'Aero', weaponType: 'Sword',
    bestWeapon: 'Emerald Sentence', bestEcho: 'Reminiscence: Fenrico', recommendedSets: '3-pc Law of Harmony + 2-pc Sierra Gale',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Aero DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Aero DMG Bonus': 1.0 }
  },
  {
    id: 'rebecca', name: 'Rebecca', element: 'Electro', weaponType: 'Pistol',
    bestWeapon: 'Skull Thrasher', bestEcho: 'Reminiscence: Nightmare Adam Smasher', recommendedSets: '1-pc Shadow of Shattered Dreams + 2-pc Void Thunder + 2-pc Reel of Spliced Memories',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Electro DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Electro DMG Bonus': 1.0 }
  },
  {
    id: 'roccia', name: 'Roccia', element: 'Havoc', weaponType: 'Gauntlet',
    bestWeapon: 'Tragicomedy', bestEcho: 'Nightmare: Impermanence Heron', recommendedSets: '5-pc Midnight Veil',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Havoc DMG or Energy Regen', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Havoc DMG Bonus': 1.0 }
  },
  // ROVER (M): stats resolved via src/roverData.ts based on chosen element.
  {
    id: 'rover-m', name: 'Rover (Male)', element: 'Aero', weaponType: 'Sword',
    bestWeapon: '-', bestEcho: '-', recommendedSets: '-',
    mainStat4: '-', mainStat3: '-', mainStat1: '-',
    weights: {}
  },
  // ROVER (F): stats resolved via src/roverData.ts based on chosen element.
  {
    id: 'rover-f', name: 'Rover (Female)', element: 'Aero', weaponType: 'Sword',
    bestWeapon: '-', bestEcho: '-', recommendedSets: '-',
    mainStat4: '-', mainStat3: '-', mainStat1: '-',
    weights: {}
  },
  {
    id: 'shorekeeper', name: 'Shorekeeper', element: 'Spectro', weaponType: 'Rectifier',
    bestWeapon: 'Stellar Symphony', bestEcho: 'Fallacy of No Return', recommendedSets: '5-pc Rejuvenating Glow',
    mainStat4: 'Healing Bonus or Crit DMG', mainStat3: 'Energy Regen or HP%', mainStat1: 'HP%',
    weights: { 'Energy Regen': 2.0, 'HP%': 1.5, 'Crit DMG': 1.0, 'Resonance Skill DMG Bonus': 0.5 }
  },
  {
    id: 'sigrika', name: 'Sigrika', element: 'Aero', weaponType: 'Gauntlet',
    bestWeapon: 'Solsworn Ciphers', bestEcho: 'Nameless Explorer', recommendedSets: '5-pc Sound of True Name',
    mainStat4: 'Crit DMG or Crit Rate', mainStat3: 'Energy Regen or ATK%', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Aero DMG Bonus': 1.0 }
  },
  {
    id: 'suisui', name: 'Suisui', element: 'Glacio', weaponType: 'Rectifier',
    bestWeapon: "Firstlight's Herald", bestEcho: 'Forbidden Bastion', recommendedSets: '5-pc Song of Feathered Trace',
    mainStat4: 'Healing Bonus or HP%', mainStat3: 'Energy Regen or HP%', mainStat1: 'HP%',
    weights: { 'Energy Regen': 1.5, 'HP%': 1.0, 'Healing Bonus': 1.0 }
  },
  {
    id: 'suoming', name: 'Suoming', element: 'Electro', weaponType: 'Sword',
    bestWeapon: 'Unspoken Rue', bestEcho: 'Reminiscence: Suhsin the Inevitable', recommendedSets: '5-pc Heart of Sworn Vigil',
    mainStat4: 'Crit DMG or Crit Rate', mainStat3: 'Electro DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Electro DMG Bonus': 1.0 }
  },
  {
    id: 'verina', name: 'Verina', element: 'Spectro', weaponType: 'Rectifier',
    bestWeapon: 'Stellar Symphony', bestEcho: 'Fallacy of No Return', recommendedSets: '5-pc Rejuvenating Glow',
    mainStat4: 'Healing Bonus or ATK%', mainStat3: 'Energy Regen', mainStat1: 'ATK%',
    weights: { 'Energy Regen': 1.5, 'ATK%': 1.0, 'Healing Bonus': 1.0 }
  },
  {
    id: 'xiangli-yao', name: 'Xiangli Yao', element: 'Electro', weaponType: 'Gauntlet',
    bestWeapon: "Verity's Handle", bestEcho: 'Nightmare: Thundering Mephis', recommendedSets: '5-pc Void Thunder',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Electro DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Electro DMG Bonus': 1.0 }
  },
  {
    id: 'yangyang-xuanling', name: 'Yangyang Xuanling', element: 'Havoc', weaponType: 'Sword',
    bestWeapon: 'Azure Oath', bestEcho: 'Thousand-Puppet Pavilion', recommendedSets: '5-pc Song of Feathered Trace',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Havoc DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Havoc DMG Bonus': 1.0 }
  },
  {
    id: 'yinlin', name: 'Yinlin', element: 'Electro', weaponType: 'Rectifier',
    bestWeapon: 'Stringmaster', bestEcho: 'Impermanence Heron', recommendedSets: '5-pc Moonlit Clouds',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Electro DMG or Energy Regen', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Electro DMG Bonus': 1.0 }
  },
  {
    id: 'zani', name: 'Zani', element: 'Spectro', weaponType: 'Gauntlet',
    bestWeapon: 'Blazing Justice', bestEcho: 'Capitaneus', recommendedSets: '5-pc Eternal Radiance',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Spectro DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Spectro DMG Bonus': 1.0 }
  },
  {
    id: 'zhezhi', name: 'Zhezhi', element: 'Glacio', weaponType: 'Rectifier',
    bestWeapon: 'Rime-Draped Sprouts', bestEcho: 'Nightmare: Lampylumen Myriad', recommendedSets: '5-pc Empyrean Anthem',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Glacio DMG or Energy Regen', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Glacio DMG Bonus': 1.0 }
  },

  // ============================================
  // 4-STAR CHARACTERS
  // ============================================
  {
    id: 'aalto', name: 'Aalto', element: 'Aero', weaponType: 'Pistol',
    bestWeapon: 'The Last Dance', bestEcho: 'Impermanence Heron', recommendedSets: '5-pc Moonlit Clouds',
    mainStat4: 'Crit DMG or Crit Rate', mainStat3: 'Aero DMG or Energy Regen', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Aero DMG Bonus': 1.0 }
  },
  {
    id: 'baizhi', name: 'Baizhi', element: 'Glacio', weaponType: 'Rectifier',
    bestWeapon: 'Stellar Symphony', bestEcho: 'Bell-Borne Geochelone', recommendedSets: '5-pc Rejuvenating Glow',
    mainStat4: 'Healing Bonus or HP%', mainStat3: 'Energy Regen', mainStat1: 'HP%',
    weights: { 'Energy Regen': 1.5, 'HP%': 1.0, 'Healing Bonus': 1.0 }
  },
  {
    id: 'buling', name: 'Buling', element: 'Electro', weaponType: 'Rectifier',
    bestWeapon: 'Stellar Symphony', bestEcho: 'Fallacy of No Return', recommendedSets: '5-pc Rejuvenating Glow',
    mainStat4: 'Healing Bonus or ATK%', mainStat3: 'Energy Regen', mainStat1: 'ATK%',
    weights: { 'Energy Regen': 1.5, 'ATK%': 1.0, 'Healing Bonus': 1.0 }
  },
  {
    id: 'chixia', name: 'Chixia', element: 'Fusion', weaponType: 'Pistol',
    bestWeapon: 'The Last Dance', bestEcho: 'Nightmare: Inferno Rider', recommendedSets: '5-pc Molten Rift',
    mainStat4: 'Crit DMG or Crit Rate', mainStat3: 'Fusion DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Fusion DMG Bonus': 1.0 }
  },
  {
    id: 'danjin', name: 'Danjin', element: 'Havoc', weaponType: 'Sword',
    bestWeapon: 'Blazing Brilliance', bestEcho: 'Nightmare: Crownless', recommendedSets: '5-pc Havoc Eclipse',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Havoc DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Havoc DMG Bonus': 1.0 }
  },
  {
    id: 'lumi', name: 'Lumi', element: 'Electro', weaponType: 'Broadblade',
    bestWeapon: 'Lustrous Razor', bestEcho: 'Impermanence Heron', recommendedSets: '5-pc Moonlit Clouds',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Electro DMG or Energy Regen', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Electro DMG Bonus': 1.0 }
  },
  {
    id: 'mortefi', name: 'Mortefi', element: 'Fusion', weaponType: 'Pistol',
    bestWeapon: 'Static Mist', bestEcho: 'Hecate', recommendedSets: '5-pc Empyrean Anthem',
    mainStat4: 'Crit Rate', mainStat3: 'Fusion DMG or Energy Regen', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Fusion DMG Bonus': 1.0 }
  },
  {
    id: 'sanhua', name: 'Sanhua', element: 'Glacio', weaponType: 'Sword',
    bestWeapon: 'Emerald of Genesis', bestEcho: 'Impermanence Heron', recommendedSets: '5-pc Moonlit Clouds',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Glacio DMG or Energy Regen', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Glacio DMG Bonus': 1.0 }
  },
  {
    id: 'taoqi', name: 'Taoqi', element: 'Havoc', weaponType: 'Broadblade',
    bestWeapon: 'Dauntless Evernight', bestEcho: 'Bell-Borne Geochelone', recommendedSets: '5-pc Moonlit Clouds',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Havoc DMG', mainStat1: 'DEF%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'DEF%': 1.0, 'Havoc DMG Bonus': 1.0 }
  },
  {
    id: 'yangyang', name: 'Yangyang', element: 'Aero', weaponType: 'Sword',
    bestWeapon: 'Emerald of Genesis', bestEcho: 'Bell-Borne Geochelone', recommendedSets: '5-pc Moonlit Clouds',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Aero DMG', mainStat1: 'ATK%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Aero DMG Bonus': 1.0 }
  },
  {
    id: 'youhu', name: 'Youhu', element: 'Glacio', weaponType: 'Gauntlet',
    bestWeapon: 'Abyss Surges', bestEcho: 'Bell-Borne Geochelone', recommendedSets: '5-pc Rejuvenating Glow',
    mainStat4: 'Healing Bonus or ATK%', mainStat3: 'Energy Regen or ATK%', mainStat1: 'ATK%',
    weights: { 'Energy Regen': 1.5, 'ATK%': 1.0, 'Healing Bonus': 1.0 }
  },
  {
    id: 'yuanwu', name: 'Yuanwu', element: 'Electro', weaponType: 'Gauntlet',
    bestWeapon: 'Abyss Surges', bestEcho: 'Nightmare: Tempest Mephis', recommendedSets: '5-pc Empyrean Anthem',
    mainStat4: 'Crit Rate or Crit DMG', mainStat3: 'Electro DMG', mainStat1: 'DEF%',
    weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'DEF%': 1.0, 'Electro DMG Bonus': 1.0 }
  }
];