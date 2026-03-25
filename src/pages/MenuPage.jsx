import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X, Star, Clock, DollarSign, Phone, Truck } from "lucide-react";
import { menuItems } from "../data/menu";
import CategoryTabs from "../components/menu/CategoryTabs";
import MenuGrid from "../components/menu/MenuGrid";
import CustomizeModal from "../components/menu/CustomizeModal";
import StickyCartBar from "../components/cart/StickyCartBar";
import DailySpecialsBanner from "../components/menu/DailySpecialsBanner";
import brand from "../brand.config";
import useOrderStore from "../store/useOrderStore";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("top-picks");
  const [selectedItem, setSelectedItem] = useState(null);
  const [query, setQuery] = useState("");
  const orderType = useOrderStore((s) => s.orderType);
  const setOrderType = useOrderStore((s) => s.setOrderType);

  const filtered = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === "all" ||
      (activeCategory === "top-picks" && item.featured) ||
      item.category === activeCategory;
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

  const scrollToMenu = () => {
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOrderOnline = () => {
    setOrderType("pickup");
    scrollToMenu();
  };

  const handleDelivery = () => {
    setOrderType("delivery");
    scrollToMenu();
  };

  return (
    <div className="bg-hilltop-bg-light min-h-screen pb-32">
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full h-[70vh] flex items-center justify-center">
        {/* Background Image */}
        <img
          src="/images/hilltop-hero-image.png"
          alt="Hilltop Pub and Grill"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-white text-5xl md:text-7xl font-display font-bold mb-4">
              Hilltop Pub and Grill
            </h1>

            <p className="text-gray-200 text-xl md:text-2xl mb-3 font-light">
              Stevens Point's favorite since the 1980s
            </p>

            <p className="text-gray-300 text-lg md:text-xl mb-10 italic">
              {brand.specialties}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* ORDER ONLINE */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOrderOnline}
                className="bg-hilltop-green hover:bg-hilltop-green-hover text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Order Online</span>
              </motion.button>

              {/* CALL */}
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`tel:${brand.phone.replace(/\D/g, '')}`}
                className="bg-white text-hilltop-charcoal px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Phone size={20} />
                <span>Call Us</span>
              </motion.a>

              {/* DELIVERY */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelivery}
                className="bg-transparent text-white px-8 py-4 rounded-xl font-semibold border-2 border-white hover:bg-white hover:text-hilltop-charcoal transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Truck size={20} />
                <span>Get Delivery</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= MENU SECTION ================= */}
      <div id="menu-section">
        {/* Restaurant Info Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold text-hilltop-charcoal mb-2">
                Our Menu
              </h2>

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
            </motion.div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Search */}
          <div className="relative mb-6">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search for dishes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-11 pr-10 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-hilltop-green focus:border-transparent transition-all shadow-sm"
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

          {/* Daily Specials Banner — hide when searching */}
          {!query && <DailySpecialsBanner onCategoryChange={handleCategoryChange} />}
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
      </div>

      <CustomizeModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      <StickyCartBar />
    </div>
  );
}
