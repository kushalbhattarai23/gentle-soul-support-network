import { create } from 'zustand';
import { supabase } from '../integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface CategoryStore {
  categories: Category[];
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ categories: data || [] });
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ categories: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addCategory: async (categoryData) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('categories')
        .insert([{ ...categoryData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      const { categories } = get();
      set({ categories: [data, ...categories] });
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCategory: async (id, categoryData) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      const { categories } = get();
      set({ categories: categories.map(c => c.id === id ? data : c) });
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      const { categories } = get();
      set({ categories: categories.filter(c => c.id !== id) });
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));