import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Clock, ShoppingBag, RotateCcw, Package, Loader2 } from "lucide-react";
import useOrderHistoryStore from "../store/useOrderHistoryStore";
import useAuthStore from "../store/useAuthStore";
import useCartStore from "../store/useCartStore";
import { formatCurrency } from "../lib/formatters";
import Button from "../components/ui/Button";

const STATUS_LABELS = {
  received: { label: 'Order Received', color: 'bg-blue-100 text-blue-700' },
  preparing: { label: 'Preparing', color: 'bg-yellow-100 text-yellow-700' },
  ready: { label: 'Ready for Pickup', color: 'bg-green-100 text-green-700' },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-purple-100 text-purple-700' },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
};

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const orders = useOrderHistoryStore((s) => s.orders);
  const loading = useOrderHistoryStore((s) => s.loading);
  const fetchOrders = useOrderHistoryStore((s) => s.fetchOrders);
  const subscribeToOrders = useOrderHistoryStore((s) => s.subscribeToOrders);
  const unsubscribe = useOrderHistoryStore((s) => s.unsubscribe);
  const addToCart = useCartStore((s) => s.addItem);

  useEffect(() => {
    // Fetch orders on mount
    if (user) {
      fetchOrders(user.id, user.email);
      subscribeToOrders(user.id, user.email);
    }

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [user, fetchOrders, subscribeToOrders, unsubscribe]);

  const handleReorder = (order) => {
    // Add all items from the order back to the cart
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          totalPrice: item.totalPrice || item.price,
          selectedOptions: item.selectedOptions || {},
          cartId: `${item.id}-${Date.now()}-${Math.random()}`,
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-hilltop-gray hover:text-hilltop-charcoal mb-6 text-sm transition-colors"
        >
          <ChevronLeft size={16} /> Back to menu
        </button>

        <h1 className="text-3xl font-bold text-hilltop-charcoal mb-8">Order History</h1>

        <div className="flex items-center justify-center py-16">
          <Loader2 size={48} className="text-hilltop-green animate-spin" />
        </div>
      </div>
    );
  }

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
        <p className="text-sm text-hilltop-gray">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => {
          const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
          const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.received;

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-hilltop-charcoal text-lg">
                      #{order.order_number}
                    </h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-hilltop-gray">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatDate(order.completed_at || order.created_at)}
                    </span>
                    <span>•</span>
                    <span className="capitalize flex items-center gap-1">
                      <Package size={14} />
                      {order.order_type}
                    </span>
                    {order.estimated_time && (
                      <>
                        <span>•</span>
                        <span>{order.estimated_time} min</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-bold text-hilltop-charcoal">
                    {formatCurrency(parseFloat(order.total))}
                  </p>
                  <p className="text-sm text-hilltop-gray">
                    {items.reduce((sum, item) => sum + item.quantity, 0)} items
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                {items.map((item, idx) => (
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
                {order.status !== 'completed' && order.status !== 'cancelled' && (
                  <button
                    onClick={() => navigate(`/orders/${order.order_number}`)}
                    className="flex-1 sm:flex-none px-4 py-3 border-2 border-hilltop-green text-hilltop-green hover:bg-hilltop-green hover:text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Package size={16} />
                    Track Order
                  </button>
                )}
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
          );
        })}
      </div>
    </div>
  );
}
