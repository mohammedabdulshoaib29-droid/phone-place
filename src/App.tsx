import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import PoliciesPage from './pages/PoliciesPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import NotificationSettingsPage from './pages/NotificationSettingsPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import ReferralProgram from './pages/ReferralProgram';
import CouponManager from './pages/CouponManager';
import RepairBookingPage from './pages/RepairBookingPage';
import RepairTrackingPage from './pages/RepairTrackingPage';
import AccountDashboardPage from './pages/AccountDashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    gsap.utils.toArray<HTMLElement>('section').forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/book-repair" element={<RepairBookingPage />} />
            <Route path="/track-repair" element={<RepairTrackingPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />

            <Route
              path="/checkout/:id"
              element={
                <AuthGuard>
                  <CheckoutPage />
                </AuthGuard>
              }
            />
            <Route
              path="/order-success"
              element={
                <AuthGuard>
                  <OrderSuccessPage />
                </AuthGuard>
              }
            />
            <Route
              path="/my-orders"
              element={
                <AuthGuard>
                  <OrderHistoryPage />
                </AuthGuard>
              }
            />
            <Route
              path="/account"
              element={
                <AuthGuard>
                  <AccountDashboardPage />
                </AuthGuard>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthGuard>
                  <UserProfilePage />
                </AuthGuard>
              }
            />
            <Route
              path="/track/:orderId"
              element={
                <AuthGuard>
                  <OrderTrackingPage />
                </AuthGuard>
              }
            />

            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactPage />} />
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
