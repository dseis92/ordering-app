import { useState } from 'react';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import brand from '../../brand.config';

export default function LocationMap() {
  const [isLoading, setIsLoading] = useState(true);

  // Hilltop Pub coordinates (approximate)
  const latitude = 44.5236;
  const longitude = -89.5746;

  // Google Maps embed URL (generated from Google Maps share -> embed)
  const mapEmbedSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2839.8!2d-89.5746!3d44.5236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDMxJzI1LjAiTiA4OcKwMzQnMjguNiJX!5e0!3m2!1sen!2sus!4v1000000000000!5m2!1sen!2sus`;

  const handleGetDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      '_blank'
    );
  };

  const handleCallPhone = () => {
    window.location.href = `tel:${brand.phone.replace(/\D/g, '')}`;
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-hilltop-charcoal mb-4">
            Visit Us
          </h2>
          <p className="text-lg text-hilltop-gray max-w-2xl mx-auto">
            Come experience Stevens Point's favorite pub since the 1980s
          </p>
        </motion.div>

        {/* Map and Info Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-5 gap-8 items-start"
        >
          {/* Map */}
          <div className="md:col-span-3">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-hilltop-green/20 bg-gray-100">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-hilltop-green/10 to-amber-50">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-hilltop-green mx-auto mb-3 animate-bounce" />
                    <p className="text-hilltop-gray font-medium">Loading map...</p>
                  </div>
                </div>
              )}
              <iframe
                src={mapEmbedSrc}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setIsLoading(false)}
                className="w-full h-[450px]"
              />
            </div>
          </div>

          {/* Info Card */}
          <div className="md:col-span-2 space-y-6">
            {/* Address */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-hilltop-green/10 rounded-xl">
                  <MapPin className="w-6 h-6 text-hilltop-green" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-hilltop-charcoal mb-2">Address</h3>
                  <p className="text-hilltop-gray leading-relaxed">
                    {brand.address.street}<br />
                    {brand.address.city}, {brand.address.state} {brand.address.zip}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              onClick={handleCallPhone}
              className="w-full bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-hilltop-green/30 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-hilltop-green/10 rounded-xl group-hover:bg-hilltop-green/20 transition-colors">
                  <Phone className="w-6 h-6 text-hilltop-green" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg text-hilltop-charcoal mb-2">Phone</h3>
                  <p className="text-hilltop-green font-semibold text-lg group-hover:underline">
                    {brand.phone}
                  </p>
                </div>
              </div>
            </motion.button>

            {/* Hours */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-hilltop-green/10 rounded-xl">
                  <Clock className="w-6 h-6 text-hilltop-green" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-hilltop-charcoal mb-3">Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-hilltop-gray">Monday</span>
                      <span className="text-hilltop-charcoal font-medium">{brand.hours.monday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-hilltop-gray">Tuesday - Saturday</span>
                      <span className="text-hilltop-charcoal font-medium">{brand.hours.tuesday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-hilltop-gray">Sunday</span>
                      <span className="text-hilltop-charcoal font-medium">{brand.hours.sunday}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Get Directions Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              onClick={handleGetDirections}
              className="w-full bg-hilltop-green hover:bg-hilltop-green-hover text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 group"
            >
              <Navigation className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Get Directions</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Additional Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-12 bg-gradient-to-r from-hilltop-green to-hilltop-green-hover rounded-2xl p-8 text-white text-center shadow-xl"
        >
          <p className="text-lg md:text-xl font-semibold mb-2">
            Located in the heart of Stevens Point
          </p>
          <p className="text-white/90">
            Easy parking available • Dine-in, takeout, and delivery options
          </p>
        </motion.div>
      </div>
    </section>
  );
}
