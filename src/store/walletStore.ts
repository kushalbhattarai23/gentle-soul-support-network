import { create } from 'zustand';
import { supabase } from '../integrations/supabase/client';

interface Wallet {
  id: string;
  name: string;
  balance: number;
  currency: string;
  user_id: string;
  created_at: string;
}

interface WalletStore {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  isLoading: boolean;
  fetchWallets: () => Promise<void>;
  addWallet: (wallet: Omit<Wallet, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  updateWallet: (id: string, wallet: Partial<Wallet>) => Promise<void>;
  deleteWallet: (id: string) => Promise<void>;
  selectWallet: (wallet: Wallet) => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  wallets: [],
  selectedWallet: null,
  isLoading: false,
  
  fetchWallets: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ wallets: data || [] });
    } catch (error) {
      console.error('Error fetching wallets:', error);
      set({ wallets: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addWallet: async (walletData) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('wallets')
        .insert([{ ...walletData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      const { wallets } = get();
      set({ wallets: [data, ...wallets] });
    } catch (error) {
      console.error('Error adding wallet:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateWallet: async (id, walletData) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('wallets')
        .update(walletData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      const { wallets } = get();
      set({ 
        wallets: wallets.map(w => w.id === id ? data : w),
        selectedWallet: get().selectedWallet?.id === id ? data : get().selectedWallet
      });
    } catch (error) {
      console.error('Error updating wallet:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteWallet: async (id) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('wallets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      const { wallets } = get();
      set({ 
        wallets: wallets.filter(w => w.id !== id),
        selectedWallet: get().selectedWallet?.id === id ? null : get().selectedWallet
      });
    } catch (error) {
      console.error('Error deleting wallet:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  selectWallet: (wallet) => {
    set({ selectedWallet: wallet });
  },
}));