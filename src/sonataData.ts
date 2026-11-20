import type { SonataSet } from './types';

export const sonataData: SonataSet[] = [
  // ============================================
  // 2-PIECE / 5-PIECE SETS
  // ============================================
  {
    id: 'rejuvenating-glow',
    name: 'Rejuvenating Glow',
    twoPiece: 'Healing Bonus +10%.',
    fivePiece: 'Increases the ATK of all party members by 15% for 30s upon healing allies.'
  },
  {
    id: 'moonlit-clouds',
    name: 'Moonlit Clouds',
    twoPiece: 'Energy Regen +10%.',
    fivePiece: 'After using Outro Skill, increases the ATK of the next Resonator by 22.5% for 15s.'
  },
  {
    id: 'celestial-light',
    name: 'Celestial Light',
    twoPiece: 'Spectro DMG +10%.',
    fivePiece: 'Spectro DMG +30% for 15s after releasing Intro Skill.'
  },
  {
    id: 'void-thunder',
    name: 'Void Thunder',
    twoPiece: 'Electro DMG +10%.',
    fivePiece: 'Electro DMG +15% after releasing Heavy Attack or Resonance Skill. This effect stacks up to 2 times, each stack lasts 15s.'
  },
  {
    id: 'molten-rift',
    name: 'Molten Rift',
    twoPiece: 'Fusion DMG +10%.',
    fivePiece: 'Fusion DMG +30% for 15s after releasing Resonance Skill.'
  },
  {
    id: 'sierra-gale',
    name: 'Sierra Gale',
    twoPiece: 'Aero DMG +10%.',
    fivePiece: 'Aero DMG +30% for 15s after releasing Intro Skill.'
  },
  {
    id: 'freezing-frost',
    name: 'Freezing Frost',
    twoPiece: 'Glacio DMG +10%.',
    fivePiece: 'Glacio DMG +10% after releasing Basic Attack or Heavy Attack. This effect stacks up to 3 times, each stack lasts 15s.'
  },
  {
    id: 'havoc-eclipse',
    name: 'Havoc Eclipse',
    twoPiece: 'Havoc DMG +10%.',
    fivePiece: 'Havoc DMG +7.5% after releasing Basic Attack or Heavy Attack. This effect stacks up to 4 times, each stack lasts 15s.'
  },
  {
    id: 'lingering-tunes',
    name: 'Lingering Tunes',
    twoPiece: 'ATK +10%.',
    fivePiece: 'While on the field, ATK increases by 5% every 1.5s. This effect stacks up to 4 stacks. Outro Skill DMG +60%.'
  },
  {
    id: 'tidebreaking-courage',
    name: 'Tidebreaking Courage',
    twoPiece: 'Energy Regen +10%.',
    fivePiece: 'Increase the Resonator\'s ATK by 15%. Reaching 250% Energy Regen increases all Attribute DMG by 30% for the Resonator.'
  },
  {
    id: 'empyrean-anthem',
    name: 'Empyrean Anthem',
    twoPiece: 'Energy Regen +10%.',
    fivePiece: 'Increase the Resonator\'s Coordinated Attack DMG by 80%. Upon a critical hit of Coordinated Attack, increase the active Resonator\'s ATK by 20% for 4s.'
  },
  {
    id: 'frosty-resolve',
    name: 'Frosty Resolve',
    twoPiece: 'Resonance Skill DMG +12%.',
    fivePiece: 'Casting Resonance Liberation grants 18% Glacio DMG Bonus and 18% Resonance Skill DMG Bonus for 5s. This effect stacks up to 2 times.'
  },
  {
    id: 'eternal-radiance',
    name: 'Eternal Radiance',
    twoPiece: 'Spectro DMG +10%.',
    fivePiece: 'Inflicting enemies with Spectro Frazzle increases Crit. Rate by 20% for 15s. Attacking enemies with 10 stacks of Spectro Frazzle grants 15% Spectro DMG Bonus for 15s.'
  },
  {
    id: 'midnight-veil',
    name: 'Midnight Veil',
    twoPiece: 'Havoc DMG +10%.',
    fivePiece: 'Triggering Outro Skill deals additional 480% Havoc DMG to surrounding enemies and grants the incoming Resonator 15% Havoc DMG Bonus for 15s.'
  },
  {
    id: 'gusts-of-welkin',
    name: 'Gusts of Welkin',
    twoPiece: 'Aero DMG +10%.',
    fivePiece: 'Inflicting Aero Erosion on enemies increases Aero DMG for all Resonators in the team by 15%, and for the Resonator triggering this effect by an additional 15%, lasting for 20s.'
  },
  {
    id: 'flaming-clawprint',
    name: 'Flaming Clawprint',
    twoPiece: 'Fusion DMG +10%.',
    fivePiece: 'Casting Resonance Liberation increases Fusion DMG of Resonators in the team by 15% and the caster\'s Resonance Liberation DMG by 20%, lasting for 35s.'
  },
  {
    id: 'reel-of-spliced-memories',
    name: 'Reel of Spliced Memories',
    twoPiece: 'ATK +10%.',
    fivePiece: 'Inflicting Tune Rupture - Shifting or Tune Strain - Shifting on enemies increases the Tune Break Boost of Resonators in the team by 20 for 30s. Effects of the same name do not stack.'
  },
  {
    id: 'sound-of-true-name',
    name: 'Sound of True Name',
    twoPiece: 'Aero DMG +10%.',
    fivePiece: 'Dealing Echo Skill DMG to enemies increases the Resonator\'s Echo Skill Crit. Rate by 20%, and grants 15% Aero DMG Bonus for 5s.'
  },
  {
    id: 'song-of-feathered-trace',
    name: 'Song of Feathered Trace',
    twoPiece: 'Energy Regen +10%.',
    fivePiece: 'Upon inflicting Havoc Bane, gain Xuanling\'s Feather, which grants a 20% increase in Crit. Rate and 25% increase in Heavy Attack DMG Bonus to the Resonator, lasting 15s. Upon inflicting Glacio Chafe, gain Chongming\'s Feather, which grants a 0.1% increase in ATK to Resonators in the team for every 1% of the Resonator\'s Energy Regen, up to 25%, lasting 10s.'
  },
  {
    id: 'flower-of-tinged-yearning',
    name: 'Flower of Tinged Yearning',
    twoPiece: 'Healing Bonus +10%.',
    fivePiece: 'Healing a Resonator in the team increases the ATK of all Resonators in the team by 10% for 30s. Effects of the same name cannot be stacked. While the effect is active, if the Resonator gains Unison or triggers Unison Response, their ATK is further increased by 15%.'
  },
  {
    id: 'flash-of-electric-reflection',
    name: 'Flash of Electric Reflection',
    twoPiece: 'Electro DMG +10%.',
    fivePiece: 'When the Resonator inflicts Electro Flare on enemies, they gain 10% Electro DMG Bonus for 15s. While this effect is active, casting Outro Skill grants the incoming Resonator 25% Electro DMG Bonus for 15s.'
  },
  {
    id: 'wishes-of-quiet-snowfall',
    name: 'Wishes of Quiet Snowfall',
    twoPiece: 'Glacio DMG +10%.',
    fivePiece: 'Inflicting Glacio Chafe on enemies increases Glacio DMG dealt by 10% for 15s. The Resonator gains the Snowfall effect for 15s, which can be triggered every 25s. Snowfall: Dealing Resonance Liberation DMG removes Snowfall and increases Crit. Rate by 25% for 6s (extendable). Casting Outro Skill removes Snowfall and grants 25% Glacio DMG Bonus to the incoming Resonator for 15s. Only one effect can be triggered when Snowfall is removed.'
  },
  {
    id: 'heart-of-evil',
    name: 'Heart of Evil\'s Purge',
    twoPiece: 'Aero DMG +10%.',
    fivePiece: 'Inflicting Tune Strain - Shifting increases Crit. DMG by 20% and Aero DMG Bonus by 20% for 15s.'
  },

  // ============================================
  // 3-PIECE SETS
  // NOTE: threePiece field is used. Update SonataSet type to include it.
  // ============================================
  {
    id: 'dream-of-the-lost',
    name: 'Dream of the Lost',
    twoPiece: '',
    fivePiece: '',
    threePiece: 'Holding 0 Resonance Energy increases Crit. Rate by 20% and grants 35% Echo Skill DMG Bonus.'
  },
  {
    id: 'crown-of-valor',
    name: 'Crown of Valor',
    twoPiece: '',
    fivePiece: '',
    threePiece: 'Upon gaining a Shield, increase the Resonator\'s ATK by 6% and Crit. DMG by 4% for 4s. This effect can be triggered once every 0.5s and stacks up to 5 times.'
  },
  {
    id: 'law-of-harmony',
    name: 'Law of Harmony',
    twoPiece: '',
    fivePiece: '',
    threePiece: 'Casting Echo Skill grants 30% Heavy Attack DMG Bonus to the caster for 4s. Additionally, all Resonators in the team gain 4% Echo Skill DMG Bonus for 30s, stacking up to 4 times. Echoes of the same name can only trigger this effect once. At 4 stacks, casting Echo Skill again resets the duration.'
  },
  {
    id: 'flamewing',
    name: 'Flamewing\'s Shadow',
    twoPiece: '',
    fivePiece: '',
    threePiece: 'Dealing Echo Skill DMG increases Heavy Attack Crit. Rate by 20% for 6s. Dealing Heavy Attack DMG increases Echo Skill Crit. Rate by 20% for 6s. While both effects are active, gain 16% Fusion DMG Bonus.'
  },
  {
    id: 'thread-of-severed-fate',
    name: 'Thread of Severed Fate',
    twoPiece: '',
    fivePiece: '',
    threePiece: 'Inflicting Havoc Bane increases the Resonator\'s ATK by 20% and grants 30% Resonance Liberation DMG Bonus for 5s.'
  }
];