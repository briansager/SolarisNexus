export type StatType = 
  | 'ATK' | 'ATK%' | 'HP' | 'HP%' | 'DEF' | 'DEF%'
  | 'Crit Rate' | 'Crit DMG' | 'Energy Regen' | 'Healing Bonus'
  | 'Aero DMG Bonus' | 'Glacio DMG Bonus' | 'Fusion DMG Bonus' | 'Electro DMG Bonus' | 'Spectro DMG Bonus' | 'Havoc DMG Bonus'
  | 'Basic Attack DMG Bonus' | 'Heavy Attack DMG Bonus' | 'Resonance Skill DMG Bonus' | 'Resonance Liberation DMG Bonus';

export interface SubStat {
  type: StatType;
  value: number;
}

export interface Echo {
  echoId: string;
  cost: 1 | 3 | 4;
  setId: string;
  mainStat: StatType;
  flatAtk?: number;
  subStats: SubStat[];
}

export type StatWeights = {
  [key in StatType]?: number;
};

// NEW: Updated to hold the build guide data
export interface Character {
  id: string;
  name: string;
  element: string;
  weaponType: string;
  bestWeapon: string;
  bestEcho: string;
  recommendedSets: string; // e.g., "5-pc Molten Rift"
  mainStat4: string; // e.g., "Crit Rate or Crit DMG"
  mainStat3: string; // e.g., "Fusion DMG or ATK%"
  mainStat1: string; // e.g., "ATK%"
  weights: StatWeights;
}

export interface SonataSet {
  id: string;
  name: string;
  twoPiece: string;
  fivePiece: string;
  threePiece?: string;
  onePiece?: string;
}