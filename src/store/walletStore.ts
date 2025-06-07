
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Wallet {
  id: string;
  name: string;
  currency: string;
  balance: number;
  user_id: string;
  created_at: string;
}

interface WalletState {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  isLoading: boolean;
  fetchWallets: () => Promise<void>;
  createWallet: (wallet: Omit<Wallet, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateWallet: (id: string, wallet: Partial<Wallet>) => Promise<void>;
  deleteWallet: (id: string) => Promise<void>;
  selectWallet: (wallet: Wallet) => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallets: [],
  selectedWallet: null,
  isLoading: false,
  
  fetchWallets: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ wallets: data || [] });
    } catch (error) {
      console.error('Error fetching wallets:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  createWallet: async (wallet) => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .insert([wallet])
        .select()
        .single();
      
      if (error) throw error;
      set({ wallets: [data, ...get().wallets] });
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  },
  
  updateWallet: async (id, wallet) => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .update(wallet)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      const updatedWallets = get().wallets.map(w => w.id === id ? data : w);
      set({ 
        wallets: updatedWallets,
        selectedWallet: get().selectedWallet?.id === id ? data : get().selectedWallet
      });
    } catch (error) {
      console.error('Error updating wallet:', error);
      throw error;
    }
  },
  
  deleteWallet: async (id) => {
    try {
      const { error } = await supabase
        .from('wallets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      set({ 
        wallets: get().wallets.filter(w => w.id !== id),
        selectedWallet: get().selectedWallet?.id === id ? null : get().selectedWallet
      });
    } catch (error) {
      console.error('Error deleting wallet:', error);
      throw error;
    }
  },

  selectWallet: (wallet) => {
    set({ selectedWallet: wallet });
  },
}));
