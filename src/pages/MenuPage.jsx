import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X, Star, Clock, DollarSign } from "lucide-react";
import { menuItems } from "../data/menu";
import CategoryTabs from "../components/menu/CategoryTabs";
import MenuGrid from "../components/menu/MenuGrid";
import CustomizeModal from "../components/menu/CustomizeModal";
import StickyCartBar from "../components/cart/StickyCartBar";
import brand from "../brand.config";
import useOrderStore from "../store/useOrderStore";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [query, setQuery] = useState("");
  const orderType = useOrderStore((s) => s.orderType);

  const filtered = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setQuery("");
  };

  const estimatedTime = orderType === "delivery"
    ? `${brand.estimatedDeliveryMinutes} min`
    : `${brand.estimatedPickupMinutes} min`;

  return (
    <div className="bg-hilltop-bg-light min-h-screen pb-32">
      {/* Restaurant Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-hilltop-charcoal mb-2">{brand.name}</h1>

            {/* Info Pills */}
            <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-hilltop-charcoal">{brand.rating}</span>
                <span className="text-hilltop-gray">({brand.reviewCount}+)</span>
              </div>

              <span className="text-gray-300">•</span>

              <div className="flex items-center gap-1.5 text-hilltop-gray">
                <Clock size={16} />
                <span>{estimatedTime}</span>
              </div>

              {orderType === "delivery" && (
                <>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1.5 text-hilltop-gray">
                    <DollarSign size={16} />
                    <span>${brand.deliveryFee.toFixed(2)} delivery</span>
                  </div>
                </>
              )}
            </div>

            <p className="text-sm text-hilltop-gray-light leading-relaxed italic">
              {brand.specialties}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search for dishes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg pl-11 pr-10 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Category tabs — hide when searching */}
      {!query && (
        <CategoryTabs active={activeCategory} onChange={handleCategoryChange} />
      )}

      {/* Menu Items */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-lg">No items match "{query}"</p>
            <p className="text-gray-400 text-sm mt-2">Try a different search term</p>
          </motion.div>
        ) : (
          <MenuGrid items={filtered} onSelectItem={setSelectedItem} />
        )}
      </div>

      <CustomizeModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      <StickyCartBar />
    </div>
  );
}
