
import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useTransactionStore } from '../../store/transactionStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useWalletStore } from '../../store/walletStore';

export const RecentTransactions: React.FC = () => {
  const { transactions, fetchTransactions } = useTransactionStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { wallets, fetchWallets } = useWalletStore();

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    fetchWallets();
  }, [fetchTransactions, fetchCategories, fetchWallets]);

  const recentTransactions = transactions.slice(0, 5);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  const getWalletName = (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    return wallet?.name || 'Unknown';
  };

  const formatCurrency = (amount: number, walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    const currency = wallet?.currency || 'USD';
    
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'code',
    }).format(Math.abs(amount));

    return currency === 'NPR' ? formatted.replace('NPR', 'रु') : formatted;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.amount > 0 ? (
                    <ArrowUpRight className="h-5 w-5 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {getCategoryName(transaction.category_id)} • {getWalletName(transaction.wallet_id)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : '-'}{formatCurrency(transaction.amount, transaction.wallet_id)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(transaction.date), 'MMM dd')}
                </p>
              </div>
            </div>
          ))}
          {recentTransactions.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No transactions yet. Add your first transaction to get started.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
