import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useOrderHistoryStore = create((set, get) => ({
  orders: [],
  loading: false,
  error: null,
  subscription: null,

  // Fetch orders for the current user
  fetchOrders: async (userId, userEmail) => {
    set({ loading: true, error: null });
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // If user is authenticated, fetch by user_id
      // Otherwise fetch by email for guest orders
      if (userId) {
        query = query.eq('user_id', userId);
      } else if (userEmail) {
        query = query.eq('customer_email', userEmail);
      } else {
        set({ orders: [], loading: false });
        return { data: [], error: null };
      }

      const { data, error } = await query;

      if (error) throw error;

      set({ orders: data || [], loading: false });
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ error: error.message, loading: false });
      return { data: null, error };
    }
  },

  // Subscribe to real-time order updates
  subscribeToOrders: (userId, userEmail) => {
    const existingSub = get().subscription;
    if (existingSub) {
      existingSub.unsubscribe();
    }

    const channel = supabase
      .channel('order-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: userId ? `user_id=eq.${userId}` : `customer_email=eq.${userEmail}`,
        },
        (payload) => {
          const { eventType, new: newOrder, old: oldOrder } = payload;

          set((state) => {
            let updatedOrders = [...state.orders];

            if (eventType === 'INSERT') {
              updatedOrders = [newOrder, ...updatedOrders];
            } else if (eventType === 'UPDATE') {
              updatedOrders = updatedOrders.map((order) =>
                order.id === newOrder.id ? newOrder : order
              );
            } else if (eventType === 'DELETE') {
              updatedOrders = updatedOrders.filter((order) => order.id !== oldOrder.id);
            }

            return { orders: updatedOrders };
          });
        }
      )
      .subscribe();

    set({ subscription: channel });
  },

  // Unsubscribe from real-time updates
  unsubscribe: () => {
    const sub = get().subscription;
    if (sub) {
      sub.unsubscribe();
      set({ subscription: null });
    }
  },

  // Get order by ID
  getOrder: (orderId) => {
    const state = get();
    return state.orders.find((order) => order.id === orderId || order.order_number === orderId);
  },

  // Clear all order history (local state only)
  clearOrders: () => set({ orders: [] }),
}));

export default useOrderHistoryStore;
