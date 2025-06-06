import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Wallet } from '../types';

interface WalletState {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  isLoading: boolean;
  error: string | null;
  fetchWallets: () => Promise<void>;
  addWallet: (wallet: Omit<Wallet, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateWallet: (id: string, updates: Partial<Wallet>) => Promise<void>;
  deleteWallet: (id: string) => Promise<void>;
  selectWallet: (wallet: Wallet | null) => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallets: [],
  selectedWallet: null,
  isLoading: false,
  error: null,
  
  fetchWallets: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authenticated session found');
      }
      
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      set({ wallets: data as Wallet[] });
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error fetching wallets:', error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  
  addWallet: async (wallet) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authenticated session found');
      }
      
      const { data, error } = await supabase
        .from('wallets')
        .insert([{ ...wallet, user_id: session.user.id }])
        .select();
        
      if (error) throw error;
      
      set(state => ({ 
        wallets: [data[0] as Wallet, ...state.wallets]
      }));
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error adding wallet:', error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateWallet: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authenticated session found');
      }
      
      const { data, error } = await supabase
        .from('wallets')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      set(state => ({
        wallets: state.wallets.map(wallet => 
          wallet.id === id ? { ...wallet, ...updates } : wallet
        ),
        selectedWallet: state.selectedWallet?.id === id 
          ? { ...state.selectedWallet, ...updates } 
          : state.selectedWallet
      }));
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error updating wallet:', error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteWallet: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authenticated session found');
      }
      
      const { error } = await supabase
        .from('wallets')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      set(state => ({
        wallets: state.wallets.filter(wallet => wallet.id !== id),
        selectedWallet: state.selectedWallet?.id === id ? null : state.selectedWallet
      }));
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error deleting wallet:', error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  
  selectWallet: (wallet) => {
    set({ selectedWallet: wallet });
  }
}));