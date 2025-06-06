import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthState {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  getUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (!error && data.user) {
      set({ user: { id: data.user.id, email: data.user.email || '' }, session: data.session });
    }
    
    return { error };
  },
  
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error && data.user) {
      set({ user: { id: data.user.id, email: data.user.email || '' }, session: data.session });
    }
    
    return { error };
  },
  
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
  
  getUser: async () => {
    set({ isLoading: true });
    
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.user) {
      set({
        user: { id: data.session.user.id, email: data.session.user.email || '' },
        session: data.session,
      });
    }
    
    set({ isLoading: false });
  },
}));