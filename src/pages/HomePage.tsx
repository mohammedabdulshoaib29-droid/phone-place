import Hero from '../components/Hero';
import BrandStatement from '../components/BrandStatement';
import Products from '../components/Products';
import PromoDisplay from '../components/PromoDisplay';
import NewsletterSignup from '../components/NewsletterSignup';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PromoDisplay />
      <BrandStatement />
      <Products />
      <NewsletterSignup />
    </>
  );
}
