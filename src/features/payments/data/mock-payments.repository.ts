import { simulateLatency } from '@/core/data/simulate';

import type { PaymentsRepository, Wallet } from '../domain/wallet';

const wallet: Wallet = {
  credits: 1250,
  creditsValue: 125,
  methods: [
    { id: 'pm-card', type: 'card', brand: 'Tarjeta', last4: '4242', expires: '08/29', primary: true },
    { id: 'pm-cash', type: 'cash', primary: false },
  ],
  transactions: [
    { id: 'tx-1', title: 'Calificaste a Sofía', caption: 'Hoy', amount: 20, unit: 'credits', icon: 'star' },
    { id: 'tx-2', title: 'Plomería · José Luis', caption: 'Protegido hasta terminar', amount: -365, unit: 'mxn', icon: 'wrench' },
    { id: 'tx-3', title: 'Invitaste a Luis', caption: 'Martes', amount: 150, unit: 'credits', icon: 'userPlus' },
  ],
};

export class MockPaymentsRepository implements PaymentsRepository {
  getWallet() {
    return simulateLatency(wallet, 350);
  }
}
