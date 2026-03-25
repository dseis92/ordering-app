import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ORDER_STATUSES = {
  received: {
    label: "Order Received",
    description: "We've received your order",
    icon: "📝",
    color: "blue",
  },
  preparing: {
    label: "Preparing",
    description: "Your food is being prepared",
    icon: "👨‍🍳",
    color: "yellow",
  },
  ready: {
    label: "Ready",
    description: "Your order is ready",
    icon: "✅",
    color: "green",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    description: "Your order is on its way",
    icon: "🚚",
    color: "purple",
  },
  completed: {
    label: "Completed",
    description: "Order delivered/picked up",
    icon: "🎉",
    color: "green",
  },
};

const useOrderStatusStore = create(
  persist(
    (set, get) => ({
      activeOrders: {}, // { orderNumber: { status, updatedAt, estimatedTime } }

      // Add or update an order status
      updateOrderStatus: (orderNumber, status, estimatedTime = null) => {
        const state = get();
        set({
          activeOrders: {
            ...state.activeOrders,
            [orderNumber]: {
              status,
              updatedAt: new Date().toISOString(),
              estimatedTime,
            },
          },
        });
      },

      // Get status for specific order
      getOrderStatus: (orderNumber) => {
        const state = get();
        return state.activeOrders[orderNumber] || null;
      },

      // Remove completed orders older than 24 hours
      cleanupOldOrders: () => {
        const state = get();
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const activeOrders = {};
        Object.entries(state.activeOrders).forEach(([orderNumber, data]) => {
          const updatedAt = new Date(data.updatedAt);
          if (data.status !== "completed" || updatedAt > oneDayAgo) {
            activeOrders[orderNumber] = data;
          }
        });

        set({ activeOrders });
      },
    }),
    {
      name: 'hilltop-order-status',
      version: 1,
    }
  )
);

export { ORDER_STATUSES };
export default useOrderStatusStore;
