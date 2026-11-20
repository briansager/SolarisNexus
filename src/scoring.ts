import type { Echo, StatWeights } from './types';

export function calculateEchoScore(echo: Echo, weights: StatWeights): number {
  return echo.subStats.reduce((total, subStat) => {
    const weight = weights[subStat.type] || 0;
    return total + (subStat.value * weight);
  }, 0);
}

// NEW: Calculate total score of the whole build
export function calculateBuildScore(echoes: Echo[], weights: StatWeights): number {
  return echoes.reduce((total, echo) => {
    return total + calculateEchoScore(echo, weights);
  }, 0);
}

// NEW: Check for active Sonata Sets (returns set IDs that have 2 or 5 pieces)
export function getActiveSonataSets(echoes: Echo[]): { setId: string, pieces: number }[] {
  const setCounts: Record<string, number> = {};
  
  echoes.forEach(echo => {
    if (echo.setId) {
      setCounts[echo.setId] = (setCounts[echo.setId] || 0) + 1;
    }
  });

  return Object.entries(setCounts)
    .filter(([_, count]) => count >= 2)
    .map(([setId, count]) => ({ setId, pieces: count }));
}