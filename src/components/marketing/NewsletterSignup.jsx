import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle, X } from "lucide-react";
import Button from "../ui/Button";

export default function NewsletterSignup({ inline = false }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, this would send to your email marketing service
    console.log("Newsletter signup:", email);

    setSubscribed(true);
    setLoading(false);
    setEmail("");

    // Reset after 3 seconds
    setTimeout(() => {
      setSubscribed(false);
      if (!inline) setShowModal(false);
    }, 3000);
  };

  if (inline) {
    return (
      <div className="bg-gradient-to-r from-hilltop-green to-emerald-600 rounded-2xl p-6 sm:p-8 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <Mail size={40} className="mx-auto mb-4" />
          <h3 className="text-2xl sm:text-3xl font-display font-bold mb-2">
            Stay in the Loop!
          </h3>
          <p className="text-white/90 mb-6">
            Get exclusive deals, new menu items, and special offers delivered to your inbox.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg p-6"
            >
              <CheckCircle size={48} className="mx-auto mb-3" />
              <p className="font-semibold text-lg">Thanks for subscribing!</p>
              <p className="text-sm text-white/80 mt-1">Check your inbox for a welcome offer.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-hilltop-charcoal focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-white text-hilltop-green hover:bg-gray-100 px-8 py-3"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          )}

          <p className="text-xs text-white/70 mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    );
  }

  // Modal version (for pop-up)
  return (
    <>
      {!showModal && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-20 md:bottom-6 right-6 bg-hilltop-green text-white px-6 py-3 rounded-full shadow-lg hover:bg-hilltop-green-hover transition-all z-40 flex items-center gap-2"
        >
          <Mail size={20} />
          <span className="hidden sm:inline">Get Special Offers</span>
        </button>
      )}

      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 max-w-md bg-white rounded-2xl p-6 shadow-2xl z-50"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-hilltop-gray hover:text-hilltop-charcoal"
              >
                <X size={24} />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-hilltop-green to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={32} className="text-white" />
                </div>

                <h3 className="text-2xl font-display font-bold text-hilltop-charcoal mb-2">
                  Special Offer!
                </h3>
                <p className="text-hilltop-gray mb-6">
                  Subscribe to get <strong>10% off</strong> your next order plus exclusive deals.
                </p>

                {subscribed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-6"
                  >
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                    <p className="font-semibold text-green-900 text-lg">You're subscribed!</p>
                    <p className="text-sm text-green-700 mt-1">
                      Check your email for your 10% off code.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hilltop-green focus:border-transparent"
                    />
                    <Button type="submit" disabled={loading} className="w-full py-3">
                      {loading ? "Subscribing..." : "Get My 10% Off"}
                    </Button>
                  </form>
                )}

                <p className="text-xs text-hilltop-gray mt-4">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
