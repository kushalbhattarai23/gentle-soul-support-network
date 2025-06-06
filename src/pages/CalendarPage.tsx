import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { useTransactionStore } from '../store/transactionStore';
import { useWalletStore } from '../store/walletStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format, eachDayOfInterval } from 'date-fns';
import { TRANSACTION_TYPES } from '../types';

export const CalendarPage: React.FC = () => {
  const { transactions, fetchTransactions } = useTransactionStore();
  const { wallets, fetchWallets } = useWalletStore();
  const [timeframe, setTimeframe] = useState('week');
  const [reportType, setReportType] = useState('income');

  useEffect(() => {
    fetchTransactions();
    fetchWallets();
  }, [fetchTransactions, fetchWallets]);

  const getDateRange = () => {
    const now = new Date();
    switch (timeframe) {
      case 'week':
        return {
          start: startOfWeek(now),
          end: endOfWeek(now),
          format: 'EEE',
          label: 'Weekly'
        };
      case 'month':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
          format: 'dd',
          label: 'Monthly'
        };
      case 'year':
        return {
          start: startOfYear(now),
          end: endOfYear(now),
          format: 'MMM',
          label: 'Yearly'
        };
      default:
        return {
          start: startOfWeek(now),
          end: endOfWeek(now),
          format: 'EEE',
          label: 'Weekly'
        };
    }
  };

  const getCategoryData = () => {
    const categoryMap: Record<string, { income: number; expense: number }> = {};
    
    // Initialize all transaction types with zero values
    TRANSACTION_TYPES.forEach(type => {
      categoryMap[type] = { income: 0, expense: 0 };
    });
    
    transactions.forEach(transaction => {
      if (transaction.income) {
        categoryMap[transaction.type].income += transaction.income;
      }
      if (transaction.expense) {
        categoryMap[transaction.type].expense += transaction.expense;
      }
    });

    return categoryMap;
  };

  const getTimeframeData = () => {
    const { start, end, format: dateFormat } = getDateRange();
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => {
      const dayTransactions = transactions.filter(t => 
        new Date(t.date).toDateString() === day.toDateString()
      );
      
      return {
        date: format(day, dateFormat),
        income: dayTransactions.reduce((sum, t) => sum + (t.income || 0), 0),
        expense: dayTransactions.reduce((sum, t) => sum + (t.expense || 0), 0)
      };
    });
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

  const timeframeData = getTimeframeData();
  const categoryData = getCategoryData();
  const { label: timeframeLabel } = getDateRange();

  const totalIncome = transactions.reduce((sum, t) => sum + (t.income || 0), 0);
  const totalExpense = transactions.reduce((sum, t) => sum + (t.expense || 0), 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900">Financial Reports</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Select
              options={[
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'year', label: 'This Year' }
              ]}
              value={timeframe}
              onChange={setTimeframe}
              className="w-full sm:w-40"
            />
            <Select
              options={[
                { value: 'income', label: 'Income' },
                { value: 'expense', label: 'Expense' }
              ]}
              value={reportType}
              onChange={setReportType}
              className="w-full sm:w-40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Expense</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Net Balance</p>
                  <p className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(totalIncome - totalExpense)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}ly Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeframeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" name="Income" />
                    <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{timeframeLabel} Category Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-2 text-left border-b border-slate-200">Category</th>
                    <th className="px-4 py-2 text-right border-b border-slate-200">Income</th>
                    <th className="px-4 py-2 text-right border-b border-slate-200">Expense</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(categoryData).map(([category, data]) => (
                    <tr key={category} className="hover:bg-slate-50">
                      <td className="px-4 py-2 border-b border-slate-200">{category}</td>
                      <td className="px-4 py-2 text-right border-b border-slate-200 text-green-600">
                        {formatCurrency(data.income)}
                      </td>
                      <td className="px-4 py-2 text-right border-b border-slate-200 text-red-600">
                        {formatCurrency(data.expense)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-semibold">
                    <td className="px-4 py-2 border-b border-slate-200">Total</td>
                    <td className="px-4 py-2 text-right border-b border-slate-200 text-green-600">
                      {formatCurrency(totalIncome)}
                    </td>
                    <td className="px-4 py-2 text-right border-b border-slate-200 text-red-600">
                      {formatCurrency(totalExpense)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};
