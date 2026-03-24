import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { formatCurrency } from "../../lib/formatters";
import { makeCartId } from "../../lib/cartId";
import useCartStore from "../../store/useCartStore";

export default function CustomizeModal({ item, onClose }) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [selections, setSelections] = useState({});
  const [specialInstructions, setSpecialInstructions] = useState("");

  if (!item) return null;

  const extraCost = item.options.reduce((sum, opt) => {
    const sel = selections[opt.id];
    if (!sel) return sum;
    if (Array.isArray(sel)) {
      return (
        sum +
        sel.reduce((s2, choiceId) => {
          const c = opt.choices.find((c) => c.id === choiceId);
          return s2 + (c?.priceAdd ?? 0);
        }, 0)
      );
    }
    const choice = opt.choices.find((c) => c.id === sel);
    return sum + (choice?.priceAdd ?? 0);
  }, 0);

  const totalPrice = item.price + extraCost;
  const canAdd = item.options.every(
    (opt) => !opt.required || selections[opt.id]
  );

  const handleAdd = () => {
    addItem({
      cartId: makeCartId(item.id, selections),
      itemId: item.id,
      name: item.name,
      selections,
      specialInstructions: specialInstructions.trim(),
      totalPrice,
    });
    toast.success(`${item.name} added to cart`);
    openCart();
    onClose();
  };

  const handleClose = () => {
    setSelections({});
    setSpecialInstructions("");
    onClose();
  };

  return (
    <Modal isOpen={!!item} onClose={handleClose} title={item.name}>
      <p className="text-hilltop-gray text-sm mb-6 leading-relaxed">{item.description}</p>

      {item.options.map((opt) => (
        <div key={opt.id} className="mb-6 pb-6 border-b border-gray-100 last:border-0">
          <p className="font-bold text-hilltop-charcoal mb-3">
            {opt.label}{" "}
            {opt.required && (
              <span className="text-red-500 font-semibold text-xs bg-red-50 px-2 py-0.5 rounded">Required</span>
            )}
          </p>
          <div className="space-y-2">
            {opt.choices.map((choice) => {
              const selected = opt.multiple
                ? (selections[opt.id] ?? []).includes(choice.id)
                : selections[opt.id] === choice.id;

              const toggle = () => {
                if (opt.multiple) {
                  const current = selections[opt.id] ?? [];
                  setSelections({
                    ...selections,
                    [opt.id]: selected
                      ? current.filter((id) => id !== choice.id)
                      : [...current, choice.id],
                  });
                } else {
                  setSelections({ ...selections, [opt.id]: choice.id });
                }
              };

              return (
                <button
                  key={choice.id}
                  onClick={toggle}
                  className={`w-full px-4 py-3 rounded-lg border-2 text-left font-medium transition-all flex items-center justify-between ${
                    selected
                      ? "bg-hilltop-green/5 border-hilltop-green text-hilltop-green"
                      : "bg-white border-gray-200 text-hilltop-gray hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      selected
                        ? "border-hilltop-green bg-hilltop-green"
                        : "border-gray-300"
                    }`}>
                      {selected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span>{choice.label}</span>
                  </div>
                  {choice.priceAdd > 0 && (
                    <span className="text-sm font-semibold text-gray-500">
                      +{formatCurrency(choice.priceAdd)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mb-6">
        <p className="font-bold text-hilltop-charcoal mb-3">Special Instructions</p>
        <textarea
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          placeholder="Add a note (e.g., no pickles, extra sauce)"
          rows={3}
          maxLength={200}
          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-hilltop-green resize-none transition-colors"
        />
        <p className="text-xs text-gray-400 mt-1">{specialInstructions.length}/200</p>
      </div>

      <Button onClick={handleAdd} disabled={!canAdd} className="w-full mt-2 py-4 text-base bg-hilltop-green hover:bg-hilltop-green-hover disabled:bg-gray-300 disabled:cursor-not-allowed">
        Add to Cart • {formatCurrency(totalPrice)}
      </Button>
    </Modal>
  );
}
