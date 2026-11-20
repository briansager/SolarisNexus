import type { Echo, StatWeights } from './types';

export function calculateEchoScore(echo: Echo, weights: StatWeights): number {
  // 1. Calculate Main Stat (Cost 1 only, since Cost 3/4 main stats are % based)
  let total = 0;
  
  // 2. Calculate Sub-stats
  const subStatScore = echo.subStats.reduce((acc, subStat) => {
    const weight = weights[subStat.type] || 0;
    return acc + (subStat.value * weight);
  }, 0);

  // 3. Add Flat ATK (Cost 3 & 4 base ATK)
  // We use `weights['ATK'] || 0` to satisfy TypeScript strict mode
  const flatAtkScore = echo.flatAtk ? echo.flatAtk * (weights['ATK'] || 0) : 0;

  return total + subStatScore + flatAtkScore;
}

export function calculateBuildScore(echoes: Echo[], weights: StatWeights): number {
  return echoes.reduce((total, echo) => {
    return total + calculateEchoScore(echo, weights);
  }, 0);
}

export function getActiveSonataSets(echoes: Echo[]): { setId: string, pieces: number }[] {
  const setCounts: Record<string, number> = {};
  
  echoes.forEach(echo => {
    if (echo.setId) {
      setCounts[echo.setId] = (setCounts[echo.setId] || 0) + 1;
    }
  });

  return Object.entries(setCounts)
    // FIXED: Added curly braces {} around the return statement
    .filter(([_, count]) => {
      return count >= 2;
    })
    .map(([setId, count]) => ({ setId, pieces: count }));
}

// Grade the score
export function getScoreTier(score: number): { label: string, color: string } {
  if (score >= 200) return { label: 'S', color: 'text-yellow-400' };
  if (score >= 150) return { label: 'A', color: 'text-purple-400' };
  if (score >= 100) return { label: 'B', color: 'text-blue-400' };
  if (score >= 50) return { label: 'C', color: 'text-green-400' };
  return { label: 'D', color: 'text-slate-400' };
}