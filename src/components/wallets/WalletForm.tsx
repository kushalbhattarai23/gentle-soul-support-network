import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Wallet } from '../../types';

interface WalletFormProps {
  wallet?: Wallet;
  onSubmit: (data: Omit<Wallet, 'id' | 'user_id' | 'created_at'>) => void;
  isLoading: boolean;
}

const currencies = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'NPR', label: 'NPR - Nepalese Rupee' }
];

export const WalletForm: React.FC<WalletFormProps> = ({
  wallet,
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('0');
  const [currency, setCurrency] = useState('USD');
  
  useEffect(() => {
    if (wallet) {
      setName(wallet.name);
      setBalance(wallet.balance.toString());
      setCurrency(wallet.currency);
    }
  }, [wallet]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      name,
      balance: parseFloat(balance),
      currency,
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Wallet Name"
        placeholder="e.g., Cash, Bank, GPay"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        leftIcon={<CreditCard size={18} />}
      />
      
      <Input
        label="Initial Balance"
        type="number"
        step="0.01"
        placeholder="0.00"
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
        required
        leftIcon={<DollarSign size={18} />}
      />
      
      <Select
        label="Currency"
        options={currencies}
        value={currency}
        onChange={setCurrency}
        required
      />
      
      <Button type="submit" isLoading={isLoading} className="w-full mt-6">
        {wallet ? 'Update Wallet' : 'Create Wallet'}
      </Button>
    </form>
  );
};