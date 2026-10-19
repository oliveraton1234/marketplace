import { env, type ServiceName } from '@/core/config/env';
import { FetchHttpClient, type HttpClient } from '@/core/http/http-client';
import { MockAuthRepository } from '@/features/auth/data/mock-auth.repository';
import type { AuthRepository } from '@/features/auth/domain/auth';
import { useSessionStore } from '@/features/auth/store/session.store';
import { HttpListingsRepository } from '@/features/catalog/data/http-listings.repository';
import { MockListingsRepository } from '@/features/catalog/data/mock-listings.repository';
import type { ListingsRepository } from '@/features/catalog/domain/listing';
import { MockChatRepository } from '@/features/chat/data/mock-chat.repository';
import type { ChatRepository } from '@/features/chat/domain/chat';
import { MockGeoRepository } from '@/features/geo/data/mock-geo.repository';
import type { GeoRepository } from '@/features/geo/domain/geo';
import { MockMarketplaceRepository } from '@/features/marketplace/data/mock-marketplace.repository';
import type { MarketplaceRepository } from '@/features/marketplace/domain/provider';
import { MockNotificationsRepository } from '@/features/notifications/data/mock-notifications.repository';
import type { NotificationsRepository } from '@/features/notifications/domain/notification';
import { MockPaymentsRepository } from '@/features/payments/data/mock-payments.repository';
import type { PaymentsRepository } from '@/features/payments/domain/wallet';
import { MockSafetyRepository } from '@/features/safety/data/mock-safety.repository';
import type { SafetyRepository } from '@/features/safety/domain/safety';
import { MockTradesRepository } from '@/features/trades/data/mock-trades.repository';
import type { TradesRepository } from '@/features/trades/domain/trade';
import { MockUsersRepository } from '@/features/users/data/mock-users.repository';
import type { UsersRepository } from '@/features/users/domain/user';

/**
 * Composition root. UI depends only on these interfaces (Dependency Inversion);
 * swapping a local adapter for its microservice adapter happens here and nowhere else.
 */
export type Repositories = {
  auth: AuthRepository;
  users: UsersRepository;
  listings: ListingsRepository;
  trades: TradesRepository;
  chat: ChatRepository;
  geo: GeoRepository;
  marketplace: MarketplaceRepository;
  payments: PaymentsRepository;
  notifications: NotificationsRepository;
  safety: SafetyRepository;
};

const clientFor = (service: ServiceName): HttpClient =>
  new FetchHttpClient(env.serviceUrls[service], env.requestTimeoutMs, () => useSessionStore.getState().session?.token ?? null);

function createLocalRepositories(): Repositories {
  return {
    auth: new MockAuthRepository(),
    users: new MockUsersRepository(),
    listings: new MockListingsRepository(),
    trades: new MockTradesRepository(),
    chat: new MockChatRepository(),
    geo: new MockGeoRepository(),
    marketplace: new MockMarketplaceRepository(),
    payments: new MockPaymentsRepository(),
    notifications: new MockNotificationsRepository(),
    safety: new MockSafetyRepository(),
  };
}

function createRemoteRepositories(): Repositories {
  // Services without an HTTP adapter yet keep their local adapter, so the
  // migration can happen one microservice at a time.
  return {
    ...createLocalRepositories(),
    listings: new HttpListingsRepository(clientFor('catalog')),
  };
}

export const createRepositories = (): Repositories =>
  env.dataSource === 'http' ? createRemoteRepositories() : createLocalRepositories();
