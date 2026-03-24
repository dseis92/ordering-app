import { create } from "zustand";

const useOrderStore = create((set) => ({
  orderType: "pickup",
  customerInfo: { name: "", phone: "", email: "" },
  deliveryAddress: { street: "", city: "", state: "", zip: "" },
  tipPercent: 0,
  promoCode: "",
  orderNumber: null,
  status: "idle", // "idle" | "submitting" | "confirmed" | "error"

  setOrderType: (type) => set({ orderType: type }),
  setCustomerInfo: (info) =>
    set((s) => ({ customerInfo: { ...s.customerInfo, ...info } })),
  setDeliveryAddress: (addr) =>
    set((s) => ({ deliveryAddress: { ...s.deliveryAddress, ...addr } })),
  setTipPercent: (pct) => set({ tipPercent: pct }),
  setPromoCode: (code) => set({ promoCode: code }),
  setOrderNumber: (num) => set({ orderNumber: num }),
  setStatus: (status) => set({ status }),

  reset: () =>
    set({
      orderType: "pickup",
      customerInfo: { name: "", phone: "", email: "" },
      deliveryAddress: { street: "", city: "", state: "", zip: "" },
      tipPercent: 0,
      promoCode: "",
      orderNumber: null,
      status: "idle",
    }),
}));

export default useOrderStore;
