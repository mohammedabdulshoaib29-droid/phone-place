import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminPage from './pages/AdminPage';
import AboutUsPage from './pages/AboutUsPage';
import FAQPage from './pages/FAQPage';
import PoliciesPage from './pages/PoliciesPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import NotificationSettingsPage from './pages/NotificationSettingsPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import ReferralProgram from './pages/ReferralProgram';
import CouponManager from './pages/CouponManager';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"              element={<HomePage />} />
          <Route path="/products"      element={<ProductsPage />} />
          <Route path="/product/:id"   element={<ProductDetailPage />} />
          <Route path="/checkout/:id"  element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/about"         element={<AboutUsPage />} />
          <Route path="/faq"           element={<FAQPage />} />
          <Route path="/policies"      element={<PoliciesPage />} />
          <Route path="/track/:orderId" element={<OrderTrackingPage />} />
          <Route path="/my-orders"     element={<OrderHistoryPage />} />
          <Route path="/notifications" element={<NotificationSettingsPage />} />
          <Route path="/coupons"       element={<CouponManager />} />
          <Route path="/referral"      element={<ReferralProgram />} />
          <Route path="/admin"         element={<AdminPage />} />
          <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
