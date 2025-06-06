import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Category } from '../types';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,
  
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authenticated session found');
      }
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      set({ categories: data as Category[] });
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error fetching categories:', error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  
  addCategory: async (category) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authenticated session found');
      }
      
      const { data, error } = await supabase
        .from('categories')
        .insert([{ ...category, user_id: session.user.id }])
        .select();
        
      if (error) throw error;
      
      set(state => ({ 
        categories: [data[0] as Category, ...state.categories]
      }));
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error adding category:', error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateCategory: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authenticated session found');
      }
      
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      set(state => ({
        categories: state.categories.map(category => 
          category.id === id ? { ...category, ...updates } : category
        )
      }));
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error updating category:', error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authenticated session found');
      }
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      set(state => ({
        categories: state.categories.filter(category => category.id !== id)
      }));
    } catch (error: any) {
      set({ error: error.message });
      console.error('Error deleting category:', error.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));
