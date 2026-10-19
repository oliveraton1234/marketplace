export type BalanceStatus = 'fair' | 'short' | 'over';

export type OfferBalance = {
  total: number;
  diff: number;
  status: BalanceStatus;
  /** 0–1 position of the marker on the balance meter (0.5 = perfectly fair). */
  position: number;
};

const FAIR_TOLERANCE = 200;
const METER_RANGE = 1500;

/**
 * Pure business rule: how balanced an offer is versus the item requested.
 * Kept framework-free so it can be unit-tested and shared with the backend.
 */
export function computeOfferBalance(itemValues: number[], cash: number, targetValue: number): OfferBalance {
  const total = itemValues.reduce((sum, value) => sum + value, 0) + cash;
  const diff = total - targetValue;
  const clamped = Math.max(-METER_RANGE, Math.min(METER_RANGE, diff));
  const position = 0.5 + (clamped / METER_RANGE) * 0.46;
  const status: BalanceStatus = diff < -FAIR_TOLERANCE ? 'short' : diff > FAIR_TOLERANCE ? 'over' : 'fair';
  return { total, diff, status, position };
}
