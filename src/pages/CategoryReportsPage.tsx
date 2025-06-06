import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useCategoryStore } from '../store/categoryStore';
import { useTransactionStore } from '../store/transactionStore';
import { startOfWeek, startOfMonth, startOfYear, endOfWeek, endOfMonth, endOfYear } from 'date-fns';

export const CategoryReportsPage: React.FC = () => {
  const { categories, fetchCategories } = useCategoryStore();
  const { transactions, fetchTransactions } = useTransactionStore();
  
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [activeFilter, setActiveFilter] = useState<'week' | 'month' | 'year'>('year');
  
  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, [fetchCategories, fetchTransactions]);
  
  useEffect(() => {
    const now = new Date();
    let start: Date;
    let end: Date;
    
    switch (activeFilter) {
      case 'week':
        start = startOfWeek(now);
        end = endOfWeek(now);
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
    }
    
    setFromDate(start.toISOString().split('T')[0]);
    setToDate(end.toISOString().split('T')[0]);
  }, [activeFilter]);
  
  const getCategoryStats = () => {
    const stats = categories.map(category => {
      const categoryTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return (
          t.type === category.name &&
          transactionDate >= new Date(fromDate) &&
          transactionDate <= new Date(toDate)
        );
      });
      
      const income = categoryTransactions.reduce((sum, t) => sum + (t.income || 0), 0);
      const expense = categoryTransactions.reduce((sum, t) => sum + (t.expense || 0), 0);
      const netAmount = income - expense;
      
      return {
        category,
        income,
        expense,
        netAmount,
      };
    });
    
    return stats;
  };
  
  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'NPR',
      currencyDisplay: 'code',
    }).format(amount);
    
    return formatted.replace('NPR', 'रु');
  };
  
  const categoryStats = getCategoryStats();
  const totalIncome = categoryStats.reduce((sum, stat) => sum + stat.income, 0);
  const totalExpense = categoryStats.reduce((sum, stat) => sum + stat.expense, 0);
  const netAmount = totalIncome - totalExpense;
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Category Reports</h2>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">Quick Filters</h3>
                <div className="flex gap-3">
                  <Button
                    variant={activeFilter === 'week' ? 'primary' : 'outline'}
                    onClick={() => setActiveFilter('week')}
                  >
                    This Week
                  </Button>
                  <Button
                    variant={activeFilter === 'month' ? 'primary' : 'outline'}
                    onClick={() => setActiveFilter('month')}
                  >
                    This Month
                  </Button>
                  <Button
                    variant={activeFilter === 'year' ? 'primary' : 'outline'}
                    onClick={() => setActiveFilter('year')}
                  >
                    This Year
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="date"
                    label="From Date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    type="date"
                    label="To Date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-medium text-slate-500">Total Income</h3>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Total Expense</h3>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {formatCurrency(totalExpense)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Net Amount</h3>
                <p className={`text-2xl font-bold mt-1 ${netAmount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(netAmount)}
                </p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-right py-3 px-4">Income</th>
                    <th className="text-right py-3 px-4">Expense</th>
                    <th className="text-right py-3 px-4">Net Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryStats.map(({ category, income, expense, netAmount }) => (
                    <tr key={category.id} className="border-b border-slate-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 text-green-600">
                        {formatCurrency(income)}
                      </td>
                      <td className="text-right py-3 px-4 text-red-600">
                        {formatCurrency(expense)}
                      </td>
                      <td className={`text-right py-3 px-4 ${netAmount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatCurrency(netAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};
