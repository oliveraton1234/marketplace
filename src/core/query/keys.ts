import type { ListingFilter } from '@/features/catalog/domain/listing';
import type { ConversationFilter } from '@/features/chat/domain/chat';
import type { MapLayer } from '@/features/geo/domain/geo';
import type { ProviderFilter } from '@/features/marketplace/domain/provider';
import type { NotificationFilter } from '@/features/notifications/domain/notification';

/** Central query-key factory: one place to reason about caching and invalidation. */
export const queryKeys = {
  me: ['users', 'me'] as const,
  listings: {
    all: ['listings'] as const,
    nearby: (filter: ListingFilter) => ['listings', 'nearby', filter] as const,
    detail: (id: string) => ['listings', 'detail', id] as const,
  },
  trades: {
    inventory: ['trades', 'inventory'] as const,
    overview: ['trades', 'overview'] as const,
  },
  chat: {
    list: (filter: ConversationFilter) => ['chat', 'list', filter] as const,
    conversation: (id: string) => ['chat', 'conversation', id] as const,
  },
  geo: (layer: MapLayer) => ['geo', layer] as const,
  marketplace: {
    providers: (filter: ProviderFilter) => ['marketplace', 'providers', filter] as const,
    provider: (id: string) => ['marketplace', 'provider', id] as const,
    tracking: (id: string) => ['marketplace', 'tracking', id] as const,
    dashboard: ['marketplace', 'dashboard'] as const,
  },
  wallet: ['payments', 'wallet'] as const,
  notifications: (filter: NotificationFilter) => ['notifications', filter] as const,
  safety: { meeting: ['safety', 'meeting'] as const },
};
