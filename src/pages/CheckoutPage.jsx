import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import stripePromise from "../lib/stripe";
import useCartStore from "../store/useCartStore";
import useOrderStore from "../store/useOrderStore";
import OrderTypeToggle from "../components/checkout/OrderTypeToggle";
import CustomerForm from "../components/checkout/CustomerForm";
import DeliveryAddressForm from "../components/checkout/DeliveryAddressForm";
import PaymentForm from "../components/checkout/PaymentForm";
import CartSummary from "../components/cart/CartSummary";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";

// Inner form has access to the Stripe context provided by <Elements>
function CheckoutForm() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const orderType = useOrderStore((s) => s.orderType);
  const customerInfo = useOrderStore((s) => s.customerInfo);
  const setOrderNumber = useOrderStore((s) => s.setOrderNumber);
  const setStatus = useOrderStore((s) => s.setStatus);

  const [submitting, setSubmitting] = useState(false);
  const [cardError, setCardError] = useState(null);

  const subtotal = items.reduce((s, i) => s + i.totalPrice * i.quantity, 0);
  const isValid = customerInfo.name.trim() && customerInfo.phone.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || !stripe || !elements) return;

    setSubmitting(true);
    setStatus("submitting");
    setCardError(null);

    // Step 1 — tokenize the card details
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        name: customerInfo.name,
        email: customerInfo.email || undefined,
        phone: customerInfo.phone || undefined,
      },
    });

    if (error) {
      setCardError(error.message);
      setStatus("error");
      setSubmitting(false);
      return;
    }

    // Step 2 — send paymentMethod.id + order details to your backend
    // Your backend creates a PaymentIntent and confirms it, then returns the order number.
    // Replace the block below with a real fetch() call when your backend is ready:
    //
    // const res = await fetch("/api/orders", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     paymentMethodId: paymentMethod.id,
    //     items,
    //     orderType,
    //     customerInfo,
    //   }),
    // });
    // const { orderNumber } = await res.json();

    // Simulated backend response — remove once your API is live:
    await new Promise((r) => setTimeout(r, 800));
    const orderNumber = `#${Math.floor(10000 + Math.random() * 90000)}`;
    console.log("Payment method created:", paymentMethod.id);

    setOrderNumber(orderNumber);
    setStatus("confirmed");
    clearCart();
    navigate("/confirmation");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section>
        <h2 className="font-semibold text-forest mb-3">Order Type</h2>
        <OrderTypeToggle />
      </section>

      <section>
        <h2 className="font-semibold text-forest mb-3">Your Info</h2>
        <CustomerForm />
      </section>

      <AnimatePresence>
        {orderType === "delivery" && (
          <motion.section
            key="delivery-address"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <h2 className="font-semibold text-forest mb-3">Delivery Address</h2>
            <DeliveryAddressForm />
          </motion.section>
        )}
      </AnimatePresence>

      <section>
        <h2 className="font-semibold text-forest mb-3">Order Summary</h2>
        <div className="bg-white rounded-2xl p-4">
          {items.map((item) => (
            <div key={item.cartId} className="flex justify-between text-sm py-1.5">
              <span className="text-forest">
                {item.quantity}&times; {item.name}
              </span>
              <span className="text-gray-500">
                ${(item.totalPrice * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-100 mt-3 pt-3">
            <CartSummary subtotal={subtotal} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-semibold text-forest mb-3">Payment</h2>
        <PaymentForm />
        {cardError && (
          <p className="text-red-500 text-sm mt-2">{cardError}</p>
        )}
      </section>

      <Button
        type="submit"
        disabled={submitting || !isValid || !stripe}
        className="w-full py-4 text-base flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Spinner size="sm" /> Placing Order&hellip;
          </>
        ) : (
          "Place Order"
        )}
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);

  if (items.length === 0) {
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-forest/60 hover:text-forest mb-6 text-sm transition-colors"
      >
        <ChevronLeft size={16} /> Back to menu
      </button>

      <h1 className="text-3xl font-bold text-forest mb-8">Checkout</h1>

      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
