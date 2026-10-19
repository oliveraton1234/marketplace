export const reportReasons = [
  { id: 'fraud', label: 'Parece una estafa o fraude' },
  { id: 'not_as_described', label: 'No es como se describe' },
  { id: 'no_show', label: 'No llegó al encuentro' },
  { id: 'abuse', label: 'Me trató mal' },
  { id: 'other', label: 'Otro motivo' },
] as const;

export type ReportReason = (typeof reportReasons)[number]['id'];

export type ReportInput = { userId: string; reason: ReportReason; details: string; block: boolean };

export type SafeMeeting = {
  counterpartName: string;
  counterpartInitials: string;
  place: string;
  time: string;
  elapsed: string;
  trustedContact: string;
  sharingLocation: boolean;
};

export interface SafetyRepository {
  getActiveMeeting(): Promise<SafeMeeting>;
  report(input: ReportInput): Promise<{ ticketId: string }>;
  triggerSos(): Promise<void>;
}
