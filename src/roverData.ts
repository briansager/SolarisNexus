import type { RoverVariantsMap } from './types';

// Per-element build data for Rover (Male & Female share stats; tweak per-gender if they ever diverge).
// Only the 4 valid Rover elements are present.
export const roverVariants: RoverVariantsMap = {
  'rover-m': {
    Aero: {
      bestWeapon: "Bloodpact's Pledge",
      bestEcho: 'Reminiscence: Fleurdelys',
      recommendedSets: '5-pc Windward Pilgrimage',
      mainStat4: 'Crit Rate or Crit DMG',
      mainStat3: 'Aero DMG',
      mainStat1: 'ATK%',
      weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Aero DMG Bonus': 1.0 },
    },
    Electro: {
      bestWeapon: 'Blazing Brilliance',
      bestEcho: 'Soulfrayer',
      recommendedSets: '5-pc Flash of Electric Reflection',
      mainStat4: 'Crit Rate or Crit DMG',
      mainStat3: 'Electro DMG',
      mainStat1: 'ATK%',
      weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Electro DMG Bonus': 1.0 },
    },
    Havoc: {
      bestWeapon: 'Emerald of Genesis',
      bestEcho: 'Dreamless',
      recommendedSets: '5-pc Havoc Eclipse',
      mainStat4: 'Crit Rate or Crit DMG',
      mainStat3: 'Havoc DMG',
      mainStat1: 'ATK%',
      weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Havoc DMG Bonus': 1.0 },
    },
    Spectro: {
      bestWeapon: 'Emerald of Genesis',
      bestEcho: 'Impermanence Heron',
      recommendedSets: '5-pc Moonlit Clouds',
      mainStat4: 'Crit Rate or Crit DMG',
      mainStat3: 'Spectro DMG or Energy Regen',
      mainStat1: 'ATK%',
      weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Spectro DMG Bonus': 1.0 },
    },
  },
  'rover-f': {
    Aero: {
      bestWeapon: "Bloodpact's Pledge",
      bestEcho: 'Reminiscence: Fleurdelys',
      recommendedSets: '5-pc Windward Pilgrimage',
      mainStat4: 'Crit Rate or Crit DMG',
      mainStat3: 'Aero DMG',
      mainStat1: 'ATK%',
      weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Aero DMG Bonus': 1.0 },
    },
    Electro: {
      bestWeapon: 'Blazing Brilliance',
      bestEcho: 'Soulfrayer',
      recommendedSets: '5-pc Flash of Electric Reflection',
      mainStat4: 'Crit Rate or Crit DMG',
      mainStat3: 'Electro DMG',
      mainStat1: 'ATK%',
      weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Electro DMG Bonus': 1.0 },
    },
    Havoc: {
      bestWeapon: 'Emerald of Genesis',
      bestEcho: 'Dreamless',
      recommendedSets: '5-pc Havoc Eclipse',
      mainStat4: 'Crit Rate or Crit DMG',
      mainStat3: 'Havoc DMG',
      mainStat1: 'ATK%',
      weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Havoc DMG Bonus': 1.0 },
    },
    Spectro: {
      bestWeapon: 'Emerald of Genesis',
      bestEcho: 'Impermanence Heron',
      recommendedSets: '5-pc Moonlit Clouds',
      mainStat4: 'Crit Rate or Crit DMG',
      mainStat3: 'Spectro DMG or Energy Regen',
      mainStat1: 'ATK%',
      weights: { 'Crit Rate': 1.0, 'Crit DMG': 1.0, 'ATK%': 0.8, 'Spectro DMG Bonus': 1.0 },
    },
  },
};