import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminPage from './pages/AdminPage';
import AboutUsPage from './pages/AboutUsPage';
import FAQPage from './pages/FAQPage';
import PoliciesPage from './pages/PoliciesPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ReturnsPage from './pages/ReturnsPage';
import NotificationSettingsPage from './pages/NotificationSettingsPage';
import UserProfilePage from './pages/UserProfilePage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import ReferralProgram from './pages/ReferralProgram';
import CouponManager from './pages/CouponManager';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/"              element={<HomePage />} />
              <Route path="/login"         element={<LoginPage />} />
              <Route path="/register"      element={<RegisterPage />} />
              <Route path="/products"      element={<ProductsPage />} />
              <Route path="/product/:id"   element={<ProductDetailPage />} />
              <Route
                path="/cart"
                element={
                  <AuthGuard>
                    <CartPage />
                  </AuthGuard>
                }
              />
              <Route
                path="/checkout"
                element={
                  <AuthGuard>
                    <CheckoutPage />
                  </AuthGuard>
                }
              />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/about"         element={<AboutUsPage />} />
              <Route path="/faq"           element={<FAQPage />} />
              <Route path="/policies"      element={<PoliciesPage />} />
              <Route path="/track/:orderId" element={<OrderTrackingPage />} />
              <Route path="/my-orders"     element={<OrderHistoryPage />} />
              <Route
                path="/profile"
                element={
                  <AuthGuard>
                    <UserProfilePage />
                  </AuthGuard>
                }
              />
              <Route path="/returns"       element={<ReturnsPage />} />
              <Route path="/notifications" element={<NotificationSettingsPage />} />
              <Route path="/coupons"       element={<CouponManager />} />
              <Route path="/referral"      element={<ReferralProgram />} />
              <Route path="/admin"         element={<AdminPage />} />
              <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
