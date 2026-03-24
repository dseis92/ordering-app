import { motion } from "framer-motion";
import { categories } from "../../data/menu";

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 sticky top-16 bg-hilltop-bg-light z-10 pt-3">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`relative flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
            active === cat.id
              ? "text-white shadow-md"
              : "text-hilltop-gray hover:text-hilltop-charcoal bg-white hover:shadow"
          }`}
        >
          {active === cat.id && (
            <motion.span
              layoutId="category-pill"
              className="absolute inset-0 bg-hilltop-green rounded-full"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative whitespace-nowrap">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
