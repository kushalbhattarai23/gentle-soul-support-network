
export interface User {
  id: string;
  email: string;
}

export interface Wallet {
  id: string;
  name: string;
  currency: string;
  balance: number;
  user_id: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category_id: string;
  wallet_id: string;
  user_id: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
}

export const TRANSACTION_TYPES = ['income', 'expense', 'transfer'] as const;
export type TransactionType = typeof TRANSACTION_TYPES[number];
