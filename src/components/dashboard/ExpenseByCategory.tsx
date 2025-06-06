import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Transaction } from '../../types';

interface ExpenseByCategoryProps {
  transactions: Transaction[];
}

export const ExpenseByCategory: React.FC<ExpenseByCategoryProps> = ({
  transactions,
}) => {
  const calculateCategoryExpenses = () => {
    const categories: Record<string, number> = {};
    
    transactions.forEach(transaction => {
      if (transaction.expense) {
        if (!categories[transaction.type]) {
          categories[transaction.type] = 0;
        }
        categories[transaction.type] += transaction.expense;
      }
    });
    
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
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
  
  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#14b8a6'];
  
  const data = calculateCategoryExpenses();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-500">No expense data available.</p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
