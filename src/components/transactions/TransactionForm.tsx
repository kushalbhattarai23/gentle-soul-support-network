import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Tag, FileText } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Transaction, Wallet } from '../../types';
import { useCategoryStore } from '../../store/categoryStore';

interface TransactionFormProps {
  transaction?: Transaction;
  wallets: Wallet[];
  selectedWalletId?: string;
  onSubmit: (data: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => void;
  isLoading: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  wallets,
  selectedWalletId,
  onSubmit,
  isLoading,
}) => {
  const { categories, fetchCategories } = useCategoryStore();
  const today = new Date().toISOString().split('T')[0];
  
  const [date, setDate] = useState(today);
  const [transactionType, setTransactionType] = useState('expense');
  const [category, setCategory] = useState('');
  const [reason, setReason] = useState('');
  const [walletId, setWalletId] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);
  
  useEffect(() => {
    if (transaction) {
      setDate(transaction.date);
      setTransactionType(transaction.income ? 'income' : 'expense');
      setCategory(transaction.type);
      setReason(transaction.reason);
      setWalletId(transaction.wallet_id);
      setAmount(transaction.income ? transaction.income.toString() : transaction.expense ? transaction.expense.toString() : '');
    }
  }, [transaction]);
  
  useEffect(() => {
    if (selectedWalletId) {
      setWalletId(selectedWalletId);
    } else if (wallets.length === 1) {
      setWalletId(wallets[0].id);
    }
  }, [selectedWalletId, wallets]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!walletId) {
      setError('Please select a wallet');
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    
    onSubmit({
      date,
      type: category,
      income: transactionType === 'income' ? parsedAmount : undefined,
      expense: transactionType === 'expense' ? parsedAmount : undefined,
      reason,
      wallet_id: walletId,
    });
  };
  
  const transactionTypeOptions = [
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
  ];
  
  const categoryOptions = categories.map(cat => ({
    value: cat.name,
    label: cat.name,
  }));
  
  const walletOptions = wallets.map(wallet => ({
    value: wallet.id,
    label: `${wallet.name} (${wallet.currency})`,
  }));
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        leftIcon={<Calendar size={18} />}
      />
      
      <Select
        label="Transaction Type"
        options={transactionTypeOptions}
        value={transactionType}
        onChange={setTransactionType}
        required
      />
      
      <Select
        label="Category"
        options={categoryOptions}
        value={category}
        onChange={setCategory}
        required
      />
      
      <Input
        label="Reason"
        placeholder="Enter transaction reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
        leftIcon={<FileText size={18} />}
      />
      
      <Select
        label="Wallet"
        options={walletOptions}
        value={walletId}
        onChange={setWalletId}
        required
        error={error}
      />
      
      <Input
        label={`${transactionType === 'income' ? 'Income' : 'Expense'} Amount`}
        type="number"
        step="0.01"
        placeholder="0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        leftIcon={<DollarSign size={18} className={transactionType === 'income' ? 'text-emerald-500' : 'text-red-500'} />}
      />
      
      <Button type="submit" isLoading={isLoading} className="w-full mt-6">
        {transaction ? 'Update Transaction' : 'Create Transaction'}
      </Button>
    </form>
  );
};
