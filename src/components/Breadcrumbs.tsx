import { useLocation, Link } from 'react-router-dom';

type BreadcrumbItem = {
  label: string;
  path: string;
};

export default function Breadcrumbs() {
  const location = useLocation();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const parts = path.split('/').filter(Boolean);

    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];

    let currentPath = '';
    parts.forEach((part) => {
      currentPath += `/${part}`;

      if (part === 'products') {
        breadcrumbs.push({ label: 'Products', path: '/products' });
      } else if (part === 'product') {
        breadcrumbs.push({ label: 'Product Details', path: currentPath });
      } else if (part === 'checkout') {
        breadcrumbs.push({ label: 'Checkout', path: currentPath });
      } else if (part === 'order-success') {
        breadcrumbs.push({ label: 'Order Confirmation', path: currentPath });
      } else if (part === 'admin') {
        breadcrumbs.push({ label: 'Admin', path: currentPath });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav
      className="pt-24 pb-6 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
      aria-label="Breadcrumbs"
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-silver/50 text-xs">/</span>
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="font-body text-silver text-xs uppercase tracking-widest">
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="font-body text-gold text-xs uppercase tracking-widest hover:text-gold-pale transition-colors"
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
