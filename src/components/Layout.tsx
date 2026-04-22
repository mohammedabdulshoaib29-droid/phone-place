import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#efe3c8] text-[#34281c]">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
