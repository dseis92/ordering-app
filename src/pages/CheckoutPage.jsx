import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import useCartStore from "../store/useCartStore";
import useOrderStore from "../store/useOrderStore";
import OrderTypeToggle from "../components/checkout/OrderTypeToggle";
import CustomerForm from "../components/checkout/CustomerForm";
import DeliveryAddressForm from "../components/checkout/DeliveryAddressForm";
import CartSummary from "../components/cart/CartSummary";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import brand from "../brand.config";

function CheckoutForm() {
  const navigate = useNavigate();

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const orderType = useOrderStore((s) => s.orderType);
  const customerInfo = useOrderStore((s) => s.customerInfo);
  const deliveryAddress = useOrderStore((s) => s.deliveryAddress);
  const setOrderNumber = useOrderStore((s) => s.setOrderNumber);
  const setStatus = useOrderStore((s) => s.setStatus);
  const setEstimatedTime = useOrderStore((s) => s.setEstimatedTime);

  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [notes, setNotes] = useState("");

  const subtotal = items.reduce((s, i) => s + i.totalPrice * i.quantity, 0);
  const deliveryFee = orderType === "delivery" ? brand.deliveryFee : 0;
  const tax = (subtotal + deliveryFee) * brand.taxRate;
  const total = subtotal + deliveryFee + tax;

  const isValid =
    customerInfo.name.trim() &&
    customerInfo.phone.trim() &&
    customerInfo.email.trim() &&
    (orderType === "pickup" ||
     (deliveryAddress.street && deliveryAddress.city && deliveryAddress.state && deliveryAddress.zip));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setStatus("submitting");
    setOrderError(null);

    try {
      // Format delivery address as string
      const formattedDeliveryAddress = orderType === "delivery"
        ? `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zip}`
        : null;

      // Prepare order data
      const orderData = {
        customer: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
        },
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.totalPrice,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions,
        })),
        orderType,
        deliveryAddress: formattedDeliveryAddress,
        notes: notes.trim() || null,
        subtotal,
        deliveryFee,
        tax,
        total,
        estimatedTime: orderType === "delivery"
          ? brand.estimatedDeliveryMinutes
          : brand.estimatedPickupMinutes,
      };

      // Submit order to API
      const res = await fetch("/api/orders/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit order");
      }

      // Update order store with response data
      setOrderNumber(data.order.orderNumber);
      setEstimatedTime(data.order.estimatedTime);
      setStatus("confirmed");
      clearCart();
      navigate("/confirmation");
    } catch (error) {
      console.error("Error submitting order:", error);
      setOrderError(error.message || "Failed to submit order. Please try again.");
      setStatus("error");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section>
        <h2 className="font-semibold text-hilltop-charcoal mb-3">Order Type</h2>
        <OrderTypeToggle />
      </section>

      <section>
        <h2 className="font-semibold text-hilltop-charcoal mb-3">Your Info</h2>
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
            <h2 className="font-semibold text-hilltop-charcoal mb-3">Delivery Address</h2>
            <DeliveryAddressForm />
          </motion.section>
        )}
      </AnimatePresence>

      <section>
        <h2 className="font-semibold text-hilltop-charcoal mb-3">Special Instructions (Optional)</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special requests or dietary requirements?"
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hilltop-green focus:border-transparent resize-none"
        />
      </section>

      <section>
        <h2 className="font-semibold text-hilltop-charcoal mb-3">Order Summary</h2>
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          {items.map((item) => (
            <div key={item.cartId} className="flex justify-between text-sm py-1.5">
              <span className="text-hilltop-charcoal">
                {item.quantity}&times; {item.name}
              </span>
              <span className="text-hilltop-gray">
                ${(item.totalPrice * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-200 mt-3 pt-3">
            <CartSummary subtotal={subtotal} />
          </div>
        </div>
      </section>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          <strong>💵 Payment:</strong> Pay with cash or card upon {orderType === "delivery" ? "delivery" : "pickup"}
        </p>
      </div>

      {orderError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{orderError}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={submitting || !isValid}
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
        className="flex items-center gap-1 text-hilltop-gray hover:text-hilltop-charcoal mb-6 text-sm transition-colors"
      >
        <ChevronLeft size={16} /> Back to menu
      </button>

      <h1 className="text-3xl font-bold text-hilltop-charcoal mb-8">Checkout</h1>

      <CheckoutForm />
    </div>
  );
}
