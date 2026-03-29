import { useState } from "react";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import brand from "../../brand.config";

export default function Footer() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const latitude = 44.5236;
  const longitude = -89.5746;

  const mapEmbedSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2839.8!2d-89.5746!3d44.5236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDMxJzI1LjAiTiA4OcKwMzQnMjguNiJX!5e0!3m2!1sen!2sus!4v1000000000000!5m2!1sen!2sus`;

  const handleGetDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      '_blank'
    );
  };

  return (
    <footer className="bg-hilltop-charcoal text-white/90 py-12 mt-16 border-t-4 border-hilltop-green">
      {/* Map Section */}
      <div className="max-w-5xl mx-auto px-4 mb-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Map Embed */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-hilltop-green/30 bg-gray-800">
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <MapPin className="w-10 h-10 text-hilltop-green animate-pulse" />
              </div>
            )}
            <iframe
              src={mapEmbedSrc}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsMapLoaded(true)}
              className="w-full h-[300px]"
            />
          </div>

          {/* Quick Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold text-white mb-6">Visit Us</h3>

            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-hilltop-green mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Location</p>
                <p className="text-white/80 text-sm">{brand.address.full}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={20} className="text-hilltop-green mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Phone</p>
                <a
                  href={`tel:${brand.phone.replace(/\D/g, '')}`}
                  className="text-hilltop-green hover:text-hilltop-green-hover transition-colors text-sm font-semibold"
                >
                  {brand.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={20} className="text-hilltop-green mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white mb-1">Hours</p>
                <p className="text-white/80 text-sm">{brand.hours.display}</p>
              </div>
            </div>

            <button
              onClick={handleGetDirections}
              className="mt-4 w-full bg-hilltop-green hover:bg-hilltop-green-hover text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Navigation size={18} />
              <span>Get Directions</span>
            </button>
          </div>
        </div>
      </div>

      {/* Original Footer Content */}
      <div className="max-w-5xl mx-auto px-4 pt-8 border-t border-white/10">
        <div className="grid sm:grid-cols-3 gap-8 text-sm mb-8">
          <div>
            <p className="font-display font-bold text-white text-xl mb-2">{brand.name}</p>
            <p className="text-hilltop-green font-semibold">{brand.tagline}</p>
          </div>
          <div>
            <p className="font-bold text-white mb-2 text-base">Quick Links</p>
            <ul className="space-y-1">
              <li><a href="/" className="hover:text-hilltop-green transition-colors">Menu</a></li>
              <li><a href="/about" className="hover:text-hilltop-green transition-colors">About</a></li>
              <li><a href="/catering" className="hover:text-hilltop-green transition-colors">Catering</a></li>
              <li><a href="/rewards" className="hover:text-hilltop-green transition-colors">Rewards</a></li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-white mb-2 text-base">Connect</p>
            <p className="text-white/80 text-sm leading-relaxed">
              Follow us on social media for daily specials and updates!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-6 border-t border-white/10 text-center text-xs text-white/60">
        <p>© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
