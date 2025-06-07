
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category_id: string;
  wallet_id: string;
  user_id: string;
  created_at: string;
}

interface TransactionStore {
  transactions: Transaction[];
  isLoading: boolean;
  fetchTransactions: (walletId?: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  isLoading: false,
  
  fetchTransactions: async (walletId?: string) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);

      if (walletId) {
        query = query.eq('wallet_id', walletId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      set({ transactions: data || [] });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      set({ transactions: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addTransaction: async (transactionData) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...transactionData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      const { transactions } = get();
      set({ transactions: [data, ...transactions] });
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTransaction: async (id, transactionData) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('transactions')
        .update(transactionData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      const { transactions } = get();
      set({ transactions: transactions.map(t => t.id === id ? data : t) });
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTransaction: async (id) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      const { transactions } = get();
      set({ transactions: transactions.filter(t => t.id !== id) });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
