import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import { formatCurrency } from "../../lib/formatters";

export default function StickyCartBar() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const itemCount = useCartStore((s) => s.getItemCount());
  const subtotal = useCartStore((s) => s.getSubtotal());

  const hasItems = items.length > 0;

  return (
    <AnimatePresence>
      {hasItems && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
        >
          <div className="max-w-5xl mx-auto px-4 pb-6">
            <button
              onClick={() => navigate("/checkout")}
              className="pointer-events-auto w-full bg-brand-primary hover:bg-brand-dark text-white font-semibold rounded-xl px-6 py-4 shadow-2xl transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full p-2">
                  <ShoppingBag size={20} />
                </div>
                <span className="text-lg">View Cart</span>
                <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-bold">
                  {itemCount}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{formatCurrency(subtotal)}</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
