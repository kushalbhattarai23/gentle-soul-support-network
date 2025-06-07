
import React from 'react';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category_id: string;
  wallet_id: string;
}

interface Wallet {
  id: string;
  name: string;
  currency: string;
}

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
  onDelete
}) => {
  const getWalletCurrency = (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    return wallet?.currency || 'USD';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg"
        >
          <div className="flex-1">
            <h3 className="font-medium text-slate-900">{transaction.description}</h3>
            <p className="text-sm text-slate-500">
              {format(new Date(transaction.date), 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`font-semibold ${
              transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(transaction.amount, getWalletCurrency(transaction.wallet_id))}
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(transaction)}
              >
                <Edit size={16} />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(transaction.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
