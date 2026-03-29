import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Clock, Info, UtensilsCrossed, Gift, Search, Menu } from 'lucide-react';
import brand from '../../brand.config';
import useCartStore from '../../store/useCartStore';
import useOrderHistoryStore from '../../store/useOrderHistoryStore';
import useLoyaltyStore from '../../store/useLoyaltyStore';
import useMenuStore from '../../store/useMenuStore';
import { Sheet, SheetContent, SheetFooter } from '../ui/sheet';
import { SearchModal } from '../ui/search-modal';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const items = useCartStore((s) => s.items);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const orders = useOrderHistoryStore((s) => s.orders);
  const points = useLoyaltyStore((s) => s.points);
  const menuItems = useMenuStore((s) => s.items);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const navLinks = [
    { path: '/catering', label: 'Catering', icon: UtensilsCrossed },
    {
      path: '/rewards',
      label: 'Rewards',
      icon: Gift,
      badge: points > 0 ? points : null,
    },
    { path: '/orders', label: 'Orders', icon: Clock, badge: orders.length },
    { path: '/about', label: 'About', icon: Info },
  ];

  const handleSelectMenuItem = (item) => {
    // Scroll to menu section if not already there
    if (location.pathname !== '/') {
      window.location.href = '/';
    } else {
      document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b backdrop-blur-lg',
        'bg-hilltop-green/95 supports-[backdrop-filter]:bg-hilltop-green/80',
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex cursor-pointer items-center gap-2 hover:opacity-90 transition-opacity"
        >
          {brand.logo ? (
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-10 object-contain"
            />
          ) : (
            <p className="font-display text-xl font-bold text-white">{brand.name}</p>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-2">
          {/* Desktop Links */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'relative flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm font-medium',
                    isActive
                      ? 'bg-white text-hilltop-green'
                      : 'text-white/90 hover:bg-white/20 hover:text-white'
                  )}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                  {link.badge > 0 && (
                    <span
                      className={cn(
                        'text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center',
                        isActive
                          ? 'bg-hilltop-green text-white'
                          : 'bg-white text-hilltop-green'
                      )}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Search Button */}
          <SearchModal data={menuItems} onSelectItem={handleSelectMenuItem}>
            <button
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:bg-white/20 hover:text-white transition-colors"
              aria-label="Search menu"
            >
              <Search size={18} />
              <span className="hidden md:inline text-sm font-medium">Search</span>
              <kbd className="hidden xl:inline-flex items-center gap-1 text-xs bg-white/10 px-2 py-0.5 rounded border border-white/20">
                <span className="text-xs">⌘K</span>
              </kbd>
            </button>
          </SearchModal>

          {/* Cart Button */}
          <button
            onClick={toggleCart}
            className="relative p-2.5 rounded-full hover:bg-white/20 transition-colors group"
            aria-label="Open cart"
          >
            <ShoppingCart
              size={22}
              className="text-white/90 group-hover:text-white transition-colors"
            />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-hilltop-green text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2.5 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} className="text-white" />
            </button>
            <SheetContent
              className="bg-hilltop-green/95 supports-[backdrop-filter]:bg-hilltop-green/80 gap-0 backdrop-blur-lg border-hilltop-green-hover"
              showClose={true}
              side="left"
            >
              <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'relative flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium',
                        isActive
                          ? 'bg-white text-hilltop-green'
                          : 'text-white/90 hover:bg-white/20 hover:text-white'
                      )}
                    >
                      <Icon size={18} />
                      <span>{link.label}</span>
                      {link.badge > 0 && (
                        <span
                          className={cn(
                            'ml-auto text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center',
                            isActive
                              ? 'bg-hilltop-green text-white'
                              : 'bg-white text-hilltop-green'
                          )}
                        >
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
