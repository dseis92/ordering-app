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
  appetizers: "from-amber-50 via-orange-50 to-amber-100",
  "fish-fry": "from-blue-50 via-cyan-50 to-teal-100",
  burgers: "from-rose-50 via-orange-50 to-amber-100",
  dinners: "from-purple-50 via-pink-50 to-rose-100",
  salads: "from-emerald-50 via-green-50 to-lime-100",
};

const cardVariants = {
  offscreen: {
    y: 300,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    rotate: -2,
    transition: {
      type: "spring",
      bounce: 0.3,
      duration: 0.8,
    },
  },
};

export function StackCard({ item, onSelect, index }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const showPhoto = item.image && !imgError;
  const bg = CATEGORY_BG[item.category] ?? "from-gray-100 to-gray-50";
  const isSoldOut = item.soldOut;

  // Generate rich gradient background based on category
  const gradientColors = {
    appetizers: ["#fef3c7", "#fdba74", "#f59e0b"],
    "fish-fry": ["#dbeafe", "#67e8f9", "#0891b2"],
    burgers: ["#ffe4e6", "#fda4af", "#e11d48"],
    dinners: ["#f3e8ff", "#e9d5ff", "#a855f7"],
    salads: ["#d1fae5", "#6ee7b7", "#059669"],
  };

  const colors = gradientColors[item.category] || ["#f3f4f6", "#e5e7eb", "#9ca3af"];
  const background = `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`;

  return (
    <motion.div
      className="w-full flex justify-center items-center relative mb-[-100px] first:mb-0"
      style={{
        paddingTop: index === 0 ? 0 : 20,
      }}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.5, once: false }}
    >
      {/* Splash background effect */}
      <div
        className="absolute top-0 left-0 right-0 bottom-0 opacity-10"
        style={{
          background,
          clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`,
          transform: "scale(0.75)",
          filter: "blur(40px)"
        }}
      />

      {/* Card Content */}
      <motion.div
        variants={cardVariants}
        whileTap={{ scale: isSoldOut ? 1 : 0.98 }}
        whileHover={{
          rotate: 0,
          y: -10,
          transition: { duration: 0.3 }
        }}
        onClick={() => !isSoldOut && onSelect(item)}
        className={`rounded-3xl overflow-hidden transition-all flex flex-col group relative w-full max-w-[340px] ${
          isSoldOut
            ? 'opacity-60 cursor-not-allowed'
            : 'cursor-pointer'
        }`}
        style={{
          transformOrigin: "center center",
          background: "linear-gradient(to bottom, #ffffff 0%, #fafaf9 100%)",
          border: "1px solid rgba(0, 0, 0, 0.06)",
          boxShadow: isSoldOut
            ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            : "0 10px 30px -5px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05), inset 0 -1px 0 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Sold Out Badge */}
        {isSoldOut && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
            SOLD OUT
          </div>
        )}

        {/* Image / Placeholder */}
        <div className={`relative h-52 bg-gradient-to-br ${bg} flex items-center justify-center overflow-hidden`} style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}>
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
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                  imgLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </>
          )}
          {!showPhoto && (
            <span className="text-7xl select-none group-hover:scale-125 transition-transform duration-300">
              {CATEGORY_EMOJI[item.category] ?? "🍽️"}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-2.5 flex-1 bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-sm">
          <h3 className="font-bold text-hilltop-charcoal text-xl leading-tight line-clamp-2 tracking-tight">
            {item.name}
          </h3>
          <p className="text-sm text-hilltop-gray-light flex-1 leading-relaxed line-clamp-2">
            {item.description}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="font-extrabold text-hilltop-green text-2xl tracking-tight">
              {formatCurrency(item.price)}
            </span>
            <button
              className="bg-hilltop-green text-white rounded-full p-3 hover:bg-hilltop-green-hover active:scale-95 transition-all shadow-lg flex-shrink-0 group-hover:scale-110 group-hover:shadow-xl"
              aria-label={`Add ${item.name}`}
              style={{
                boxShadow: "0 4px 14px 0 rgba(10, 79, 57, 0.39)"
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!isSoldOut) onSelect(item);
              }}
            >
              <Plus size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
