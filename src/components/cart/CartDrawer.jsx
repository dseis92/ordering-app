import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import Button from "../ui/Button";

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const navigate = useNavigate();

  const subtotal = items.reduce((s, i) => s + i.totalPrice * i.quantity, 0);

  const goToCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-forest">Your Order</h2>
              <button
                onClick={closeCart}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <p className="text-gray-400 text-center py-16">
                  Your cart is empty
                </p>
              ) : (
                items.map((item) => (
                  <CartItem key={item.cartId} item={item} />
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t border-gray-100 space-y-4">
                <CartSummary subtotal={subtotal} />
                <Button onClick={goToCheckout} className="w-full">
                  Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
