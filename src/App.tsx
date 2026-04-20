import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes (no layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            
            {/* Protected Routes - require auth */}
            <Route path="/checkout/:id" element={
              <AuthGuard><CheckoutPage /></AuthGuard>
            } />
            <Route path="/order-success" element={
              <AuthGuard><OrderSuccessPage /></AuthGuard>
            } />
            <Route path="/my-orders" element={
              <AuthGuard><OrderHistoryPage /></AuthGuard>
            } />
            <Route path="/track/:orderId" element={
              <AuthGuard><OrderTrackingPage /></AuthGuard>
            } />
            
            {/* Public Routes */}
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/notifications" element={<NotificationSettingsPage />} />
            <Route path="/coupons" element={<CouponManager />} />
            <Route path="/referral" element={<ReferralProgram />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
