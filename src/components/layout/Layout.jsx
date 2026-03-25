import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";
import CartDrawer from "../cart/CartDrawer";
import NewsletterSignup from "../marketing/NewsletterSignup";

export default function Layout() {
  return (
    <div className="min-h-screen bg-hilltop-bg-light flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <CartDrawer />
      <NewsletterSignup />
    </div>
  );
}
