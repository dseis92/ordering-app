import { motion } from "framer-motion";
import { categories } from "../../data/menu";

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="flex justify-center gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sticky top-16 z-10 pt-4" style={{
      background: "linear-gradient(to bottom, #fafaf9 0%, rgba(250, 250, 249, 0.95) 100%)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(0, 0, 0, 0.05)"
    }}>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`relative flex-shrink-0 px-6 py-3 rounded-full text-sm font-bold transition-all ${
            active === cat.id
              ? "text-white"
              : "text-hilltop-gray hover:text-hilltop-charcoal bg-white/80 backdrop-blur-sm hover:bg-white"
          }`}
          style={active === cat.id ? {} : {
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
            border: "1px solid rgba(0, 0, 0, 0.05)"
          }}
        >
          {active === cat.id && (
            <motion.span
              layoutId="category-pill"
              className="absolute inset-0 bg-hilltop-green rounded-full"
              style={{
                boxShadow: "0 4px 12px rgba(10, 79, 57, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
              }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative whitespace-nowrap tracking-wide">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
