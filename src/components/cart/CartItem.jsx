import { Trash2 } from "lucide-react";
import useCartStore from "../../store/useCartStore";
import { formatCurrency } from "../../lib/formatters";

export default function CartItem({ item }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const selectionLabels = Object.values(item.selections ?? {})
    .flat()
    .join(", ");

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-forest truncate">{item.name}</p>
        {selectionLabels && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            {selectionLabels}
          </p>
        )}
        {item.specialInstructions && (
          <p className="text-xs text-gray-400 mt-0.5 italic truncate">
            &ldquo;{item.specialInstructions}&rdquo;
          </p>
        )}
        <p className="text-sm text-fern font-semibold mt-1">
          {formatCurrency(item.totalPrice)}
        </p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
          className="w-7 h-7 rounded-full border border-gray-200 text-forest flex items-center justify-center hover:bg-gray-50 font-medium"
        >
          &minus;
        </button>
        <span className="w-5 text-center font-medium text-sm">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
          className="w-7 h-7 rounded-full border border-gray-200 text-forest flex items-center justify-center hover:bg-gray-50 font-medium"
        >
          +
        </button>
        <button
          onClick={() => removeItem(item.cartId)}
          className="text-red-300 hover:text-red-500 ml-1 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
