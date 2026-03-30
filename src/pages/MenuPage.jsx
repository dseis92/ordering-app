import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, X, Star, Clock, DollarSign, Phone, Truck } from "lucide-react";
import CategoryTabs from "../components/menu/CategoryTabs";
import MenuGrid from "../components/menu/MenuGrid";
import CustomizeModal from "../components/menu/CustomizeModal";
import StickyCartBar from "../components/cart/StickyCartBar";
import DailySpecialsBanner from "../components/menu/DailySpecialsBanner";
import { ImageCarouselHero } from "../components/ui/image-carousel-hero";
import brand from "../brand.config";
import useOrderStore from "../store/useOrderStore";
import useMenuStore from "../store/useMenuStore";
import { syncMenuToDatabase } from "../services/menu";
import { menuItems as defaultMenuItems } from "../data/menu";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("top-picks");
  const [selectedItem, setSelectedItem] = useState(null);
  const [query, setQuery] = useState("");
  const orderType = useOrderStore((s) => s.orderType);
  const setOrderType = useOrderStore((s) => s.setOrderType);

  // Subscribe to menu store properly to avoid infinite renders
  const items = useMenuStore((s) => s.items);
  const soldOutItems = useMenuStore((s) => s.soldOutItems);

  // Compute menu items with sold-out status
  const menuItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      soldOut: soldOutItems.includes(item.id),
    }));
  }, [items, soldOutItems]);

  // Sync menu to Supabase on first load
  useEffect(() => {
    const syncMenu = async () => {
      try {
        await syncMenuToDatabase(defaultMenuItems);
      } catch (error) {
        console.error('Error syncing menu to database:', error);
      }
    };
    syncMenu();
  }, []);

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
    <div className="min-h-screen pb-32" style={{
      background: "linear-gradient(to bottom, #fafaf9 0%, #f5f5f4 50%, #e7e5e4 100%)",
      backgroundImage: `
        linear-gradient(to bottom, #fafaf9 0%, #f5f5f4 50%, #e7e5e4 100%),
        url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.015' fill-rule='evenodd'/%3E%3C/svg%3E")
      `
    }}>
      {/* ================= IMAGE CAROUSEL HERO SECTION ================= */}
      <ImageCarouselHero
        title={brand.name}
        subtitle="Stevens Point's favorite since the 1980s"
        description="Famous fish fry, delicious burgers, and comfort food classics served fresh daily"
        ctaText="Order Online Now"
        onCtaClick={handleOrderOnline}
        images={[
          {
            id: '1',
            src: 'https://images.unsplash.com/photo-1580959375944-57609b97e5e6?w=400',
            alt: 'Fish and Chips',
            rotation: -15,
          },
          {
            id: '2',
            src: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
            alt: 'Juicy Burger',
            rotation: -8,
          },
          {
            id: '3',
            src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
            alt: 'Gourmet Burger',
            rotation: 5,
          },
          {
            id: '4',
            src: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400',
            alt: 'Fried Chicken',
            rotation: 12,
          },
          {
            id: '5',
            src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
            alt: 'Fresh Salad',
            rotation: -12,
          },
          {
            id: '6',
            src: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400',
            alt: 'Loaded Fries',
            rotation: 8,
          },
          {
            id: '7',
            src: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400',
            alt: 'Steak Dinner',
            rotation: -5,
          },
          {
            id: '8',
            src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
            alt: 'Delicious Meal',
            rotation: 15,
          },
        ]}
        features={[
          {
            title: 'Famous Fish Fry',
            description: 'Serving Kathy Mitchell\'s legendary fish fry since the 1980s',
          },
          {
            title: 'Quick Service',
            description: `Ready in ${brand.estimatedPickupMinutes} min for pickup, ${brand.estimatedDeliveryMinutes} min for delivery`,
          },
          {
            title: 'Fresh Daily',
            description: 'All dishes prepared fresh with quality ingredients',
          },
        ]}
      />

      {/* ================= MENU SECTION ================= */}
      <div id="menu-section" className="mt-16">
        {/* Restaurant Info Header */}
        <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-lg" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.01'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}>
          <div className="max-w-5xl mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-hilltop-charcoal mb-3 tracking-tight">
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
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search for dishes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200/50 rounded-2xl pl-12 pr-12 py-4 text-base focus:outline-none focus:ring-2 focus:ring-hilltop-green focus:border-hilltop-green/50 transition-all shadow-lg hover:shadow-xl"
              style={{
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}
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
