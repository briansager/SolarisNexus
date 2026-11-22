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

export interface Character {
  id: string;
  name: string;
  element: string;
  weaponType: string;
  bestWeapon: string;
  bestEcho: string;
  recommendedSets: string;
  mainStat4: string;
  mainStat3: string;
  mainStat1: string;
  weights: StatWeights;
}

// NEW: Rover-specific types (Option Y — Character stays untouched)
export type RoverGender = 'm' | 'f';
export type RoverElement = 'Aero' | 'Electro' | 'Havoc' | 'Spectro';

export interface RoverElementVariant {
  bestWeapon: string;
  bestEcho: string;
  recommendedSets: string;
  mainStat4: string;
  mainStat3: string;
  mainStat1: string;
  weights: StatWeights;
}

// Keyed by character id ('rover-m' | 'rover-f'), then by element
export type RoverVariantsMap = {
  [characterId: string]: {
    [E in RoverElement]?: RoverElementVariant;
  };
};

export interface SonataSet {
  id: string;
  name: string;
  twoPiece: string;
  fivePiece: string;
  threePiece?: string;
  onePiece?: string;
}