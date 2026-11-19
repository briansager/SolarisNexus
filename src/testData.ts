import type { Echo } from './types';
import { calculateEchoScore } from './scoring';
import { charactersData } from './data';

const shorekeeper = charactersData[0];

const testEcho: Echo = {
  cost: 1,
  mainStat: 'ATK', 
  subStats: [
    { type: 'HP', value: 2280 },
    { type: 'DEF%', value: 10.0 },
    { type: 'Energy Regen', value: 10.8 },
    { type: 'HP%', value: 8.6 },
    { type: 'Crit DMG', value: 12.6 },
    { type: 'Crit Rate', value: 9.3 },
  ]
};

const score = calculateEchoScore(testEcho, shorekeeper.weights);
console.log(`Shorekeeper's Echo Score: ${score.toFixed(2)}`);