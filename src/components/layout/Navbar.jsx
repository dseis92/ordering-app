import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Clock, Info } from 'lucide-react';
import brand from '../../brand.config';
import useCartStore from '../../store/useCartStore';
import useOrderHistoryStore from '../../store/useOrderHistoryStore';
import Badge from '../ui/Badge';

export default function Navbar() {
  const location = useLocation();
  const items = useCartStore((s) => s.items);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const orders = useOrderHistoryStore((s) => s.orders);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const navLinks = [
    { path: '/orders', label: 'Orders', icon: Clock, badge: orders.length },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <nav className="sticky top-0 bg-white border-b border-gray-200 z-40 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-display font-bold text-xl text-hilltop-charcoal hover:text-hilltop-green transition-colors"
        >
          {brand.logo ? (
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-10 object-contain"
            />
          ) : (
            <span>{brand.name}</span>
          )}
        </Link>

        {/* Navigation Links + Cart */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-hilltop-green text-white'
                    : 'text-hilltop-gray hover:bg-hilltop-green/10 hover:text-hilltop-green'
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline text-sm font-medium">{link.label}</span>
                {link.badge > 0 && (
                  <span className={`text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                    isActive ? 'bg-white text-hilltop-green' : 'bg-hilltop-green text-white'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Cart Button */}
          <button
            onClick={toggleCart}
            className="relative p-2.5 rounded-full hover:bg-hilltop-green/10 transition-colors group"
            aria-label="Open cart"
          >
            <ShoppingCart
              size={22}
              className="text-hilltop-gray group-hover:text-hilltop-green transition-colors"
            />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-hilltop-green text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
