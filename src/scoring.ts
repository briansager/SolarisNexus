import type { Echo, StatWeights } from './types';

export const calculateEchoScore = (echo: Echo, weights: StatWeights): number => {
  if (!echo.subStats || echo.subStats.length === 0) return 0;
  return echo.subStats.reduce((total, subStat) => {
    const weight = weights[subStat.type as keyof StatWeights] || 0;
    return total + (subStat.value * weight);
  }, 0);
};