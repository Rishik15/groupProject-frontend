export const getTotalPool = (yesPool = 0, noPool = 0): number => {
  return Math.max(0, yesPool) + Math.max(0, noPool);
};

export const clampEmptyPoolDisplay = (value?: number | null): number => {
  return !value || value <= 0 ? 0 : value;
};

export const getCurrentMultiplier = (totalPool: number, sidePool: number): number => {
  const safeTotal = clampEmptyPoolDisplay(totalPool);
  const safeSide = clampEmptyPoolDisplay(sidePool);
  if (safeTotal === 0 || safeSide === 0) return 0;
  return safeTotal / safeSide;
};

export const getImpliedProbability = (totalPool: number, sidePool: number): number => {
  const safeTotal = clampEmptyPoolDisplay(totalPool);
  const safeSide = clampEmptyPoolDisplay(sidePool);
  if (safeTotal === 0 || safeSide === 0) return 0;
  return safeSide / safeTotal;
};

export const getProjectedPayout = (wager: number, multiplier: number): number => {
  if (!Number.isFinite(wager) || !Number.isFinite(multiplier)) return 0;
  if (wager <= 0 || multiplier <= 0) return 0;
  return Math.round(wager * multiplier);
};
