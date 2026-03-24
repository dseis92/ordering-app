import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import brand from "../../brand.config";
import useCartStore from "../../store/useCartStore";
import Badge from "../ui/Badge";

export default function Navbar() {
  const items = useCartStore((s) => s.items);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="sticky top-0 bg-white border-b border-gray-200 z-40 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-gray-900 hover:text-brand-primary transition-colors">
          {brand.logo ? (
            <img src={brand.logo} alt={brand.name} className="h-8" />
          ) : (
            <span>{brand.name}</span>
          )}
        </Link>
        <button
          onClick={toggleCart}
          className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors group"
          aria-label="Open cart"
        >
          <ShoppingCart size={22} className="text-gray-700 group-hover:text-brand-primary transition-colors" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
