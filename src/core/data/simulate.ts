/** Simulated network latency for local adapters, so loading states behave like production. */
export const simulateLatency = <T>(value: T, ms = 450): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredCloneSafe(value)), ms));

// Return copies so callers can never mutate the in-memory store by accident.
function structuredCloneSafe<T>(value: T): T {
  return typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}
