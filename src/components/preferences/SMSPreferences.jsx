import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff, MessageSquare, CheckCircle } from "lucide-react";
import Button from "../ui/Button";

export default function SMSPreferences() {
  const [phone, setPhone] = useState("");
  const [notifications, setNotifications] = useState({
    orderReceived: true,
    orderReady: true,
    outForDelivery: true,
    promotions: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In production, this would save to backend/database
    console.log("SMS Preferences:", { phone, notifications });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const allDisabled = !Object.values(notifications).some(v => v);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-hilltop-green/10 rounded-full flex items-center justify-center">
          <MessageSquare size={24} className="text-hilltop-green" />
        </div>
        <div>
          <h3 className="font-bold text-hilltop-charcoal text-lg">
            SMS Notifications
          </h3>
          <p className="text-sm text-hilltop-gray">
            Get real-time updates about your orders
          </p>
        </div>
      </div>

      {/* Phone Number */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-hilltop-charcoal mb-2">
          Mobile Phone Number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(555) 123-4567"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hilltop-green focus:border-transparent"
        />
        <p className="text-xs text-hilltop-gray mt-2">
          Standard messaging rates may apply
        </p>
      </div>

      {/* Notification Types */}
      <div className="space-y-3 mb-6">
        <p className="text-sm font-medium text-hilltop-charcoal mb-3">
          Notify me when:
        </p>

        {[
          {
            key: "orderReceived",
            label: "Order Received",
            description: "Your order has been received",
          },
          {
            key: "orderReady",
            label: "Order Ready",
            description: "Your order is ready for pickup",
          },
          {
            key: "outForDelivery",
            label: "Out for Delivery",
            description: "Your order is on its way",
          },
          {
            key: "promotions",
            label: "Special Offers",
            description: "Exclusive deals and promotions",
          },
        ].map((item) => (
          <label
            key={item.key}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={notifications[item.key]}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  [item.key]: e.target.checked,
                })
              }
              className="mt-1 w-5 h-5 text-hilltop-green border-gray-300 rounded focus:ring-hilltop-green focus:ring-2"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {notifications[item.key] ? (
                  <Bell size={16} className="text-hilltop-green" />
                ) : (
                  <BellOff size={16} className="text-gray-400" />
                )}
                <p className="font-medium text-hilltop-charcoal text-sm">
                  {item.label}
                </p>
              </div>
              <p className="text-xs text-hilltop-gray mt-0.5">
                {item.description}
              </p>
            </div>
          </label>
        ))}
      </div>

      {/* Save Button */}
      {saved ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
        >
          <CheckCircle size={24} className="text-green-500" />
          <div>
            <p className="font-semibold text-green-900">Preferences Saved!</p>
            <p className="text-sm text-green-700">
              You'll receive SMS updates at {phone}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <Button
            onClick={handleSave}
            disabled={!phone || allDisabled}
            className="w-full py-3"
          >
            Save Preferences
          </Button>
          {allDisabled && (
            <p className="text-xs text-amber-600 text-center">
              Please enable at least one notification type
            </p>
          )}
        </div>
      )}

      {/* Privacy Notice */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-hilltop-gray">
          By providing your phone number, you agree to receive automated SMS messages.
          Reply STOP to opt-out. Message and data rates may apply.
        </p>
      </div>
    </div>
  );
}
