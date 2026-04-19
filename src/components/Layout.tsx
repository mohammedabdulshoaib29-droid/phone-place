import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="bg-carbon text-ivory min-h-screen">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
