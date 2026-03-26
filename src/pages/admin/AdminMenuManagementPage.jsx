import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LogOut,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Search,
  RotateCcw,
} from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';
import useMenuStore from '../../store/useMenuStore';
import { formatCurrency } from '../../lib/formatters';
import { categories } from '../../data/menu';
import brand from '../../brand.config';

export default function AdminMenuManagementPage() {
  const navigate = useNavigate();
  const logout = useAdminStore((s) => s.logout);
  const adminEmail = useAdminStore((s) => s.adminEmail);

  const getItems = useMenuStore((s) => s.getItems);
  const toggleSoldOut = useMenuStore((s) => s.toggleSoldOut);
  const updatePrice = useMenuStore((s) => s.updatePrice);
  const updateItem = useMenuStore((s) => s.updateItem);
  const deleteItem = useMenuStore((s) => s.deleteItem);
  const resetToDefault = useMenuStore((s) => s.resetToDefault);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  const menuItems = getItems();

  // Filter items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, categoryFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const soldOutCount = menuItems.filter((i) => i.soldOut).length;
    const totalItems = menuItems.length;
    const avgPrice =
      menuItems.reduce((sum, item) => sum + item.price, 0) / totalItems;

    return {
      totalItems,
      soldOutCount,
      availableCount: totalItems - soldOutCount,
      avgPrice,
    };
  }, [menuItems]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handlePriceEdit = (item) => {
    setEditingItem(item.id);
    setEditPrice(item.price.toString());
  };

  const handlePriceSave = (itemId) => {
    const newPrice = parseFloat(editPrice);
    if (!isNaN(newPrice) && newPrice > 0) {
      updatePrice(itemId, newPrice);
    }
    setEditingItem(null);
    setEditPrice('');
  };

  const handlePriceCancel = () => {
    setEditingItem(null);
    setEditPrice('');
  };

  const handleResetMenu = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all menu items to default? This will remove any custom changes.'
      )
    ) {
      resetToDefault();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 text-hilltop-gray hover:text-hilltop-green rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-hilltop-charcoal">
                Menu Management
              </h1>
              <p className="text-xs text-hilltop-gray">{adminEmail}</p>
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard label="Total Items" value={stats.totalItems} color="blue" />
          <StatsCard
            label="Available"
            value={stats.availableCount}
            color="green"
          />
          <StatsCard
            label="Sold Out"
            value={stats.soldOutCount}
            color="red"
            highlight={stats.soldOutCount > 0}
          />
          <StatsCard
            label="Avg Price"
            value={formatCurrency(stats.avgPrice)}
            color="purple"
          />
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-hilltop-gray"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-hilltop-green transition-colors"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-hilltop-green transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Reset Button */}
            <button
              onClick={handleResetMenu}
              className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 border-2 border-orange-200 rounded-lg transition-colors"
            >
              <RotateCcw size={18} />
              <span>Reset Menu</span>
            </button>
          </div>
        </div>

        {/* Menu Items List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-bold text-hilltop-charcoal mb-4">
              Menu Items ({filteredItems.length})
            </h2>

            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-hilltop-gray">
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                <p>No items found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <MenuItemRow
                    key={item.id}
                    item={item}
                    isEditingPrice={editingItem === item.id}
                    editPrice={editPrice}
                    onEditPrice={setEditPrice}
                    onStartEdit={() => handlePriceEdit(item)}
                    onSavePrice={() => handlePriceSave(item.id)}
                    onCancelEdit={handlePriceCancel}
                    onToggleSoldOut={() => toggleSoldOut(item.id)}
                    onDelete={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete "${item.name}"?`
                        )
                      ) {
                        deleteItem(item.id);
                      }
                    }}
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

function StatsCard({ label, value, color, highlight }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div
      className={`bg-white rounded-xl p-6 border-2 ${
        highlight ? 'border-red-300' : 'border-gray-200'
      }`}
    >
      <p className="text-sm text-hilltop-gray mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}

function MenuItemRow({
  item,
  isEditingPrice,
  editPrice,
  onEditPrice,
  onStartEdit,
  onSavePrice,
  onCancelEdit,
  onToggleSoldOut,
  onDelete,
}) {
  return (
    <motion.div
      layout
      className={`border-2 rounded-lg p-4 transition-all ${
        item.soldOut
          ? 'border-red-200 bg-red-50/50'
          : 'border-gray-200 hover:border-hilltop-green/30 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Item Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <h3 className="font-semibold text-hilltop-charcoal flex-1">
              {item.name}
              {item.featured && (
                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                  ⭐ Featured
                </span>
              )}
            </h3>
            <span className="text-xs bg-gray-100 text-hilltop-gray px-2 py-1 rounded">
              {item.category}
            </span>
          </div>
          <p className="text-sm text-hilltop-gray mb-3 line-clamp-2">
            {item.description}
          </p>

          {/* Price Editor */}
          <div className="flex items-center gap-3">
            {isEditingPrice ? (
              <>
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-hilltop-gray" />
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => onEditPrice(e.target.value)}
                    step="0.01"
                    min="0"
                    className="w-24 px-2 py-1 border-2 border-hilltop-green rounded focus:outline-none"
                    autoFocus
                  />
                </div>
                <button
                  onClick={onSavePrice}
                  className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                >
                  <CheckCircle size={18} />
                </button>
                <button
                  onClick={onCancelEdit}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <XCircle size={18} />
                </button>
              </>
            ) : (
              <>
                <span className="text-lg font-bold text-hilltop-charcoal">
                  {formatCurrency(item.price)}
                </span>
                <button
                  onClick={onStartEdit}
                  className="p-1 text-hilltop-gray hover:text-hilltop-green hover:bg-hilltop-green/10 rounded transition-colors"
                  title="Edit price"
                >
                  <Edit size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onToggleSoldOut}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              item.soldOut
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            {item.soldOut ? (
              <>
                <CheckCircle size={16} className="inline mr-1" />
                Mark Available
              </>
            ) : (
              <>
                <AlertCircle size={16} className="inline mr-1" />
                Mark Sold Out
              </>
            )}
          </button>

          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete item"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
