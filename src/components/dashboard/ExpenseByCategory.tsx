
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactionStore } from '@/store/transactionStore';
import { useCategoryStore } from '@/store/categoryStore';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const ExpenseByCategory: React.FC = () => {
  const { transactions } = useTransactionStore();
  const { categories } = useCategoryStore();

  const expenseData = useMemo(() => {
    const categoryTotals = new Map<string, number>();
    
    transactions
      .filter((t: any) => t.type === 'expense')
      .forEach((transaction: any) => {
        const categoryId = transaction.category_id || 'uncategorized';
        const current = categoryTotals.get(categoryId) || 0;
        categoryTotals.set(categoryId, current + (transaction.expense || 0));
      });

    return Array.from(categoryTotals.entries()).map(([categoryId, total]) => {
      const category = categories.find((c: any) => c.id === categoryId);
      return {
        name: category?.name || 'Uncategorized',
        value: total,
        color: category?.color || '#999999'
      };
    });
  }, [transactions, categories]);

  const renderCustomLabel = ({ name, percent }: { name: string; percent: number }) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {expenseData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
