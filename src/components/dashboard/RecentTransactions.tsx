import React from 'react';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Transaction, Wallet } from '../../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  wallets: Wallet[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  wallets,
}) => {
  const getWalletName = (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    return wallet ? wallet.name : 'Unknown Wallet';
  };
  
  const getWalletCurrency = (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    return wallet ? wallet.currency : 'USD';
  };
  
  const formatCurrency = (amount: number | undefined, walletId: string) => {
    if (amount === undefined) return '';
    
    const currency = getWalletCurrency(walletId);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };
  
  const recentTransactions = transactions.slice(0, 5);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Recent Transactions</CardTitle>
        <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={16} />}>
          <a href="/transactions">View All</a>
        </Button>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-slate-500">No recent transactions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-full ${transaction.income ? 'bg-green-100' : 'bg-red-100'}`}>
                    <span className={`text-xs font-semibold ${transaction.income ? 'text-green-700' : 'text-red-700'}`}>
                      {transaction.type.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-slate-900">{transaction.reason}</h4>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-slate-500">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </span>
                      <span className="mx-2 text-xs text-slate-300">•</span>
                      <span className="text-xs text-slate-500">
                        {getWalletName(transaction.wallet_id)}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  {transaction.income ? (
                    <span className="text-sm font-medium text-green-600">
                      +{formatCurrency(transaction.income, transaction.wallet_id)}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-red-600">
                      -{formatCurrency(transaction.expense, transaction.wallet_id)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
