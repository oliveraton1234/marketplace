/**
 * Runtime configuration. Values come from `EXPO_PUBLIC_*` variables (see `.env.example`).
 * Each backend microservice has its own base URL so they can be deployed and scaled independently.
 */
export type DataSource = 'mock' | 'http';

export const serviceNames = [
  'auth',
  'users',
  'catalog',
  'match',
  'trades',
  'chat',
  'geo',
  'marketplace',
  'payments',
  'notifications',
  'safety',
] as const;

export type ServiceName = (typeof serviceNames)[number];

const read = (value: string | undefined, fallback: string) => (value && value.length > 0 ? value : fallback);

// Expo inlines EXPO_PUBLIC_* only when accessed statically, so each key is spelled out.
const serviceUrls: Record<ServiceName, string> = {
  auth: read(process.env.EXPO_PUBLIC_AUTH_SERVICE_URL, 'http://localhost:4001'),
  users: read(process.env.EXPO_PUBLIC_USERS_SERVICE_URL, 'http://localhost:4002'),
  catalog: read(process.env.EXPO_PUBLIC_CATALOG_SERVICE_URL, 'http://localhost:4003'),
  match: read(process.env.EXPO_PUBLIC_MATCH_SERVICE_URL, 'http://localhost:4004'),
  trades: read(process.env.EXPO_PUBLIC_TRADES_SERVICE_URL, 'http://localhost:4005'),
  chat: read(process.env.EXPO_PUBLIC_CHAT_SERVICE_URL, 'http://localhost:4006'),
  geo: read(process.env.EXPO_PUBLIC_GEO_SERVICE_URL, 'http://localhost:4007'),
  marketplace: read(process.env.EXPO_PUBLIC_MARKETPLACE_SERVICE_URL, 'http://localhost:4008'),
  payments: read(process.env.EXPO_PUBLIC_PAYMENTS_SERVICE_URL, 'http://localhost:4009'),
  notifications: read(process.env.EXPO_PUBLIC_NOTIFICATIONS_SERVICE_URL, 'http://localhost:4010'),
  safety: read(process.env.EXPO_PUBLIC_SAFETY_SERVICE_URL, 'http://localhost:4011'),
};

export const env = {
  dataSource: (process.env.EXPO_PUBLIC_DATA_SOURCE === 'http' ? 'http' : 'mock') as DataSource,
  serviceUrls,
  requestTimeoutMs: Number(read(process.env.EXPO_PUBLIC_REQUEST_TIMEOUT_MS, '15000')),
  locale: 'es-MX',
  currency: 'MXN',
} as const;
