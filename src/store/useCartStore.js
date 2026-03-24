import { create } from "zustand";

const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.cartId === item.cartId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.cartId === item.cartId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),

  removeItem: (cartId) =>
    set((state) => ({ items: state.items.filter((i) => i.cartId !== cartId) })),

  updateQuantity: (cartId, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.cartId !== cartId)
          : state.items.map((i) =>
              i.cartId === cartId ? { ...i, quantity } : i
            ),
    })),

  clearCart: () => set({ items: [] }),

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  getSubtotal: () =>
    get().items.reduce((sum, i) => sum + i.totalPrice * i.quantity, 0),
}));

export default useCartStore;
