
import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface BalanceSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  currency: string;
}

export const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  totalIncome,
  totalExpenses,
  totalBalance,
  currency = 'USD',
}) => {
  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'code',
    }).format(amount);

    return currency === 'NPR' ? formatted.replace('NPR', 'रु') : formatted;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <ArrowUpRight className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <ArrowDownRight className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
