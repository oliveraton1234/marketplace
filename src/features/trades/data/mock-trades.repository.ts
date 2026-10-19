import { simulateLatency } from '@/core/data/simulate';
import { palette } from '@/design-system/tokens';
import { mockUsers } from '@/features/users/data/users.mock';

import type { InventoryItem, OfferDraft, TradesOverview, TradesRepository } from '../domain/trade';

const inventory: InventoryItem[] = [
  { id: 'bike', name: 'Bici urbana', short: 'Bi', value: 3000, tile: palette.forestDeep },
  { id: 'audio', name: 'Audífonos', short: 'Au', value: 900, tile: palette.violet },
  { id: 'helmet', name: 'Casco de bici', short: 'Ca', value: 350, tile: palette.plum },
];

const overview: TradesOverview = {
  active: [
    {
      id: 't-1',
      title: 'Bici por Canon AE-1',
      counterpart: mockUsers.mariana,
      kind: 'bike',
      place: 'Zócalo',
      when: 'Hoy 17:30',
      stage: 'meeting',
    },
  ],
  services: [{ id: 'job-1', title: 'Plomería con José Luis', eta: 'Llega en 12 min', status: 'En camino' }],
  published: [{ id: 'p-1', title: 'Tus audífonos', meta: 'Publicado hace 2 días · 86 vistas', offers: 3 }],
  pendingRatings: [{ id: 'r-1', counterpart: mockUsers.sofia, item: 'Guitarra', reward: 20, when: 'ayer' }],
};

export class MockTradesRepository implements TradesRepository {
  getInventory() {
    return simulateLatency(inventory, 250);
  }

  getOverview() {
    return simulateLatency(overview, 400);
  }

  sendOffer(_draft: OfferDraft) {
    return simulateLatency({ conversationId: 'c-mariana' }, 600);
  }

  rate(input: { ratingId: string; stars: number; tags: string[]; comment: string }) {
    const pending = overview.pendingRatings.find((r) => r.id === input.ratingId);
    return simulateLatency({ creditsEarned: pending?.reward ?? 0 }, 500);
  }
}
