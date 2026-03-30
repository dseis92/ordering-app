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
    <div className="space-y-5">
      {specials.map((special, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${special.gradient} text-white p-7 sm:p-10 cursor-pointer group`}
          style={{
            boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
          }}
          onClick={() => onCategoryChange(special.category)}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>
          {/* Texture Overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />

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

            <p className="text-white/95 mb-5 text-base sm:text-lg max-w-2xl leading-relaxed">
              {special.description}
            </p>

            <button className="bg-white text-hilltop-green px-7 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-all group-hover:scale-105 shadow-xl tracking-wide" style={{
              boxShadow: "0 4px 14px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)"
            }}>
              {special.cta} →
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
