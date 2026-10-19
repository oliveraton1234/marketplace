import { simulateLatency } from '@/core/data/simulate';

import type { AppNotification, NotificationFilter, NotificationsRepository } from '../domain/notification';

let notifications: AppNotification[] = [
  {
    id: 'n1',
    kind: 'trade_accepted',
    body: '**Mariana** aceptó tu cambio. Se ven hoy a las 17:30.',
    timeLabel: 'Hace 5 min',
    section: 'today',
    unread: true,
    target: '/chats/c-mariana',
  },
  {
    id: 'n2',
    kind: 'new_matches',
    body: '**3 matches nuevos** para tus audífonos',
    timeLabel: 'Hace 1 h',
    section: 'today',
    unread: true,
    target: '/match',
  },
  {
    id: 'n3',
    kind: 'provider_on_way',
    body: '**José Luis** va en camino. Tu código es 4821.',
    timeLabel: '10:42',
    section: 'today',
    unread: false,
    target: '/tracking/job-1',
  },
  {
    id: 'n4',
    kind: 'credits',
    body: 'Ganaste **150 créditos** porque Luis se unió',
    timeLabel: 'Martes',
    section: 'week',
    unread: false,
    target: '/payments',
  },
  {
    id: 'n5',
    kind: 'level_up',
    body: 'Subiste a **Nivel 4 · Swapper Pro**',
    timeLabel: 'Lunes',
    section: 'week',
    unread: false,
    target: '/profile',
  },
];

const offerKinds = new Set(['trade_accepted', 'new_matches']);
const serviceKinds = new Set(['provider_on_way']);

export class MockNotificationsRepository implements NotificationsRepository {
  list(filter: NotificationFilter) {
    const result = notifications.filter((n) => {
      if (filter === 'offers') return offerKinds.has(n.kind);
      if (filter === 'services') return serviceKinds.has(n.kind);
      return true;
    });
    return simulateLatency(result, 300);
  }

  markAllRead() {
    notifications = notifications.map((n) => ({ ...n, unread: false }));
    return simulateLatency(undefined, 200);
  }
}
