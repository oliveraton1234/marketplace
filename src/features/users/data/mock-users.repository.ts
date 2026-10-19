import { simulateLatency } from '@/core/data/simulate';

import type { UsersRepository } from '../domain/user';
import { mockProfile } from './users.mock';

export class MockUsersRepository implements UsersRepository {
  getMe() {
    return simulateLatency(mockProfile, 300);
  }
}
