export type PaymentMethod =
  | { id: string; type: 'card'; brand: string; last4: string; expires: string; primary: boolean }
  | { id: string; type: 'cash'; primary: boolean };

export type Transaction = {
  id: string;
  title: string;
  caption: string;
  /** Positive = credits earned, negative = money spent. */
  amount: number;
  unit: 'credits' | 'mxn';
  icon: 'star' | 'wrench' | 'userPlus';
};

export type Wallet = {
  credits: number;
  creditsValue: number;
  methods: PaymentMethod[];
  transactions: Transaction[];
};

export interface PaymentsRepository {
  getWallet(): Promise<Wallet>;
}
