import { AnimatePresence, motion } from "framer-motion";
import MenuItemCard from "./MenuItemCard";

export default function MenuGrid({ items, onSelectItem }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            layout
          >
            <MenuItemCard item={item} onSelect={onSelectItem} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
