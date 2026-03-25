import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useOrderHistoryStore = create(
  persist(
    (set, get) => ({
      orders: [],

      // Add a completed order to history
      addOrder: (order) =>
        set((state) => ({
          orders: [
            {
              ...order,
              id: order.orderNumber,
              completedAt: new Date().toISOString(),
            },
            ...state.orders,
          ].slice(0, 50), // Keep only last 50 orders
        })),

      // Get order by ID
      getOrder: (orderId) => {
        const state = get();
        return state.orders.find((order) => order.id === orderId);
      },

      // Clear all order history
      clearHistory: () => set({ orders: [] }),

      // Remove a specific order
      removeOrder: (orderId) =>
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== orderId),
        })),
    }),
    {
      name: 'hilltop-order-history', // localStorage key
      version: 1,
    }
  )
);

export default useOrderHistoryStore;
