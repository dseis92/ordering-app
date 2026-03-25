import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Mail, Award, Users, Heart } from "lucide-react";
import brand from "../brand.config";

export default function AboutPage() {
  return (
    <div className="bg-hilltop-bg-light min-h-screen">
      {/* Hero Section */}
      <div className="bg-hilltop-green text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-4">
              About Hilltop Pub and Grill
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 font-light">
              {brand.tagline}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Our Story */}
      <section className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-hilltop-charcoal mb-6">
            Our Story
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-hilltop-gray leading-relaxed mb-4">
              Since the early 1980s, Hilltop Pub and Grill has been a cherished gathering place in Stevens Point, Wisconsin. What started as a humble neighborhood pub has grown into a beloved local institution, known far and wide for exceptional food, warm hospitality, and a welcoming atmosphere.
            </p>
            <p className="text-hilltop-gray leading-relaxed mb-4">
              Our journey began when we opened our doors on Main Street, bringing the community together over good food and great company. Over the decades, we've stayed true to our roots while continuously evolving to serve our community better.
            </p>
            <p className="text-hilltop-gray leading-relaxed">
              Today, Hilltop Pub and Grill remains family-owned and operated, committed to the same values that guided us from day one: quality ingredients, generous portions, and treating every guest like family.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Famous Fish Fry */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Award size={32} className="text-hilltop-green" />
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-hilltop-charcoal">
                  Our Famous Fish Fry
                </h2>
              </div>
              <p className="text-hilltop-gray leading-relaxed mb-4">
                In the early 1980s, our founder Kathy Mitchell created what would become our signature dish — the Hilltop Fish Fry. What started as a Friday tradition quickly became so popular that we now serve it every day of the week.
              </p>
              <p className="text-hilltop-gray leading-relaxed mb-4">
                Kathy's secret? Start with the freshest fish, hand-batter it to perfection, and fry it to golden crispy goodness. Served with our homemade coleslaw, crispy fries, and house tartar sauce, it's a meal that keeps generations coming back.
              </p>
              <p className="text-hilltop-gray leading-relaxed font-semibold">
                Available daily — because when it's this good, why limit it to Fridays?
              </p>
            </div>
            <div className="w-full md:w-1/3">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-50 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🐟</div>
                <p className="font-display font-bold text-2xl text-hilltop-charcoal mb-2">
                  Since 1980s
                </p>
                <p className="text-hilltop-gray">
                  Served fresh daily
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-hilltop-charcoal mb-8 text-center">
            What We Stand For
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <Heart size={40} className="mx-auto text-hilltop-green mb-4" strokeWidth={1.5} />
              <h3 className="font-bold text-hilltop-charcoal text-xl mb-2">Quality First</h3>
              <p className="text-hilltop-gray text-sm leading-relaxed">
                We source the finest ingredients and prepare everything fresh daily with care and attention to detail.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <Users size={40} className="mx-auto text-hilltop-green mb-4" strokeWidth={1.5} />
              <h3 className="font-bold text-hilltop-charcoal text-xl mb-2">Community</h3>
              <p className="text-hilltop-gray text-sm leading-relaxed">
                We're proud to be part of Stevens Point, supporting local events and treating neighbors like family.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <Award size={40} className="mx-auto text-hilltop-green mb-4" strokeWidth={1.5} />
              <h3 className="font-bold text-hilltop-charcoal text-xl mb-2">Tradition</h3>
              <p className="text-hilltop-gray text-sm leading-relaxed">
                Decades of experience perfecting recipes and creating memories that span generations.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact Info */}
      <section className="bg-hilltop-green text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-8 text-center">
              Visit Us
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <MapPin size={24} className="flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Location</h3>
                  <p className="text-white/90">{brand.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone size={24} className="flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Phone</h3>
                  <a
                    href={`tel:${brand.phone.replace(/\D/g, '')}`}
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    {brand.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock size={24} className="flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Hours</h3>
                  <p className="text-white/90">{brand.hours}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail size={24} className="flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Website</h3>
                  <a
                    href="https://hilltoppubandgrill.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    hilltoppubandgrill.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/20 text-center">
              <p className="text-white/90 mb-4">
                We look forward to serving you soon!
              </p>
              <a
                href="/"
                className="inline-block bg-white text-hilltop-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Order Online
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
