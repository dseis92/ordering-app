import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';

export default function MenuSearchModal({ isOpen, onClose, menuItems, onSelectItem }) {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (query.trim()) {
      const filtered = menuItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8); // Limit to 8 results
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  }, [query, menuItems]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSelectItem = (item) => {
    onSelectItem(item);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-32">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search menu items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 outline-none text-lg placeholder-gray-400"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Search size={48} className="mb-3 opacity-30" />
              <p className="text-sm">Type to search menu items</p>
              <p className="text-xs mt-1">Press <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600 font-mono">⌘K</kbd> or <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600 font-mono">Ctrl+K</kbd> to toggle</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Search size={48} className="mb-3 opacity-30" />
              <p className="text-sm">No items found for "{query}"</p>
              <button
                onClick={() => setQuery('')}
                className="mt-3 text-hilltop-green hover:underline text-sm"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="py-2">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left flex items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-hilltop-charcoal">{item.name}</h4>
                      <span className="text-sm font-bold text-hilltop-green">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">{item.category.replace('-', ' ')}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
