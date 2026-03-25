import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";
import SwipeablePages from "../mobile/SwipeablePages";
import PullToRefresh from "../mobile/PullToRefresh";
import CartDrawer from "../cart/CartDrawer";
import NewsletterSignup from "../marketing/NewsletterSignup";

export default function Layout() {
  const location = useLocation();

  // Enable pull-to-refresh on main pages
  const enablePullToRefresh = ["/", "/catering", "/rewards", "/orders", "/about"].includes(
    location.pathname
  );

  const handleRefresh = async () => {
    // Simulate refresh - reload the current page data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.location.reload();
  };

  return (
    <SwipeablePages>
      <div className="min-h-screen bg-hilltop-bg-light flex flex-col">
        <Navbar />
        {enablePullToRefresh ? (
          <PullToRefresh onRefresh={handleRefresh}>
            <main className="flex-1">
              <Outlet />
            </main>
          </PullToRefresh>
        ) : (
          <main className="flex-1">
            <Outlet />
          </main>
        )}
        <Footer />
        <MobileBottomNav />
        <CartDrawer />
        <NewsletterSignup />
      </div>
    </SwipeablePages>
  );
}
