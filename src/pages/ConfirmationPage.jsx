import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import useOrderStore from "../store/useOrderStore";
import brand from "../brand.config";
import Button from "../components/ui/Button";

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const orderNumber = useOrderStore((s) => s.orderNumber);
  const orderType = useOrderStore((s) => s.orderType);
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
      className="max-w-md mx-auto px-4 py-24 text-center"
    >
      <div className="text-8xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold text-forest mb-2">Order Confirmed!</h1>
      <p className="text-lg text-fern font-semibold mb-1">{orderNumber}</p>
      <p className="text-gray-500 mb-8">
        {orderType === "pickup"
          ? `Ready for pickup in about ${brand.estimatedPickupMinutes} minutes. We'll text you when it's ready.`
          : "We'll start preparing your order and deliver it shortly."}
      </p>
      <Button onClick={handleDone} className="w-full">
        Back to Menu
      </Button>
    </motion.div>
  );
}
