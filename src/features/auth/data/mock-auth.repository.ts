import { simulateLatency } from '@/core/data/simulate';
import { AppError } from '@/core/errors/app-error';

import { OTP_LENGTH, type AuthRepository } from '../domain/auth';

export class MockAuthRepository implements AuthRepository {
  requestCode(_phone: string, _channel: 'sms' | 'email') {
    return simulateLatency({ requestId: `otp-${Date.now()}` }, 500);
  }

  async verifyCode(_requestId: string, code: string) {
    if (code.length !== OTP_LENGTH) throw new AppError('validation', 'Código incompleto');
    return simulateLatency({ userId: 'u-daniel', token: 'local-session' }, 600);
  }
}
