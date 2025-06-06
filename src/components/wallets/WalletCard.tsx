import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Wallet } from '../../types';

interface WalletCardProps {
  wallet: Wallet;
  onEdit: (wallet: Wallet) => void;
  onDelete: (id: string) => void;
  onSelect: (wallet: Wallet) => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  onEdit,
  onDelete,
  onSelect,
}) => {
  const formatCurrency = (amount: number, currency: string) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'code',
    }).format(amount);

    return currency === 'NPR' ? formatted.replace('NPR', 'रु') : formatted;
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 
            className="text-lg font-semibold text-slate-900 cursor-pointer hover:text-emerald-600 transition-colors"
            onClick={() => onSelect(wallet)}
          >
            {wallet.name}
          </h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(wallet);
              }}
              className="p-1.5 rounded-full hover:bg-slate-100"
            >
              <Edit2 size={16} className="text-slate-600" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(wallet.id);
              }}
              className="p-1.5 rounded-full hover:bg-red-100"
            >
              <Trash2 size={16} className="text-red-600" />
            </button>
          </div>
        </div>
        
        <div className="mt-2">
          <span className="text-2xl font-bold text-slate-900">
            {formatCurrency(wallet.balance, wallet.currency)}
          </span>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Created {new Date(wallet.created_at).toLocaleDateString()}
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
            {wallet.currency}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
