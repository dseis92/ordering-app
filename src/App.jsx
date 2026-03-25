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

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { background: "#134611", color: "#fff", borderRadius: "12px" },
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/catering" element={<CateringPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
