export type Session = { userId: string; token: string };

export type CountryCode = { iso: string; dial: string };

export const defaultCountry: CountryCode = { iso: 'MX', dial: '+52' };

export const OTP_LENGTH = 6;
export const OTP_RESEND_SECONDS = 24;

export interface AuthRepository {
  requestCode(phone: string, channel: 'sms' | 'email'): Promise<{ requestId: string }>;
  verifyCode(requestId: string, code: string): Promise<Session>;
}

/** `9511234567` → `951 123 4567` (MX national format). */
export function formatPhone(digits: string) {
  const d = digits.replace(/\D/g, '').slice(0, 10);
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6)].filter(Boolean).join(' ');
}

export const isValidPhone = (digits: string) => digits.replace(/\D/g, '').length === 10;
