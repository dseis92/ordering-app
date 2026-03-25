import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Clock, ShoppingBag, RotateCcw, Trash2 } from "lucide-react";
import useOrderHistoryStore from "../store/useOrderHistoryStore";
import useCartStore from "../store/useCartStore";
import { formatCurrency } from "../lib/formatters";
import Button from "../components/ui/Button";

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const orders = useOrderHistoryStore((s) => s.orders);
  const removeOrder = useOrderHistoryStore((s) => s.removeOrder);
  const clearHistory = useOrderHistoryStore((s) => s.clearHistory);
  const addToCart = useCartStore((s) => s.addItem);

  const handleReorder = (order) => {
    // Add all items from the order back to the cart
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          totalPrice: item.price,
          selectedOptions: item.selectedOptions || {},
        });
      }
    });

    // Navigate to menu
    navigate("/");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-hilltop-gray hover:text-hilltop-charcoal mb-6 text-sm transition-colors"
        >
          <ChevronLeft size={16} /> Back to menu
        </button>

        <h1 className="text-3xl font-bold text-hilltop-charcoal mb-8">Order History</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
          <h2 className="text-xl font-semibold text-hilltop-charcoal mb-2">No orders yet</h2>
          <p className="text-hilltop-gray mb-6">
            Your order history will appear here after you place your first order
          </p>
          <Button onClick={() => navigate("/")}>Browse Menu</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-1 text-hilltop-gray hover:text-hilltop-charcoal mb-6 text-sm transition-colors"
      >
        <ChevronLeft size={16} /> Back to menu
      </button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-hilltop-charcoal">Order History</h1>
        {orders.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your order history?")) {
                clearHistory();
              }
            }}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 size={14} />
            Clear History
          </button>
        )}
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <div>
                <h3 className="font-bold text-hilltop-charcoal text-lg">
                  {order.orderNumber}
                </h3>
                <div className="flex items-center gap-3 text-sm text-hilltop-gray mt-1">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatDate(order.completedAt)}
                  </span>
                  <span>•</span>
                  <span className="capitalize">{order.orderType}</span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-2xl font-bold text-hilltop-charcoal">
                  {formatCurrency(order.total)}
                </p>
                <p className="text-sm text-hilltop-gray">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-hilltop-gray">
                    {item.quantity}× {item.name}
                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                      <span className="text-xs ml-2 text-hilltop-gray-light">
                        ({Object.values(item.selectedOptions).join(", ")})
                      </span>
                    )}
                  </span>
                  <span className="text-hilltop-charcoal font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleReorder(order)}
                className="flex-1 bg-hilltop-green hover:bg-hilltop-green-hover text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} />
                Reorder
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Remove this order from history?")) {
                    removeOrder(order.id);
                  }
                }}
                className="sm:w-auto px-4 py-3 border border-gray-300 text-hilltop-gray hover:border-red-300 hover:text-red-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                <span className="sm:hidden">Remove</span>
              </button>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-hilltop-gray">
                  <strong>Notes:</strong> {order.notes}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
