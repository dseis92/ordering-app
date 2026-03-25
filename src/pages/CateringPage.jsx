import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Phone, Mail, Calendar, CheckCircle, UtensilsCrossed, ChevronRight } from "lucide-react";
import brand from "../brand.config";
import Button from "../components/ui/Button";

export default function CateringPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    guestCount: "",
    eventType: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would send to an API
    console.log("Catering inquiry:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        eventDate: "",
        guestCount: "",
        eventType: "",
        message: "",
      });
    }, 3000);
  };

  const packages = [
    {
      name: "Appetizer Package",
      price: "Starting at $12/person",
      description: "Perfect for cocktail hours and receptions",
      items: [
        "Wisconsin Cheese Curds",
        "Chicken Wings (choice of sauce)",
        "Chicken Flippers",
        "Vegetable tray with dip",
        "Chips & salsa",
      ],
      icon: "🧀",
    },
    {
      name: "Fish Fry Package",
      price: "Starting at $18/person",
      description: "Our famous fish fry for your special event",
      items: [
        "Hand-battered fish (Perch or Cod)",
        "Coleslaw",
        "French fries",
        "Rye bread",
        "House tartar sauce",
      ],
      icon: "🐟",
      featured: true,
    },
    {
      name: "BBQ Package",
      price: "Starting at $22/person",
      description: "Hearty BBQ favorites for larger gatherings",
      items: [
        "Fall-off-the-bone ribs",
        "Pulled pork",
        "Baked beans",
        "Coleslaw",
        "Cornbread",
      ],
      icon: "🍖",
    },
    {
      name: "Build Your Own",
      price: "Custom pricing",
      description: "Create a custom menu for your event",
      items: [
        "Choose from our full menu",
        "Mix and match favorites",
        "Dietary accommodations",
        "Flexible portions",
        "Personalized service",
      ],
      icon: "🍽️",
    },
  ];

  const eventTypes = [
    "Corporate Event",
    "Wedding",
    "Birthday Party",
    "Graduation",
    "Holiday Party",
    "Sports Event",
    "Other",
  ];

  return (
    <div className="bg-hilltop-bg-light min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-hilltop-green to-emerald-600 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <UtensilsCrossed size={48} className="mx-auto mb-4" strokeWidth={1.5} />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-4">
              Catering & Private Events
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 font-light mb-6">
              Let us make your event unforgettable
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#packages"
                className="inline-block bg-white text-hilltop-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Packages
              </a>
              <a
                href="#contact"
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-hilltop-green transition-colors"
              >
                Get a Quote
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-hilltop-charcoal mb-8 text-center">
          Why Choose Hilltop Catering?
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-6 border border-gray-200"
          >
            <CheckCircle size={40} className="text-hilltop-green mb-4" />
            <h3 className="font-bold text-hilltop-charcoal text-xl mb-2">40+ Years Experience</h3>
            <p className="text-hilltop-gray">
              Since the 1980s, we've been perfecting recipes and serving the Stevens Point community.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 border border-gray-200"
          >
            <Users size={40} className="text-hilltop-green mb-4" />
            <h3 className="font-bold text-hilltop-charcoal text-xl mb-2">Any Size Event</h3>
            <p className="text-hilltop-gray">
              From intimate gatherings of 10 to large events of 200+, we've got you covered.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 border border-gray-200"
          >
            <UtensilsCrossed size={40} className="text-hilltop-green mb-4" />
            <h3 className="font-bold text-hilltop-charcoal text-xl mb-2">Flexible Options</h3>
            <p className="text-hilltop-gray">
              Choose from packages or build a custom menu. We accommodate all dietary needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Catering Packages */}
      <section id="packages" className="bg-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-hilltop-charcoal mb-4 text-center">
            Catering Packages
          </h2>
          <p className="text-hilltop-gray text-center mb-12 max-w-2xl mx-auto">
            All packages include setup, serving utensils, plates, and napkins. Delivery available within 15 miles.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl p-6 border-2 ${
                  pkg.featured
                    ? "border-hilltop-green bg-gradient-to-br from-hilltop-green/5 to-emerald-50"
                    : "border-gray-200 bg-white"
                } relative`}
              >
                {pkg.featured && (
                  <div className="absolute -top-3 right-6 bg-hilltop-green text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="text-5xl mb-4">{pkg.icon}</div>
                <h3 className="font-display font-bold text-2xl text-hilltop-charcoal mb-2">
                  {pkg.name}
                </h3>
                <p className="text-hilltop-green font-bold text-lg mb-3">{pkg.price}</p>
                <p className="text-hilltop-gray mb-4">{pkg.description}</p>
                <ul className="space-y-2">
                  {pkg.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-hilltop-gray">
                      <CheckCircle size={16} className="text-hilltop-green mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <h2 className="text-3xl font-display font-bold text-hilltop-charcoal mb-2">
            Request a Quote
          </h2>
          <p className="text-hilltop-gray mb-6">
            Fill out the form below and we'll get back to you within 24 hours.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
            >
              <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-green-900 text-xl mb-2">Thank You!</h3>
              <p className="text-green-700">
                We've received your catering inquiry and will contact you soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-hilltop-charcoal mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hilltop-green focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-hilltop-charcoal mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hilltop-green focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-hilltop-charcoal mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hilltop-green focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-hilltop-charcoal mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hilltop-green focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-hilltop-charcoal mb-1">
                    Number of Guests *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hilltop-green focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-hilltop-charcoal mb-1">
                    Event Type *
                  </label>
                  <select
                    required
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hilltop-green focus:border-transparent"
                  >
                    <option value="">Select type...</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-hilltop-charcoal mb-1">
                  Additional Details
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your event, dietary restrictions, package preferences, etc."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-hilltop-green focus:border-transparent resize-none"
                />
              </div>

              <Button type="submit" className="w-full py-3">
                Submit Inquiry
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Private Dining */}
      <section className="bg-hilltop-green text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-center">
              Private Dining Available
            </h2>
            <p className="text-white/90 text-center mb-8 max-w-2xl mx-auto">
              Host your event in our private dining area. Perfect for rehearsal dinners, business meetings, and celebrations.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <Users size={24} className="flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Seating Capacity</h3>
                  <p className="text-white/90">Accommodates up to 50 guests comfortably</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar size={24} className="flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Booking</h3>
                  <p className="text-white/90">Reserve your date at least 2 weeks in advance</p>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <a
                href={`tel:${brand.phone.replace(/\D/g, '')}`}
                className="inline-flex items-center gap-2 bg-white text-hilltop-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Phone size={20} />
                Call to Book: {brand.phone}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
