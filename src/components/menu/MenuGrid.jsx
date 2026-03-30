import { AnimatePresence, motion } from "framer-motion";
import { MenuProductCard } from "../ui/menu-product-card";

export default function MenuGrid({ items, onSelectItem }) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-7 pb-24">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            layout
            className="w-full"
          >
            <MenuProductCard item={item} onSelect={onSelectItem} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
