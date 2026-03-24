import { formatCurrency } from "../../lib/formatters";
import { calcTax, calcTip, calcTotal } from "../../lib/tax";
import useOrderStore from "../../store/useOrderStore";

const TIP_OPTIONS = [0, 10, 15, 20, 25];

export default function CartSummary({ subtotal }) {
  const tipPercent = useOrderStore((s) => s.tipPercent);
  const setTipPercent = useOrderStore((s) => s.setTipPercent);

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">Subtotal</span>
        <span className="text-forest">{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Tax</span>
        <span className="text-forest">{formatCurrency(calcTax(subtotal))}</span>
      </div>

      <div>
        <p className="text-gray-500 mb-1.5">Tip</p>
        <div className="flex gap-1.5">
          {TIP_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => setTipPercent(t)}
              className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                tipPercent === t
                  ? "bg-forest text-white border-forest"
                  : "border-gray-200 text-forest hover:border-forest"
              }`}
            >
              {t === 0 ? "None" : `${t}%`}
            </button>
          ))}
        </div>
      </div>

      {tipPercent > 0 && (
        <div className="flex justify-between">
          <span className="text-gray-500">Tip ({tipPercent}%)</span>
          <span className="text-forest">
            {formatCurrency(calcTip(subtotal, tipPercent))}
          </span>
        </div>
      )}

      <div className="flex justify-between font-bold text-forest pt-2 border-t border-gray-200">
        <span>Total</span>
        <span>{formatCurrency(calcTotal(subtotal, tipPercent))}</span>
      </div>
    </div>
  );
}
