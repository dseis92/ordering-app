import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useFavoritesStore = create((set, get) => ({
  favorites: [],
  loading: false,
  error: null,

  // Fetch user favorites with menu item details
  fetchFavorites: async (userId) => {
    if (!userId) {
      set({ favorites: [], loading: false });
      return { data: [], error: null };
    }

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          *,
          menu_items (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ favorites: data || [], loading: false });
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching favorites:', error);
      set({ error: error.message, loading: false });
      return { data: null, error };
    }
  },

  // Add item to favorites
  addFavorite: async (userId, menuItemId, customization = {}) => {
    if (!userId) {
      return { data: null, error: { message: 'User must be logged in to add favorites' } };
    }

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .insert([{
          user_id: userId,
          menu_item_id: menuItemId,
          customization,
        }])
        .select(`
          *,
          menu_items (*)
        `)
        .single();

      if (error) throw error;

      set((state) => ({
        favorites: [data, ...state.favorites],
        loading: false,
      }));

      return { data, error: null };
    } catch (error) {
      console.error('Error adding favorite:', error);
      set({ error: error.message, loading: false });
      return { data: null, error };
    }
  },

  // Remove item from favorites
  removeFavorite: async (favoriteId) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      set((state) => ({
        favorites: state.favorites.filter((fav) => fav.id !== favoriteId),
        loading: false,
      }));

      return { error: null };
    } catch (error) {
      console.error('Error removing favorite:', error);
      set({ error: error.message, loading: false });
      return { error };
    }
  },

  // Remove favorite by menu item ID
  removeFavoriteByMenuItem: async (userId, menuItemId) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('menu_item_id', menuItemId);

      if (error) throw error;

      set((state) => ({
        favorites: state.favorites.filter((fav) => fav.menu_item_id !== menuItemId),
        loading: false,
      }));

      return { error: null };
    } catch (error) {
      console.error('Error removing favorite:', error);
      set({ error: error.message, loading: false });
      return { error };
    }
  },

  // Check if item is favorited
  isFavorite: (menuItemId) => {
    const state = get();
    return state.favorites.some((fav) => fav.menu_item_id === menuItemId);
  },

  // Get favorite by menu item ID
  getFavoriteByMenuItem: (menuItemId) => {
    const state = get();
    return state.favorites.find((fav) => fav.menu_item_id === menuItemId);
  },

  // Clear favorites (local state only)
  clearFavorites: () => set({ favorites: [] }),
}));

export default useFavoritesStore;
