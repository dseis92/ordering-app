import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle, Clock, Phone, MapPin } from "lucide-react";
import useOrderStore from "../store/useOrderStore";
import useCartStore from "../store/useCartStore";
import brand from "../brand.config";
import Button from "../components/ui/Button";

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const orderNumber = useOrderStore((s) => s.orderNumber);
  const orderType = useOrderStore((s) => s.orderType);
  const estimatedTime = useOrderStore((s) => s.estimatedTime);
  const customerInfo = useOrderStore((s) => s.customerInfo);
  const reset = useOrderStore((s) => s.reset);

  useEffect(() => {
    if (!orderNumber) {
      navigate("/");
      return;
    }
    confetti({ particleCount: 160, spread: 80, origin: { y: 0.5 } });
  }, [orderNumber, navigate]);

  const handleDone = () => {
    reset();
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto px-4 py-12"
    >
      {/* Success Icon */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-block"
        >
          <CheckCircle size={80} className="text-green-500 mx-auto mb-4" strokeWidth={1.5} />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold text-hilltop-charcoal mb-2">
          Order Confirmed!
        </h1>
        <p className="text-hilltop-gray text-lg">
          Thanks for your order, {customerInfo.name}!
        </p>
      </div>

      {/* Order Number */}
      <div className="bg-hilltop-green text-white rounded-xl p-6 mb-6 text-center">
        <p className="text-sm font-medium opacity-90 mb-1">Order Number</p>
        <p className="text-3xl font-bold">{orderNumber}</p>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
        {/* Estimated Time */}
        <div className="flex items-start gap-3">
          <Clock size={24} className="text-hilltop-green mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-hilltop-charcoal">
              Estimated {orderType === "delivery" ? "Delivery" : "Pickup"} Time
            </p>
            <p className="text-hilltop-gray">
              {estimatedTime || brand.estimatedPickupMinutes} minutes
            </p>
          </div>
        </div>

        {/* Location/Contact */}
        {orderType === "pickup" ? (
          <div className="flex items-start gap-3">
            <MapPin size={24} className="text-hilltop-green mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-hilltop-charcoal">Pickup Location</p>
              <p className="text-hilltop-gray">{brand.name}</p>
              <p className="text-hilltop-gray">{brand.address}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <MapPin size={24} className="text-hilltop-green mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-hilltop-charcoal">Delivery Address</p>
              <p className="text-hilltop-gray">We'll deliver to your specified address</p>
            </div>
          </div>
        )}

        {/* Phone */}
        <div className="flex items-start gap-3">
          <Phone size={24} className="text-hilltop-green mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-hilltop-charcoal">Questions?</p>
            <a
              href={`tel:${brand.phone.replace(/\D/g, '')}`}
              className="text-hilltop-green hover:text-hilltop-green-hover transition-colors"
            >
              {brand.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Confirmation Email */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900 text-center">
          📧 A confirmation email has been sent to <strong>{customerInfo.email}</strong>
        </p>
      </div>

      {/* Payment Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-amber-900 text-center">
          💵 <strong>Payment:</strong> Pay with cash or card upon {orderType === "delivery" ? "delivery" : "pickup"}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button onClick={handleDone} className="w-full py-4 text-base">
          Back to Menu
        </Button>
        <button
          onClick={() => window.print()}
          className="w-full py-3 text-hilltop-green border border-hilltop-green rounded-lg hover:bg-hilltop-green hover:text-white transition-colors"
        >
          Print Order Details
        </button>
      </div>
    </motion.div>
  );
}
