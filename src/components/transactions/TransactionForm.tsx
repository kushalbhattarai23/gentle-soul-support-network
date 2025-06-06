import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWalletStore } from '@/store/walletStore';
import { useCategoryStore } from '@/store/categoryStore';
import { useTransactionStore } from '@/store/transactionStore';
import { useToast } from '@/hooks/use-toast';

type TransactionType = 'income' | 'expense' | 'transfer';

interface TransactionFormProps {
  onSuccess?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const { wallets } = useWalletStore();
  const { categories } = useCategoryStore();
  const { addTransaction } = useTransactionStore();
  
  const [formData, setFormData] = useState({
    type: 'expense' as TransactionType,
    amount: '',
    reason: '',
    category_id: '',
    wallet_id: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.amount || !formData.reason || !formData.wallet_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        income: formData.type === 'income' ? parseFloat(formData.amount) : null,
        expense: formData.type === 'expense' ? parseFloat(formData.amount) : null,
        user_id: 'temp-user-id' // This should come from auth
      };

      await addTransaction(transactionData);
      
      toast({
        title: "Success",
        description: "Transaction added successfully!",
      });

      setFormData({
        type: 'expense',
        amount: '',
        reason: '',
        category_id: '',
        wallet_id: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add transaction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
        <CardDescription>Record a new income or expense</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value: TransactionType) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reason">Description</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="What was this transaction for?"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="wallet">Wallet</Label>
              <Select value={formData.wallet_id} onValueChange={(value: string) => setFormData({ ...formData, wallet_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet: any) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category_id} onValueChange={(value: string) => setFormData({ ...formData, category_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Transaction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};