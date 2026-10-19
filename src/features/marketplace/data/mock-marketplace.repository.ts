import { simulateLatency } from '@/core/data/simulate';
import { palette } from '@/design-system/tokens';
import { mockProfile } from '@/features/users/data/users.mock';

import { AppError } from '@/core/errors/app-error';

import type { JobTracking, MarketplaceRepository, ProviderDashboard, ProviderFilter } from '../domain/provider';
import { mockProviders } from './providers.mock';

const OAXACA_CENTER = { lat: 17.0617, lng: -96.7253 };

const joseLuis = mockProviders[0]!;

const tracking: JobTracking = {
  id: 'job-1',
  provider: joseLuis,
  etaMinutes: 12,
  arrivalCode: '4821',
  stage: 'on_the_way',
  stageProgress: 0.55,
  updatedSecondsAgo: 5,
};

const dashboard: ProviderDashboard = {
  receivingJobs: true,
  weekEarnings: 4820,
  weekDelta: 18,
  dailyEarnings: [
    { day: 'L', amount: 560 },
    { day: 'M', amount: 860 },
    { day: 'M', amount: 460 },
    { day: 'J', amount: 1250 },
    { day: 'V', amount: 720 },
    { day: 'S', amount: 980 },
    { day: 'D', amount: 0 },
  ],
  bestDayIndex: 3,
  requests: [
    {
      id: 'rq-1',
      title: 'Fuga en lavabo',
      client: { ...mockProfile, avatarColor: palette.violetNight },
      distanceKm: 1.2,
      when: 'hoy 10:00',
      price: 350,
    },
  ],
  agenda: [
    { id: 'ag-1', time: '12:30', title: 'Cambio de llave · Reforma', client: 'Laura P.', price: 300, color: palette.mint },
    { id: 'ag-2', time: '17:00', title: 'Calentador · Jalatlaco', client: 'Pedro E.', price: 900, color: palette.violetSoft },
  ],
};

export class MockMarketplaceRepository implements MarketplaceRepository {
  listProviders({ category, query, near }: ProviderFilter = {}) {
    const q = query?.trim().toLowerCase();
    const results = mockProviders
      .filter((p) => !category || p.category === category)
      .filter((p) => !q || `${p.name} ${p.trade} ${p.services.map((s) => s.name).join(' ')}`.toLowerCase().includes(q))
      .sort((a, b) => Number(b.availableToday) - Number(a.availableToday) || a.distanceKm - b.distanceKm);
    // Local data is authored around Centro, Oaxaca; shift it so providers surround wherever the person is.
    const shifted = near
      ? results.map((p) => ({
          ...p,
          location: { lat: p.location.lat + near.lat - OAXACA_CENTER.lat, lng: p.location.lng + near.lng - OAXACA_CENTER.lng },
        }))
      : results;
    return simulateLatency(shifted, 400);
  }

  async getProvider(id: string) {
    const provider = mockProviders.find((p) => p.id === id);
    if (!provider) throw new AppError('not_found', `Provider ${id} not found`, 404);
    return simulateLatency(provider, 300);
  }

  getTracking(_jobId: string) {
    return simulateLatency(tracking, 300);
  }

  getDashboard() {
    return simulateLatency(dashboard, 350);
  }

  hire(_providerId: string, _serviceId: string) {
    return simulateLatency({ jobId: tracking.id }, 600);
  }
}
