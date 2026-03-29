import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import MenuPage from "./pages/MenuPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import AboutPage from "./pages/AboutPage";
import CateringPage from "./pages/CateringPage";
import RewardsPage from "./pages/RewardsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import useAuthStore from "./store/useAuthStore";

// Lazy load admin pages to reduce initial bundle size
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminMenuManagementPage = lazy(() => import("./pages/admin/AdminMenuManagementPage"));
const ProtectedRoute = lazy(() => import("./components/admin/ProtectedRoute"));

// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-hilltop-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-hilltop-gray">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);

  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { background: "#134611", color: "#fff", borderRadius: "12px" },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
        {/* Auth Routes (no layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/catering" element={<CateringPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute>
              <AdminMenuManagementPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
