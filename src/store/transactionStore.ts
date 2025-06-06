import { create } from 'zustand';
import { supabase } from '../integrations/supabase/client';

interface Transaction {
  id: string;
  date: string;
  income?: number;
  expense?: number;
  type: string;
  reason: string;
  wallet_id: string;
  user_id: string;
  category_id?: string;
  created_at: string;
}

interface TransactionStore {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  isLoading: boolean;
  fetchTransactions: (walletId?: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  filterTransactions: (type?: string, startDate?: string, endDate?: string) => void;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  filteredTransactions: [],
  isLoading: false,

  fetchTransactions: async (walletId) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (walletId) {
        query = query.eq('wallet_id', walletId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const transactions = data || [];
      set({ 
        transactions,
        filteredTransactions: transactions
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      set({ transactions: [], filteredTransactions: [] });
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
      const newTransactions = [data, ...transactions];
      set({ 
        transactions: newTransactions,
        filteredTransactions: newTransactions
      });

      // Update wallet balance
      const amount = data.income || data.expense || 0;
      const balanceChange = data.income ? amount : -amount;
      
      await supabase.rpc('update_wallet_balance', {
        wallet_id: data.wallet_id,
        amount: balanceChange
      });

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
      const newTransactions = transactions.map(t => t.id === id ? data : t);
      set({ 
        transactions: newTransactions,
        filteredTransactions: newTransactions
      });
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
      const newTransactions = transactions.filter(t => t.id !== id);
      set({ 
        transactions: newTransactions,
        filteredTransactions: newTransactions
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  filterTransactions: (type, startDate, endDate) => {
    const { transactions } = get();
    
    let filtered = transactions;
    
    if (type && type !== 'All') {
      filtered = filtered.filter(t => t.type === type);
    }
    
    if (startDate) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(startDate));
    }
    
    if (endDate) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(endDate));
    }
    
    set({ filteredTransactions: filtered });
  },
}));