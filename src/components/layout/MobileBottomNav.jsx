import { Link, useLocation } from "react-router-dom";
import { Home, Gift, Clock, User } from "lucide-react";
import useOrderHistoryStore from "../../store/useOrderHistoryStore";
import useLoyaltyStore from "../../store/useLoyaltyStore";

export default function MobileBottomNav() {
  const location = useLocation();
  const orders = useOrderHistoryStore((s) => s.orders);
  const points = useLoyaltyStore((s) => s.points);

  // Hide bottom nav on checkout and confirmation pages
  if (location.pathname === "/checkout" || location.pathname === "/confirmation") {
    return null;
  }

  const navItems = [
    { path: "/", label: "Menu", icon: Home },
    { path: "/rewards", label: "Rewards", icon: Gift, badge: points > 0 ? "•" : null },
    { path: "/orders", label: "Orders", icon: Clock, badge: orders.length },
    { path: "/about", label: "About", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-hilltop-green z-50 safe-area-inset-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive
                  ? "text-hilltop-green"
                  : "text-hilltop-gray hover:text-hilltop-green"
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-hilltop-green text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "font-semibold" : ""}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-hilltop-green rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
