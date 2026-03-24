import { CardElement } from "@stripe/react-stripe-js";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "14px",
      fontFamily: "inherit",
      color: "#134611",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#ef4444" },
  },
};

export default function PaymentForm() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 space-y-1">
      <CardElement options={CARD_ELEMENT_OPTIONS} />
      <p className="text-xs text-gray-400 pt-1">
        Payments processed securely by Stripe
      </p>
    </div>
  );
}
