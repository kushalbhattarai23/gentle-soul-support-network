import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Transaction } from '../types';

interface TransactionState {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchTransactions: (walletId?: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  filterTransactions: (type?: string, startDate?: string, endDate?: string) => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  filteredTransactions: [],
  isLoading: false,
  error: null,
  
  fetchTransactions: async (walletId) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authenticated session found');
      }
      
      let query = supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
        
      if (walletId) {
        query = query.eq('wallet_id', walletId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      set({ 
        transactions: data as Transaction[],
        filteredTransactions: data as Transaction[]
      });
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error fetching transactions:', error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  
  addTransaction: async (transaction) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authenticated session found');
      }

      // Start a transaction to update both the transaction and wallet
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('id', transaction.wallet_id)
        .single();

      if (walletError) throw walletError;

      let newBalance = walletData.balance;
      if (transaction.income) {
        newBalance += transaction.income;
      }
      if (transaction.expense) {
        newBalance -= transaction.expense;
      }

      // Update wallet balance
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('id', transaction.wallet_id);

      if (updateError) throw updateError;

      // Create transaction
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...transaction, user_id: session.user.id }])
        .select();
        
      if (error) throw error;
      
      const newTransaction = data[0] as Transaction;
      
      set(state => ({ 
        transactions: [newTransaction, ...state.transactions],
        filteredTransactions: [newTransaction, ...state.filteredTransactions]
      }));
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error adding transaction:', error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateTransaction: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authenticated session found');
      }

      // Get the original transaction
      const { data: oldTransaction, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Calculate wallet balance adjustment
      const oldIncome = oldTransaction.income || 0;
      const oldExpense = oldTransaction.expense || 0;
      const newIncome = updates.income || 0;
      const newExpense = updates.expense || 0;

      const balanceAdjustment = (newIncome - oldIncome) - (newExpense - oldExpense);

      // Update wallet balance
      if (balanceAdjustment !== 0) {
        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select('balance')
          .eq('id', oldTransaction.wallet_id)
          .single();

        if (walletError) throw walletError;

        const { error: updateWalletError } = await supabase
          .from('wallets')
          .update({ balance: walletData.balance + balanceAdjustment })
          .eq('id', oldTransaction.wallet_id);

        if (updateWalletError) throw updateWalletError;
      }
      
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      const updatedTransaction = data[0] as Transaction;
      
      set(state => ({
        transactions: state.transactions.map(transaction => 
          transaction.id === id ? updatedTransaction : transaction
        ),
        filteredTransactions: state.filteredTransactions.map(transaction => 
          transaction.id === id ? updatedTransaction : transaction
        )
      }));
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error updating transaction:', error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authenticated session found');
      }

      // Get the transaction to be deleted
      const { data: transaction, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Update wallet balance
      if (transaction) {
        const balanceAdjustment = (transaction.expense || 0) - (transaction.income || 0);
        
        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select('balance')
          .eq('id', transaction.wallet_id)
          .single();

        if (walletError) throw walletError;

        const { error: updateError } = await supabase
          .from('wallets')
          .update({ balance: walletData.balance + balanceAdjustment })
          .eq('id', transaction.wallet_id);

        if (updateError) throw updateError;
      }
      
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      set(state => ({
        transactions: state.transactions.filter(transaction => transaction.id !== id),
        filteredTransactions: state.filteredTransactions.filter(transaction => transaction.id !== id)
      }));
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error deleting transaction:', error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  
  filterTransactions: (type, startDate, endDate) => {
    const { transactions } = get();
    
    let filtered = [...transactions];
    
    if (type && type !== 'All') {
      filtered = filtered.filter(transaction => transaction.type === type);
    }
    
    if (startDate) {
      filtered = filtered.filter(transaction => new Date(transaction.date) >= new Date(startDate));
    }
    
    if (endDate) {
      filtered = filtered.filter(transaction => new Date(transaction.date) <= new Date(endDate));
    }
    
    set({ filteredTransactions: filtered });
  }
}));