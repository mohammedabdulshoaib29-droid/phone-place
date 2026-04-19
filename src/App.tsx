import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminPage from './pages/AdminPage';

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
          <Route path="/admin"         element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
