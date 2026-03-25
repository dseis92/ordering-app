import { motion } from "framer-motion";
import { Star, Calendar } from "lucide-react";

export default function DailySpecialsBanner({ onCategoryChange }) {
  const today = new Date().getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday

  // Determine which special to show
  const isFriday = today === 5;
  const isSaturday = today === 6;
  const isTuesday = today === 2;

  const specials = [];

  if (isFriday) {
    specials.push({
      title: "🐟 Friday Fish Fry Special!",
      description: "Our famous fish fry created by Kathy Mitchell in the early 1980s — served all day!",
      cta: "View Fish Fry Menu",
      category: "fish-fry",
      gradient: "from-blue-500 to-cyan-500",
    });
  }

  if (isSaturday) {
    specials.push({
      title: "🍖 Saturday Special: BBQ Ribs",
      description: "Fall-off-the-bone tender ribs with our house-made BBQ sauce",
      cta: "View Dinners",
      category: "dinners",
      gradient: "from-orange-500 to-red-500",
    });
  }

  if (isTuesday) {
    specials.push({
      title: "🍝 Tuesday Special: Spaghetti Dinner",
      description: "Classic spaghetti with homemade meat sauce and garlic bread",
      cta: "View Dinners",
      category: "dinners",
      gradient: "from-purple-500 to-pink-500",
    });
  }

  // Always show fish fry promotion (since it's their signature item)
  if (!isFriday) {
    specials.push({
      title: "🐟 Famous Fish Fry",
      description: "Since the 1980s — Our signature dish available daily!",
      cta: "View Fish Fry Menu",
      category: "fish-fry",
      gradient: "from-hilltop-green to-emerald-600",
    });
  }

  return (
    <div className="space-y-4">
      {specials.map((special, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${special.gradient} text-white p-6 sm:p-8 shadow-lg cursor-pointer group`}
          onClick={() => onCategoryChange(special.category)}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star size={24} className="fill-white" />
                <h2 className="text-2xl sm:text-3xl font-display font-bold">
                  {special.title}
                </h2>
              </div>
              {(isFriday || isSaturday || isTuesday) && (
                <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  <Calendar size={14} />
                  <span>Today</span>
                </div>
              )}
            </div>

            <p className="text-white/90 mb-4 text-base sm:text-lg max-w-2xl">
              {special.description}
            </p>

            <button className="bg-white text-hilltop-green px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all group-hover:scale-105 shadow-md">
              {special.cta} →
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
