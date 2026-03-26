import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LogOut,
  ShoppingBag,
  DollarSign,
  Clock,
  TrendingUp,
  Printer,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import useOrderHistoryStore from '../../store/useOrderHistoryStore';
import useOrderStatusStore from '../../store/useOrderStatusStore';
import { formatCurrency } from '../../lib/formatters';
import brand from '../../brand.config';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const logout = useAdminStore((s) => s.logout);
  const adminEmail = useAdminStore((s) => s.adminEmail);
  const orders = useOrderHistoryStore((s) => s.orders);
  const orderStatuses = useOrderStatusStore((s) => s.orders);
  const updateOrderStatus = useOrderStatusStore((s) => s.updateOrderStatus);
  const [filter, setFilter] = useState('all'); // all, pending, completed

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Combine orders with their status
  const ordersWithStatus = useMemo(() => {
    return orders.map((order) => ({
      ...order,
      status: orderStatuses[order.orderNumber]?.status || 'received',
    }));
  }, [orders, orderStatuses]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    if (filter === 'pending') {
      return ordersWithStatus.filter((o) =>
        ['received', 'preparing', 'ready', 'out_for_delivery'].includes(o.status)
      );
    }
    if (filter === 'completed') {
      return ordersWithStatus.filter((o) => o.status === 'completed');
    }
    return ordersWithStatus;
  }, [ordersWithStatus, filter]);

  // Calculate stats
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(
      (o) => new Date(o.completedAt).toDateString() === today
    );

    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0;
    const pendingCount = ordersWithStatus.filter((o) =>
      ['received', 'preparing'].includes(o.status)
    ).length;

    return {
      todayOrders: todayOrders.length,
      todayRevenue,
      avgOrderValue,
      pendingCount,
      totalOrders: orders.length,
    };
  }, [orders, ordersWithStatus]);

  const getStatusColor = (status) => {
    const colors = {
      received: 'bg-blue-100 text-blue-800',
      preparing: 'bg-yellow-100 text-yellow-800',
      ready: 'bg-green-100 text-green-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
      completed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors.received;
  };

  const getStatusLabel = (status) => {
    const labels = {
      received: 'Received',
      preparing: 'Preparing',
      ready: 'Ready',
      out_for_delivery: 'Out for Delivery',
      completed: 'Completed',
    };
    return labels[status] || status;
  };

  const handleStatusChange = (orderNumber, newStatus) => {
    updateOrderStatus(orderNumber, newStatus, 0);
  };

  const handlePrintTicket = (order) => {
    // Create a print-friendly version
    const printWindow = window.open('', '', 'width=300,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Kitchen Ticket - Order #${order.orderNumber}</title>
          <style>
            body { font-family: monospace; padding: 10px; font-size: 12px; }
            h1 { font-size: 18px; text-align: center; margin: 10px 0; }
            .order-info { margin: 15px 0; border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 10px 0; }
            .item { margin: 8px 0; }
            .item-name { font-weight: bold; }
            .item-options { margin-left: 10px; font-size: 11px; }
            .special { background: #ffeb3b; padding: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1>${brand.name}</h1>
          <div class="order-info">
            <div><strong>Order #${order.orderNumber}</strong></div>
            <div>${order.orderType.toUpperCase()}</div>
            <div>${new Date(order.completedAt).toLocaleString()}</div>
            <div>Customer: ${order.customer.name}</div>
            <div>Phone: ${order.customer.phone}</div>
          </div>
          <div>
            ${order.items
              .map(
                (item) => `
              <div class="item">
                <div class="item-name">${item.quantity}x ${item.name}</div>
                ${
                  item.selectedOptions
                    ? `<div class="item-options">${Object.entries(item.selectedOptions)
                        .map(([key, val]) => `• ${key}: ${val}`)
                        .join('<br>')}</div>`
                    : ''
                }
                ${
                  item.specialInstructions
                    ? `<div class="special">⚠️ ${item.specialInstructions}</div>`
                    : ''
                }
              </div>
            `
              )
              .join('')}
          </div>
          <div style="margin-top: 20px; border-top: 2px dashed #000; padding-top: 10px;">
            <strong>TOTAL: ${formatCurrency(order.total)}</strong>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-hilltop-charcoal">
              {brand.name} - Admin Dashboard
            </h1>
            <p className="text-xs text-hilltop-gray">{adminEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-hilltop-gray hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={<ShoppingBag />}
            label="Today's Orders"
            value={stats.todayOrders}
            color="blue"
          />
          <StatsCard
            icon={<DollarSign />}
            label="Today's Revenue"
            value={formatCurrency(stats.todayRevenue)}
            color="green"
          />
          <StatsCard
            icon={<TrendingUp />}
            label="Avg Order Value"
            value={formatCurrency(stats.avgOrderValue)}
            color="purple"
          />
          <StatsCard
            icon={<Clock />}
            label="Pending Orders"
            value={stats.pendingCount}
            color="orange"
            highlight={stats.pendingCount > 0}
          />
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Filter Tabs */}
          <div className="border-b border-gray-200 px-6 pt-4">
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'pending', label: 'Pending' },
                { id: 'completed', label: 'Completed' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                    filter === tab.id
                      ? 'border-hilltop-green text-hilltop-green'
                      : 'border-transparent text-hilltop-gray hover:text-hilltop-green'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="p-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-hilltop-gray">
                <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                <p>No orders found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                    onPrint={handlePrintTicket}
                    getStatusColor={getStatusColor}
                    getStatusLabel={getStatusLabel}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ icon, label, value, color, highlight }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl p-6 border-2 ${
        highlight ? 'border-orange-300 shadow-lg' : 'border-gray-200'
      }`}
    >
      <div className={`w-12 h-12 rounded-lg ${colors[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-hilltop-gray mb-1">{label}</p>
      <p className="text-2xl font-bold text-hilltop-charcoal">{value}</p>
    </motion.div>
  );
}

function OrderCard({ order, onStatusChange, onPrint, getStatusColor, getStatusLabel }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-hilltop-charcoal">
              Order #{order.orderNumber}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusLabel(order.status)}
            </span>
          </div>
          <div className="text-sm text-hilltop-gray space-y-1">
            <p>
              <strong>{order.customer.name}</strong> • {order.customer.phone}
            </p>
            <p>{new Date(order.completedAt).toLocaleString()}</p>
            <p className="font-semibold text-hilltop-charcoal">
              {order.orderType.toUpperCase()} • {formatCurrency(order.total)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onPrint(order)}
            className="p-2 text-hilltop-gray hover:text-hilltop-green hover:bg-hilltop-green/10 rounded-lg transition-colors"
            title="Print Kitchen Ticket"
          >
            <Printer size={20} />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1 text-sm text-hilltop-green hover:bg-hilltop-green/10 rounded-lg transition-colors"
          >
            {expanded ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-200 pt-4 mt-4 space-y-4"
        >
          {/* Items */}
          <div>
            <h4 className="font-semibold text-hilltop-charcoal mb-2">Items:</h4>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="text-sm bg-gray-50 rounded p-3">
                  <p className="font-medium">
                    {item.quantity}x {item.name}
                  </p>
                  {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                    <p className="text-xs text-hilltop-gray mt-1">
                      {Object.entries(item.selectedOptions)
                        .map(([key, val]) => `${key}: ${val}`)
                        .join(', ')}
                    </p>
                  )}
                  {item.specialInstructions && (
                    <p className="text-xs bg-yellow-100 text-yellow-800 p-2 rounded mt-2">
                      ⚠️ {item.specialInstructions}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Status Controls */}
          <div>
            <h4 className="font-semibold text-hilltop-charcoal mb-2">Update Status:</h4>
            <div className="flex flex-wrap gap-2">
              {['received', 'preparing', 'ready', order.orderType === 'delivery' ? 'out_for_delivery' : null, 'completed']
                .filter(Boolean)
                .map((status) => (
                  <button
                    key={status}
                    onClick={() => onStatusChange(order.orderNumber, status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      order.status === status
                        ? 'bg-hilltop-green text-white'
                        : 'bg-gray-100 text-hilltop-gray hover:bg-gray-200'
                    }`}
                  >
                    {getStatusLabel(status)}
                  </button>
                ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
