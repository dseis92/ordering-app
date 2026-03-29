import brand from "../../brand.config";

export default function Footer() {
  return (
    <footer className="bg-hilltop-charcoal text-white/90 py-12 mt-16 border-t-4 border-hilltop-green">
      <div className="max-w-5xl mx-auto px-4 grid sm:grid-cols-3 gap-8 text-sm">
        <div>
          <p className="font-display font-bold text-white text-xl mb-2">{brand.name}</p>
          <p className="text-hilltop-green font-semibold">{brand.tagline}</p>
        </div>
        <div>
          <p className="font-bold text-white mb-2 text-base">Location</p>
          <p className="leading-relaxed">{brand.address.full}</p>
        </div>
        <div>
          <p className="font-bold text-white mb-2 text-base">Contact &amp; Hours</p>
          <a href={`tel:${brand.phone.replace(/\D/g, '')}`} className="block text-hilltop-green hover:text-hilltop-green-hover transition-colors font-semibold">
            {brand.phone}
          </a>
          <p className="mt-2 leading-relaxed">{brand.hours.display}</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/60">
        <p>© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
