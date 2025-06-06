import React from 'react';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight, Edit2, Trash2 } from 'lucide-react';
import { Transaction, Wallet } from '../../types';

interface TransactionListProps {
  transactions: Transaction[];
  wallets: Wallet[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  wallets,
  onEdit,
  onDelete,
}) => {
  const getWalletName = (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    return wallet ? wallet.name : 'Unknown Wallet';
  };
  
  const getWalletCurrency = (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    return wallet ? wallet.currency : 'NPR';
  };
  
  const formatCurrency = (amount: number | undefined, walletId: string) => {
    if (amount === undefined) return '';
    
    const currency = getWalletCurrency(walletId);
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'code',
    }).format(amount);

    return currency === 'NPR' ? formatted.replace('NPR', 'रु') : formatted;
  };
  
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500">No transactions found.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Wallet</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Income</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Expense</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="hover:bg-slate-50 transition-colors"
            >
              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                {format(new Date(transaction.date), 'MMM dd, yyyy')}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  transaction.income ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {transaction.income ? 'Income' : 'Expense'}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                {transaction.type}
              </td>
              <td className="px-4 py-3 text-sm text-slate-900 max-w-xs truncate">
                {transaction.reason}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                {getWalletName(transaction.wallet_id)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                {transaction.income ? (
                  <span className="inline-flex items-center text-emerald-600">
                    <ArrowUpRight size={16} className="mr-1" />
                    {formatCurrency(transaction.income, transaction.wallet_id)}
                  </span>
                ) : null}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                {transaction.expense ? (
                  <span className="inline-flex items-center text-red-600">
                    <ArrowDownRight size={16} className="mr-1" />
                    {formatCurrency(transaction.expense, transaction.wallet_id)}
                  </span>
                ) : null}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="p-1 rounded text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="p-1 rounded text-slate-600 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
