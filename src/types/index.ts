export interface User {
  id: string;
  email: string;
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  currency: string;
  user_id: string;
  created_at: string;
}
export interface Category {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
export interface Transaction {
  id: string;
  date: string;
  income?: number;
  expense?: number;
  type: TransactionType;
  reason: string;
  wallet_id: string;
  user_id: string;
  created_at: string;
}

export type TransactionType =
  | 'Transportation'
  | 'Food'
  | 'Salary'
  | 'Internet'
  | 'TV'
  | 'House Rent Income'
  | 'Dad/ Mom'
  | 'Games / Apps'
  | 'Phone Recharge'
  | 'Festival'
  | 'Online to Cash'
  | 'Cash To Online'
  | 'Stationary'
  | 'Bank/ Wallet Interest'
  | 'Loan'
  | 'EMI'
  | 'Transfer to Another app'
  | 'Given By others'
  | 'Gift to others'
  | 'Tech'
  | 'Lost'
  | 'Entertainment'
  | 'Clothes / Shoes'
  | 'Cash Withdrawal'
  | 'Medicine'
  | 'Haircut'
  | 'Card Game';

export const TRANSACTION_TYPES: TransactionType[] = [
  'Transportation',
  'Food',
  'Salary',
  'Internet',
  'TV',
  'House Rent Income',
  'Dad/ Mom',
  'Games / Apps',
  'Phone Recharge',
  'Festival',
  'Online to Cash',
  'Cash To Online',
  'Stationary',
  'Bank/ Wallet Interest',
  'Loan',
  'EMI',
  'Transfer to Another app',
  'Given By others',
  'Gift to others',
  'Tech',
  'Lost',
  'Entertainment',
  'Clothes / Shoes',
  'Cash Withdrawal',
  'Medicine',
  'Haircut',
  'Card Game'
];
