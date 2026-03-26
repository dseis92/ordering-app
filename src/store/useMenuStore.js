import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { menuItems as defaultMenuItems } from '../data/menu';

const useMenuStore = create(
  persist(
    (set, get) => ({
      items: defaultMenuItems,
      soldOutItems: [], // Array of item IDs that are sold out

      // Get all menu items with sold out status
      getItems: () => {
        const { items, soldOutItems } = get();
        return items.map((item) => ({
          ...item,
          soldOut: soldOutItems.includes(item.id),
        }));
      },

      // Toggle sold out status
      toggleSoldOut: (itemId) => {
        set((state) => ({
          soldOutItems: state.soldOutItems.includes(itemId)
            ? state.soldOutItems.filter((id) => id !== itemId)
            : [...state.soldOutItems, itemId],
        }));
      },

      // Update item price
      updatePrice: (itemId, newPrice) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, price: newPrice } : item
          ),
        }));
      },

      // Update entire item
      updateItem: (itemId, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        }));
      },

      // Add new item
      addItem: (newItem) => {
        set((state) => ({
          items: [
            ...state.items,
            {
              ...newItem,
              id: Math.max(...state.items.map((i) => i.id), 0) + 1,
            },
          ],
        }));
      },

      // Delete item
      deleteItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
          soldOutItems: state.soldOutItems.filter((id) => id !== itemId),
        }));
      },

      // Reset to default menu
      resetToDefault: () => {
        set({
          items: defaultMenuItems,
          soldOutItems: [],
        });
      },
    }),
    {
      name: 'hilltop-menu-management',
      version: 1,
    }
  )
);

export default useMenuStore;
