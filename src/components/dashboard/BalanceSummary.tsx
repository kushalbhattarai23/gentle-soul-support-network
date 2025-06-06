import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Transaction, Wallet as WalletType } from '../../types';

interface BalanceSummaryProps {
  wallets: WalletType[];
  transactions: Transaction[];
}

export const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  wallets,
  transactions,
}) => {
  const getTotalBalance = () => {
    return wallets.reduce((total, wallet) => total + wallet.balance, 0);
  };
  
  const getThisMonthIncome = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return transactions
      .filter(t => new Date(t.date) >= startOfMonth && t.income)
      .reduce((total, t) => total + (t.income || 0), 0);
  };
  
  const getThisMonthExpense = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return transactions
      .filter(t => new Date(t.date) >= startOfMonth && t.expense)
      .reduce((total, t) => total + (t.expense || 0), 0);
  };

  const formatCurrency = (amount: number) => {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'NPR',
    currencyDisplay: 'code', // Show "NPR" so we can replace it
  }).format(amount);

  // Replace "NPR" with "रु"
  return formatted.replace('NPR', 'रु');
};
  
  const totalBalance = getTotalBalance();
  const monthlyIncome = getThisMonthIncome();
  const monthlyExpense = getThisMonthExpense();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-emerald-100">
              <Wallet size={24} className="text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">Total Balance</p>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
                {formatCurrency(totalBalance)}
              </h3>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Across {wallets.length} wallet{wallets.length !== 1 ? 's' : ''}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">This Month's Income</p>
              <h3 className="text-xl md:text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(monthlyIncome)}
              </h3>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              {transactions.filter(t => t.income).length} income transactions
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <TrendingDown size={24} className="text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">This Month Expenses</p>
              <h3 className="text-xl md:text-2xl font-bold text-red-600 mt-1">
                {formatCurrency(monthlyExpense)}
              </h3>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              {transactions.filter(t => t.expense).length} expense transactions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
