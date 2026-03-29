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

  // Generate gradient background based on category
  const gradientColors = {
    appetizers: ["#fef3c7", "#fed7aa"],
    "fish-fry": ["#dbeafe", "#cffafe"],
    burgers: ["#fee2e2", "#fed7aa"],
    dinners: ["#f3e8ff", "#fce7f3"],
    salads: ["#dcfce7", "#d1fae5"],
  };

  const colors = gradientColors[item.category] || ["#f3f4f6", "#f9fafb"];
  const background = `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;

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
        className="absolute top-0 left-0 right-0 bottom-0 opacity-20"
        style={{
          background,
          clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`,
          transform: "scale(0.8)",
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
        className={`bg-white rounded-2xl overflow-hidden border-2 border-gray-200 transition-all flex flex-col group relative w-full max-w-[320px] ${
          isSoldOut
            ? 'opacity-60 cursor-not-allowed'
            : 'hover:shadow-2xl hover:border-hilltop-green cursor-pointer'
        }`}
        style={{
          transformOrigin: "center center",
          boxShadow:
            "0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075), 0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075), 0 0 16px hsl(0deg 0% 0% / 0.075)",
        }}
      >
        {/* Sold Out Badge */}
        {isSoldOut && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
            SOLD OUT
          </div>
        )}

        {/* Image / Placeholder */}
        <div className={`relative h-48 bg-gradient-to-br ${bg} flex items-center justify-center overflow-hidden`}>
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
        <div className="p-5 flex flex-col gap-2 flex-1">
          <h3 className="font-bold text-hilltop-charcoal text-lg leading-tight line-clamp-2">
            {item.name}
          </h3>
          <p className="text-sm text-hilltop-gray flex-1 leading-relaxed line-clamp-2">
            {item.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-hilltop-charcoal text-xl">
              {formatCurrency(item.price)}
            </span>
            <button
              className="bg-hilltop-green text-white rounded-full p-2.5 hover:bg-hilltop-green-hover active:scale-95 transition-all shadow-md flex-shrink-0 group-hover:scale-110"
              aria-label={`Add ${item.name}`}
              onClick={(e) => {
                e.stopPropagation();
                if (!isSoldOut) onSelect(item);
              }}
            >
              <Plus size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
