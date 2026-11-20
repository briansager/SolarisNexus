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
  flatAtk?: number; // NEW: For Cost 3 & 4 base ATK
  subStats: SubStat[]; // Will now hold 5 sub-stats
}

export type StatWeights = {
  [key in StatType]?: number;
};

export interface Character {
  id: string;
  name: string;
  element: string;
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