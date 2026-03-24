import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { formatCurrency } from "../../lib/formatters";

const CATEGORY_EMOJI = {
  appetizers: "🧀",
  "fish-fry": "🐟",
  burgers: "🍔",
  dinners: "🍽️",
  salads: "🥗",
};

const CATEGORY_BG = {
  appetizers: "from-amber-100 to-orange-50",
  "fish-fry": "from-blue-100 to-cyan-50",
  burgers: "from-red-100 to-orange-50",
  dinners: "from-purple-100 to-pink-50",
  salads: "from-green-100 to-emerald-50",
};

export default function MenuItemCard({ item, onSelect }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const showPhoto = item.image && !imgError;
  const bg = CATEGORY_BG[item.category] ?? "from-gray-100 to-gray-50";

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(item)}
      className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer flex flex-col group"
    >
      {/* Image / Placeholder */}
      <div className={`relative h-44 bg-gradient-to-br ${bg} flex items-center justify-center overflow-hidden`}>
        {showPhoto && (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gray-200" />
            )}
            <img
              src={item.image}
              alt={item.name}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </>
        )}
        {!showPhoto && (
          <span className="text-6xl select-none group-hover:scale-110 transition-transform">
            {CATEGORY_EMOJI[item.category] ?? "🍽️"}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="font-semibold text-hilltop-charcoal text-base leading-tight">{item.name}</h3>
        <p className="text-sm text-hilltop-gray flex-1 leading-relaxed line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-hilltop-charcoal text-lg">
            {formatCurrency(item.price)}
          </span>
          <button
            className="bg-hilltop-green text-white rounded-full p-2 hover:bg-hilltop-green-hover active:scale-95 transition-all shadow-sm"
            aria-label={`Add ${item.name}`}
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
