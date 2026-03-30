import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Clock, ChefHat, Package, Truck, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../lib/formatters';
import brand from '../brand.config';

const ORDER_STATUSES = [
  { key: 'received', label: 'Order Received', icon: Check, description: 'Your order has been received' },
  { key: 'preparing', label: 'Preparing', icon: ChefHat, description: 'Kitchen is preparing your food' },
  { key: 'ready', label: 'Ready', icon: Package, description: 'Your order is ready' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, description: 'Driver is on the way' },
  { key: 'completed', label: 'Completed', icon: CheckCircle, description: 'Order completed' },
];

export default function OrderStatusPage() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderNumber) {
      navigate('/orders');
      return;
    }

    // Fetch initial order
    fetchOrder();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`order-${orderNumber}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `order_number=eq.${orderNumber}`,
        },
        (payload) => {
          setOrder(payload.new);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [orderNumber, navigate]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .single();

      if (error) throw error;

      if (!data) {
        setError('Order not found');
      } else {
        setOrder(data);
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => {
    const index = ORDER_STATUSES.findIndex((s) => s.key === status);
    return index !== -1 ? index : 0;
  };

  const getPickupStatuses = () => {
    return ORDER_STATUSES.filter((s) => s.key !== 'out_for_delivery');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center">
        <Loader2 size={48} className="text-hilltop-green animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <XCircle size={64} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-hilltop-charcoal mb-2">
            {error || 'Order Not Found'}
          </h1>
          <p className="text-hilltop-gray mb-6">
            We couldn't find this order. Please check your order number.
          </p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-hilltop-green hover:bg-hilltop-green-hover text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            View Order History
          </button>
        </motion.div>
      </div>
    );
  }

  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  const currentStatusIndex = getStatusIndex(order.status);
  const statuses = order.order_type === 'pickup' ? getPickupStatuses() : ORDER_STATUSES;
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-hilltop-charcoal mb-2">
            Order Status
          </h1>
          <p className="text-xl text-hilltop-gray">#{order.order_number}</p>
        </motion.div>

        {/* Status Progress */}
        {!isCancelled ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-gray-100"
          >
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-8 left-8 right-8 h-1 bg-gray-200">
                <div
                  className="h-full bg-hilltop-green transition-all duration-500"
                  style={{
                    width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {/* Status Steps */}
              <div className="relative flex justify-between">
                {statuses.map((status, index) => {
                  const Icon = status.icon;
                  const isActive = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;

                  return (
                    <div key={status.key} className="flex flex-col items-center flex-1">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors ${
                          isActive
                            ? 'bg-hilltop-green text-white'
                            : 'bg-gray-200 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-hilltop-green/30 scale-110' : ''}`}
                      >
                        <Icon size={28} />
                      </motion.div>
                      <p
                        className={`text-sm font-semibold text-center ${
                          isActive ? 'text-hilltop-charcoal' : 'text-gray-400'
                        }`}
                      >
                        {status.label}
                      </p>
                      {isCurrent && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-hilltop-gray mt-1 text-center"
                        >
                          {status.description}
                        </motion.p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Estimated Time */}
            {order.estimated_time && order.status !== 'completed' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-4 bg-hilltop-green/10 rounded-xl text-center"
              >
                <div className="flex items-center justify-center gap-2 text-hilltop-green">
                  <Clock size={20} />
                  <p className="font-semibold">
                    Estimated {order.order_type === 'pickup' ? 'pickup' : 'delivery'} time:{' '}
                    <span className="text-xl">{order.estimated_time} minutes</span>
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 mb-6 text-center"
          >
            <XCircle size={64} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-700 mb-2">Order Cancelled</h2>
            <p className="text-red-600">
              This order has been cancelled. Please contact us if you have any questions.
            </p>
          </motion.div>
        )}

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-hilltop-charcoal mb-6">Order Details</h2>

          {/* Items */}
          <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-hilltop-gray">
                  {item.quantity}× {item.name}
                  {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                    <span className="text-xs ml-2">
                      ({Object.values(item.selectedOptions).join(', ')})
                    </span>
                  )}
                </span>
                <span className="font-semibold text-hilltop-charcoal">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between text-hilltop-gray">
              <span>Subtotal</span>
              <span>{formatCurrency(parseFloat(order.subtotal))}</span>
            </div>
            <div className="flex justify-between text-hilltop-gray">
              <span>Tax</span>
              <span>{formatCurrency(parseFloat(order.tax))}</span>
            </div>
            {parseFloat(order.tip) > 0 && (
              <div className="flex justify-between text-hilltop-gray">
                <span>Tip</span>
                <span>{formatCurrency(parseFloat(order.tip))}</span>
              </div>
            )}
            {parseFloat(order.delivery_fee) > 0 && (
              <div className="flex justify-between text-hilltop-gray">
                <span>Delivery Fee</span>
                <span>{formatCurrency(parseFloat(order.delivery_fee))}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-hilltop-charcoal pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatCurrency(parseFloat(order.total))}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-hilltop-gray">Order Type</span>
              <span className="font-semibold text-hilltop-charcoal capitalize">
                {order.order_type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-hilltop-gray">Name</span>
              <span className="font-semibold text-hilltop-charcoal">{order.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-hilltop-gray">Phone</span>
              <span className="font-semibold text-hilltop-charcoal">{order.customer_phone}</span>
            </div>
            {order.order_type === 'delivery' && order.delivery_address && (
              <div className="flex justify-between">
                <span className="text-hilltop-gray">Delivery Address</span>
                <span className="font-semibold text-hilltop-charcoal text-right">
                  {order.delivery_address}
                </span>
              </div>
            )}
            {order.order_type === 'pickup' && (
              <div className="flex justify-between">
                <span className="text-hilltop-gray">Pickup Location</span>
                <span className="font-semibold text-hilltop-charcoal text-right">
                  {brand.address.full}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-hilltop-gray">Order Placed</span>
              <span className="font-semibold text-hilltop-charcoal">
                {formatDate(order.created_at)}
              </span>
            </div>
          </div>

          {order.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-hilltop-gray">
                <strong>Special Instructions:</strong> {order.notes}
              </p>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 px-6 py-3 border-2 border-hilltop-green text-hilltop-green hover:bg-hilltop-green hover:text-white rounded-xl font-semibold transition-colors"
          >
            View All Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-hilltop-green hover:bg-hilltop-green-hover text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Order Again
          </button>
        </motion.div>

        {/* Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm text-hilltop-gray"
        >
          <p>
            Need help with your order?{' '}
            <a href={`tel:${brand.phone}`} className="text-hilltop-green hover:underline font-semibold">
              Call us at {brand.phone}
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
