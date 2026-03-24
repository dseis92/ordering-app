import brand from "../../brand.config";

export default function Footer() {
  return (
    <footer className="bg-forest text-white/80 py-10 mt-16">
      <div className="max-w-5xl mx-auto px-4 grid sm:grid-cols-3 gap-6 text-sm">
        <div>
          <p className="font-bold text-white text-lg mb-1">{brand.name}</p>
          <p>{brand.tagline}</p>
        </div>
        <div>
          <p className="font-semibold text-white mb-1">Location</p>
          <p>{brand.address}</p>
        </div>
        <div>
          <p className="font-semibold text-white mb-1">Contact &amp; Hours</p>
          <p>{brand.phone}</p>
          <p className="mt-0.5">{brand.hours}</p>
        </div>
      </div>
    </footer>
  );
}
