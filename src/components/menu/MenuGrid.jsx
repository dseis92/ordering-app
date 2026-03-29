import { AnimatePresence } from "framer-motion";
import { StackCard } from "../ui/stack-card";

export default function MenuGrid({ items, onSelectItem }) {
  return (
    <div className="w-full max-w-2xl mx-auto pb-24">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <StackCard
            key={item.id}
            item={item}
            onSelect={onSelectItem}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
