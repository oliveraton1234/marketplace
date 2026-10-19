import { simulateLatency } from '@/core/data/simulate';

import type { ReportInput, SafeMeeting, SafetyRepository } from '../domain/safety';

const meeting: SafeMeeting = {
  counterpartName: 'Mariana R.',
  counterpartInitials: 'MR',
  place: 'Zócalo · zona vigilada',
  time: '17:30',
  elapsed: '12:04',
  trustedContact: 'Ana (hermana)',
  sharingLocation: true,
};

export class MockSafetyRepository implements SafetyRepository {
  getActiveMeeting() {
    return simulateLatency(meeting, 250);
  }

  report(_input: ReportInput) {
    return simulateLatency({ ticketId: `rp-${Date.now()}` }, 600);
  }

  triggerSos() {
    return simulateLatency(undefined, 400);
  }
}
