import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useAddressStore = create((set, get) => ({
  addresses: [],
  loading: false,
  error: null,

  // Fetch user addresses
  fetchAddresses: async (userId) => {
    if (!userId) {
      set({ addresses: [], loading: false });
      return { data: [], error: null };
    }

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ addresses: data || [], loading: false });
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching addresses:', error);
      set({ error: error.message, loading: false });
      return { data: null, error };
    }
  },

  // Add new address
  addAddress: async (userId, address) => {
    set({ loading: true, error: null });
    try {
      // If this is set as default, unset other defaults first
      if (address.is_default) {
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', userId);
      }

      const { data, error } = await supabase
        .from('user_addresses')
        .insert([{ ...address, user_id: userId }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        addresses: [data, ...state.addresses],
        loading: false,
      }));

      return { data, error: null };
    } catch (error) {
      console.error('Error adding address:', error);
      set({ error: error.message, loading: false });
      return { data: null, error };
    }
  },

  // Update address
  updateAddress: async (addressId, updates) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .update(updates)
        .eq('id', addressId)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        addresses: state.addresses.map((addr) =>
          addr.id === addressId ? data : addr
        ),
        loading: false,
      }));

      return { data, error: null };
    } catch (error) {
      console.error('Error updating address:', error);
      set({ error: error.message, loading: false });
      return { data: null, error };
    }
  },

  // Set default address
  setDefaultAddress: async (userId, addressId) => {
    set({ loading: true, error: null });
    try {
      // Unset all defaults
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', userId);

      // Set new default
      const { data, error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        addresses: state.addresses.map((addr) =>
          addr.id === addressId
            ? { ...addr, is_default: true }
            : { ...addr, is_default: false }
        ),
        loading: false,
      }));

      return { data, error: null };
    } catch (error) {
      console.error('Error setting default address:', error);
      set({ error: error.message, loading: false });
      return { data: null, error };
    }
  },

  // Delete address
  deleteAddress: async (addressId) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      set((state) => ({
        addresses: state.addresses.filter((addr) => addr.id !== addressId),
        loading: false,
      }));

      return { error: null };
    } catch (error) {
      console.error('Error deleting address:', error);
      set({ error: error.message, loading: false });
      return { error };
    }
  },

  // Get default address
  getDefaultAddress: () => {
    const state = get();
    return state.addresses.find((addr) => addr.is_default);
  },

  // Clear addresses (local state only)
  clearAddresses: () => set({ addresses: [] }),
}));

export default useAddressStore;
